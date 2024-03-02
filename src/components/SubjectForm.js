import React, { useState } from 'react';

const SubjectForm = ({ onAddSubject }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value // If files exist, set the image, otherwise set the value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const imagePath = await uploadImage(formData.image, formData.name);
  
      // Call onAddSubject function with new subject data and imagePath
      await onAddSubject({
        name: formData.name,
        description: formData.description,
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
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" accept="image/*" name="image" onChange={handleChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default SubjectForm;
