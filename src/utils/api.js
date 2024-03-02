const fetch = require('node-fetch');

const apiUrl =  process.env.APP_API_URL || 'http://vmedu315.mtacloud.co.il'

// Function to update the state of all cameras to disabled
const updateAllCamerasStates = async (isEnabled) => {
    try {
        const response = await fetch(`${apiUrl}/cameras`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isEnabled: isEnabled, // Set all cameras to disabled
        }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cameras');
        } else {
        console.log('All cameras updated!');
        }
    } catch (error) {
        console.error('Error updating camera states:', error);
    }
};

// Function to fetch subject data from the API
const fetchSubjects = async () => {
    try {
        const response = await fetch(`${apiUrl}/subjects`);
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};

// Function to fetch users data from the API
const fetchUsers = async () => {
    try {
        const response = await fetch(`${apiUrl}/users`);
        if (!response.ok) {
        throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }   
};
// Function to make an API request to create the subject in the database
const createSubject = async (newSubject) => {
    try {
      const response = await fetch(`${apiUrl}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      });
      return response.json();
    } catch (error) {
      throw new Error('Error creating subject:', error);
    }
};
  
  // Function to make an API request to delete the subject from the database
const deleteSubject = async (subject) => {
    try {
      const response = await fetch(`${apiUrl}/subjects/${subject.id}`, {
        method: 'DELETE',
      });
  
      // Check if the response status is not in the 2xx range
      if (!response.ok) {
        throw new Error(`Failed to delete subject: ${response.statusText}`);
      }
  
    } catch (error) {
      throw new Error('Error deleting subject:', error);
    }
};

const createAlert = async(alert) => {  

    try {
      const response = await fetch(`${apiUrl}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create alert: ${response.statusText}`);
      }
  
      console.log('Alert sent to API server successfully');
    } catch (error) {
      console.error('Error sending alert to API server:', error);
    }
}

module.exports = { fetchSubjects, updateAllCamerasStates, fetchUsers, createSubject, deleteSubject, createAlert };