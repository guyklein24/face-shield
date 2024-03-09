
const fs = require('fs');
const path = require('path');


// Function to write subject data to the filesystem
const writeSubjectEncodingToFile = (subject) => {
    const filePath = path.join(process.cwd(), 'watchlist', 'subject_encodings', `${subject.name}.txt`);
    try {
      fs.writeFileSync(filePath, subject.faceEncoding.toString());
      console.log('Subjects data written to file:', filePath);
    } catch (error) {
      console.error('Error writing subjects data to file:', error);
    }
};
  
// Function to delete the subject file
const deleteSubjectFile = (subjectName) => {
    const filePath = path.join(process.cwd(), 'watchlist', 'subject_encodings', `${subjectName}.txt`);
    try {
      fs.unlinkSync(filePath);
      console.log('Subject file deleted:', filePath);
    } catch (error) {
      console.error('Error deleting subject file:', error);
    }
};

// Function to save subject image to filesystem
const writeSubjectImageToFile = async(base64image, subjectName) => {
    try {
        // Decode base64 data and save image to filesystem
        const imageBuffer = Buffer.from(base64image, 'base64');
        const destinationPath = path.join(process.cwd(), 'watchlist', 'subject_images', `${subjectName}.jpg`);
        await fs.promises.writeFile(destinationPath, imageBuffer);
        console.log('Image saved:', destinationPath);
        return destinationPath; // Return image path if needed
    } catch (error) {
        console.error('Error saving image:', error);
    }
}

module.exports = { deleteSubjectFile, writeSubjectEncodingToFile, writeSubjectImageToFile};
