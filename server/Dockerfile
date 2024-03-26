# Use the official Python image as a base
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install Flask and other dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask application files to the working directory
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run the Flask server
CMD ["python", "server.py"]
