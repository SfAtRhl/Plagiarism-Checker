import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const SweetAlert = ({ similarityResults }) => {
  useEffect(() => {
    if (
      similarityResults &&
      Array.isArray(similarityResults) &&
      similarityResults.length > 0
    ) {
      Swal.fire({
        icon:
          similarityResults[0].similarity_score.toFixed(2) > 0.5
            ? "error"
            : "success",
        title:
          similarityResults[0].similarity_score.toFixed(2) > 0.5
            ? "Oops... Similarity Score"
            : "Ok, Similarity Score",
        text:
          Math.floor(similarityResults[0].similarity_score.toFixed(2) * 100) +
          "%",
        customClass: {
          popup: "dark-mode",
          header: "dark-mode",
          content: "dark-mode",
          footer: "dark-mode",
        },
        showConfirmButton: false,
      });
    }
  }, [similarityResults]);

  return null;
};

export default SweetAlert;
