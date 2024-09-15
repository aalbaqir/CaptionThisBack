import React, { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('media', file);
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Caption:', data.caption);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Generate Caption</button>
    </form>
  );
}

export default UploadForm;
