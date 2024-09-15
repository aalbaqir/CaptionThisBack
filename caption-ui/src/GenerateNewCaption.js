import React, { useState } from 'react';

function GenerateNewCaption({ imagePath, setCaption }) {
  const [loading, setLoading] = useState(false);

  const generateNewCaption = async () => {
    if (!imagePath) {
      console.error('No image path found');
      return;
    }

    console.log('Button clicked! Generating new caption...');

    setLoading(true); // Set loading state while generating a new caption

    try {
      const response = await fetch('http://localhost:3000/generate_new_caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imagePath }), // Send the image URL to the backend
      });

      const data = await response.json();
      if (response.ok) {
        setCaption(data.caption); // Update with the new caption
        console.log('New caption generated:', data.caption);
      } else {
        console.error('Failed to generate new caption:', data.error);
        alert('Failed to generate new caption');
      }
    } catch (error) {
      console.error('Error generating new caption:', error);
      alert('Error generating new caption');
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div>
      <button 
        className="new-caption-button" 
        onClick={generateNewCaption} 
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate New Caption'}
      </button>
    </div>
  );
}

export default GenerateNewCaption;
