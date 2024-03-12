import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [similarityResults, setSimilarityResults] = useState(null);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file1);
    formData.append("file", file2);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSimilarityResults(response.data.plagiarism_results);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center text-white h-screen ">
      <h1 className="text-4xl font-bold mb-3 text-center">
        Plagiarism Checker
      </h1>
      <p className="text-sm md:text-lg font-normal md:font-medium mb-8 text-center">
        A Plagiarism Checker scans and evaluates content for unauthorized
        copying, ensuring originality.
      </p>

      <div className="flex flex-col md:flex-row justify-between mx-auto gap-4">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">File 1:</label>
          <input
            type="file"
            onChange={handleFile1Change}
            className="file-input"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">File 2:</label>
          <input
            type="file"
            onChange={handleFile2Change}
            className="file-input"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Check Plagiarism
      </motion.button>

      {similarityResults && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h2 className="text-2xl font-bold mb-2">Similarity Results:</h2>
          <ul>
            {similarityResults.map((result, index) => (
              <li key={index} className="mb-2 text-lg">
                {result.document1} and {result.document2}: Similarity Score -{" "}
                {result.similarity_score.toFixed(2)}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default App;
