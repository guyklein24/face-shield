// SubjectForm.js

import React, { useState } from 'react';

const SubjectForm = ({ onAddSubject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const imagePath = await uploadImage(image, name);
  
      // Call onAddSubject function with new subject data and imagePath
      onAddSubject({
        name,
        description,
        imagePath,
      });
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const uploadImage = async (imageFile, subjectName) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Image = reader.result.split(',')[1]; // Extract base64 data
          const imagePath = await window.api.uploadImage(base64Image, subjectName);
          console.log('Image uploaded successfully.');
          resolve(imagePath); // Resolve with the image path
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(error);
      }
    });
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default SubjectForm;
