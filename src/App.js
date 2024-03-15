import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "sweetalert2/dist/sweetalert2.min.css";
import SweetAlert from "./sweetalert";
import Cover from "./cover";

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [error, setError] = useState(false);
  const [similarityResults, setSimilarityResults] = useState(null);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (!file2 || !file1) {
      setError(true);
    } else {
      setError(false);
    }
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

  const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeOut",
    },
    backgroundColor: {
      duration: 0,
      yoyo: Infinity,
      ease: "easeOut",
      repeatDelay: 0.8,
    },
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center text-white h-screen ">
      <Cover />
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
            required
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 text-base"
      >
        Check Plagiarism
      </motion.button>
      <motion.div
        className=" w-full text-center  absolute bottom-8 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        This Simple Plagiarism Checker can take only .txt or .pdf files
      </motion.div>
      {similarityResults && (
        <SweetAlert similarityResults={similarityResults} />
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className=" text-red-400 py-4 text-base font-medium absolute bottom-24"
        >
          something went wrong :()
        </motion.div>
      )}
    </div>
  );
};

export default App;
