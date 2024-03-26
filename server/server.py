from flask import Flask, request, jsonify,render_template
from flask_cors import CORS 
import os
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from arango import ArangoClient

app = Flask(__name__)
CORS(app)


# Initialize ArangoDB connection
client = ArangoClient()
sys_db = client.db('_system', username='root', password='root')
db_name = 'Plagiarism'
collection_name = 'results_collection'

if not sys_db.has_database(db_name):
    sys_db.create_database(db_name)

db = client.db(db_name, username='root', password='root')

if not db.has_collection(collection_name):
    db.create_collection(collection_name)

def extract_text_from_pdf(file):
    pdf_text = ""
    pdf_reader = PyPDF2.PdfReader(file)
    
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        pdf_text += page.extract_text()

    return pdf_text


def vectorize(Text):
    return TfidfVectorizer().fit_transform(Text).toarray()


def similarity(doc1, doc2):
    return cosine_similarity([doc1, doc2])


def check_plagiarism(text_vector_a, text_vector_b, student_a, student_b):
    sim_score = similarity(text_vector_a, text_vector_b)[0][1]

    result = {
        'document1': student_a,
        'document2': student_b,
        'similarity_score': sim_score
    }
    return result

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_files():
    uploaded_files = request.files.getlist('file')
    uploaded_texts = []
    docs = []


    for file in uploaded_files:
        if file.filename.endswith('.pdf'):
            content = extract_text_from_pdf(file)
        else:
            content = file.read().decode('utf-8')
        doc = {
            'filename': file.filename,
            'content': content
        }
        uploaded_texts.append(content)
        docs.append(docs)

    vectors = vectorize(uploaded_texts)
    s_vectors = list(zip(uploaded_files, vectors))


    plagiarism_results = []

    for student_a, text_vector_a in s_vectors:
        new_vectors = s_vectors.copy()
        current_index = new_vectors.index((student_a, text_vector_a))
        del new_vectors[current_index]
        for student_b, text_vector_b in new_vectors:
            result = check_plagiarism(text_vector_a, text_vector_b, student_a.filename, student_b.filename)
            plagiarism_results.append(result)

            # Store the results in ArangoDB collection
            db[collection_name].insert(plagiarism_results[0])
            
    return jsonify({'plagiarism_results': plagiarism_results})

if __name__ == '__main__':
    app.run(debug=True)
