import React, { useState } from 'react';
import './App.css';
import GenerateNewCaption from './GenerateNewCaption'; // Import the GenerateNewCaption component

function App() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [imageURL, setImageURL] = useState(''); // State to store image URL
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState(''); // Store the server file path for reuse

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Set loading state while the request is being processed

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setCaption(data.caption);    // Update the caption
        setImageURL(data.image_url); // Update the image URL
        setImagePath(data.image_url); // Store the image URL for reuse in "New Caption"
        console.log('Image path set:', data.image_url); // Log to ensure imagePath is set correctly
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Image Captioning App</h1>
        <form className="upload-form" onSubmit={handleFileUpload}>
          <input type="file" className="file-input" onChange={handleFileChange} />
          <button className="upload-button" type="submit" disabled={!file || loading}>
            {loading ? 'Processing...' : 'Generate Caption'}
          </button>
        </form>

        {imageURL && (
          <div className="image-container">
            <img 
              src={imageURL} 
              alt="Uploaded" 
              className="uploaded-image"
            />
          </div>
        )}

        {caption && (
          <div className="caption-container">
            <h2>Generated Caption</h2>
            <p>{caption}</p>
          </div>
        )}

        {imageURL && !loading && (
          // Include the GenerateNewCaption component and pass props
          <GenerateNewCaption 
            imagePath={imagePath} 
            setCaption={setCaption} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
