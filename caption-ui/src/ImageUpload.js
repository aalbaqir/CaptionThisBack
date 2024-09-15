import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData);
      setImageURL(response.data.image_url); // Set the image URL
      setCaption(response.data.caption); // Set the generated caption
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Upload and Caption Generator</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Display the uploaded image and its caption */}
      {imageURL && (
        <div>
          <img src={imageURL} alt="Uploaded" style={{ width: '300px', marginTop: '20px' }} />
          <p><strong>Caption:</strong> {caption}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
