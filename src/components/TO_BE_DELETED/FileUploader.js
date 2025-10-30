import React from "react";

const styles = {
  container: { margin: "10px 0" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }
};

export default function FileUploader({ onUpload }) {
  const handleFileUpload = function (event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      const data = JSON.parse(e.target.result);
      onUpload(data);
    };
    fileReader.readAsText(event.target.files[0]);
  };

  return React.createElement(
    "div",
    { style: styles.container },
    React.createElement("input", {
      type: "file",
      accept: ".json",
      onChange: handleFileUpload,
      style: styles.input
    })
  );
}
