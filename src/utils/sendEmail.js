const nodemailer = require('nodemailer');

// Function to send email alert based on alert data
const sendEmailAlert = async(alertData, recipients) => {

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'face.shield.alerts@gmail.com',
          pass: 'vrmi evto bbim fbhb'
        }
      });
  
      const message = `ALERT: Unauthorized Access Detected\n\n` +
        `An unauthorized person was detected by the security system.\n\n` +
        `Subject Name: ${alertData.subjectName}\n` +
        `Timestamp: ${new Date(alertData.timestamp * 1000).toLocaleString()}\n` +
        `Camera Name: ${alertData.cameraName}`;
  
      const mailOptions = {
        from: 'face.shield.alerts@gmail.com',
        to: recipients.join(', '),
        subject: '[ALERT]: Unauthorized Access Detected!',
        text: message
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
};

module.exports = { sendEmailAlert };