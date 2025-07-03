import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateGroup.css';
import { useNavigate } from 'react-router-dom';

const CreateGroup = ({ onGroupCreated }) => {
  const nav = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = 'https://chat-application-xf9j.onrender.com';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(url+'/allUsers'); // Replace with your API endpoint
        (response.data.users,'data');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      alert('Please fill in all fields and select at least one user.');
      return;
    }

    setIsSubmitting(true);

    try {
      ("inside try");
      
      const response = await axios.post(url+'/saveGroupChat', {
        groupName,
        users: selectedUsers,
        adminId: localStorage.getItem('userId'),
      });
     
      
      

      if(response.data.success){ 
        alert('Group created successfully!');
        setGroupName('');
        setSelectedUsers([]);
         nav('/Home')
      }
    } catch (error) {
      alert('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-group-container">
      <h2>Create a New Group</h2>
      <div className="form-group">
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Select Users:</label>
        <div className="users-list">
          {users.map((user) => (
            <div
              key={user._id}
              className={`user-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user._id)}
            >
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Group'}
      </button>
    </div>
  );
};

export default CreateGroup;

