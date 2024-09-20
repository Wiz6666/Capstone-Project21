import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

// EditableField component allows editing of specific user profile fields
const EditableField = ({ label, value, field, userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // Track if the field is in editing mode
  const [editValue, setEditValue] = useState(value); // Store the current edit value
  const inputRef = useRef(null); // Reference for the input field

  // Handle switching to edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value); // Reset value to the original value when editing starts
  };

  // Handle saving the updated value
  const handleSave = async () => {
    try {
      // Update the specific field in the Users table in Supabase
      const { error } = await supabase
        .from('Users')
        .update({ [field]: editValue })
        .eq('user_id', userId);

      if (error) throw error; // Handle error if update fails

      onUpdate(field, editValue); // Call the onUpdate callback to update parent component
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  // Handle clicks outside of the input field to cancel editing
  const handleClickOutside = (event) => {
    if (isEditing && inputRef.current && !inputRef.current.contains(event.target)) {
      setIsEditing(false); // Cancel editing if clicked outside
      setEditValue(value);  // Reset to the original value
    }
  };

  // Add or remove event listeners for detecting clicks outside the input field
  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Map field names to appropriate icons for display
  const getIconForField = (field) => {
    switch (field) {
      case 'username': return '👤';
      case 'role': return '👥';
      case 'email': return '✉️';
      case 'phone_number': return '📞';
      default: return '❓';
    }
  };

  return (
    <div style={styles.infoGroup}>
      <div style={styles.labelRow}>
        <span style={styles.icon}>{getIconForField(field)}</span>
        <span style={styles.infoLabel}>{label}</span>
      </div>
      {isEditing ? (
        <div style={styles.editContainer} ref={inputRef}>
          {/* Input field for editing */}
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            {/* Save and Cancel buttons */}
            <button onClick={handleSave} style={styles.saveButton}>Save</button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      ) : (
        <span style={styles.infoText} onClick={handleEdit}>{value}</span>
      )}
    </div>
  );
};

// ProfilePage component displays user information and allows editing
const ProfilePage = () => {
  // State variables for user data and other page states
  const [avatar, setAvatar] = useState('/person.png'); // Default avatar image
  const [name, setName] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [email, setEmail] = useState('Unknown');
  const [phone, setPhone] = useState('Unknown');
  const [userId, setUserId] = useState(null); // Stores logged-in user's ID
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for profile data
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Modal state for avatar upload
  const [tempAvatar, setTempAvatar] = useState(null); // Temporary avatar preview
  const avatarModalRef = useRef(null); // Reference for the avatar modal

  // Fetch user profile data from Supabase when component loads
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true); // Set loading state
    try {
      // Fetch logged-in user's data
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        setUserId(user.id);
        setEmail(user.email || 'Unknown');

        // Fetch the rest of the user's profile from the Users table
        const { data, error } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setName(data.username || 'Unknown');
          setRole(data.role || 'Unknown');
          setPhone(data.phone_number || 'Unknown');
          setAvatar(data.avatar_url || '/person.png');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message); // Set error message if fetching fails
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Handle avatar upload and update
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTempAvatar(URL.createObjectURL(file)); // Set temporary avatar for preview
    setIsLoading(true);

    try {
      const base64 = await convertToBase64(file); // Convert image to base64

      // Update avatar in the Users table
      const { error: updateError } = await supabase
        .from('Users')
        .update({ avatar_url: base64 })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatar(base64); // Set the new avatar
      setIsAvatarModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Close the avatar modal if clicking outside the modal
  const handleClickOutside = (event) => {
    if (isAvatarModalOpen && avatarModalRef.current && !avatarModalRef.current.contains(event.target)) {
      setIsAvatarModalOpen(false); // Close modal
      setTempAvatar(null); // Clear temporary avatar
    }
  };

  // Event listener for detecting clicks outside the modal
  useEffect(() => {
    if (isAvatarModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarModalOpen]);

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle updates to different user fields (username, role, email, phone)
  const handleFieldUpdate = (field, value) => {
    switch (field) {
      case 'username': setName(value); break;
      case 'role': setRole(value); break;
      case 'email': setEmail(value); break;
      case 'phone_number': setPhone(value); break;
      default: break;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PROFILE</h1>
      {isLoading ? (
        <p>Loading profile data...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.contentContainer}>
          <div style={styles.leftContainer}>
            <div style={styles.avatarContainer}>
              <img 
                src={tempAvatar || avatar} 
                alt="Avatar" 
                style={styles.avatar} 
                onClick={() => setIsAvatarModalOpen(true)} 
              />
              <button onClick={() => setIsAvatarModalOpen(true)} style={styles.changeAvatarButton}>
                Change Avatar
              </button>
            </div>
          </div>
          <div style={styles.rightContainer}>
            {/* Editable fields for name, role, email, and phone */}
            <EditableField label="NAME" value={name} field="username" userId={userId} onUpdate={handleFieldUpdate} />
            <EditableField label="ROLE" value={role} field="role" userId={userId} onUpdate={handleFieldUpdate} />
            <EditableField label="EMAIL" value={email} field="email" userId={userId} onUpdate={handleFieldUpdate} />
            <EditableField label="PHONE" value={phone} field="phone_number" userId={userId} onUpdate={handleFieldUpdate} />
          </div>
        </div>
      )}
      {isAvatarModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent} ref={avatarModalRef}>
            <h2 style={styles.modalTitle}>Upload New Avatar</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={styles.fileInput}
            />
            <button onClick={() => setIsAvatarModalOpen(false)} style={styles.closeButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  // Main container for the page layout
  container: {
    position: 'relative',
    minHeight: '100vh', // Ensures full viewport height
    width: '100%',
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)', // Gradient background for a stylish look
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Aligns items to the left
    paddingTop: '100px', // Padding at the top to offset content
    paddingLeft: '300px',
    boxSizing: 'border-box', // Ensures padding is included in element's total width and height
  },
  // Title text styling
  title: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for good contrast
    textAlign: 'left',
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '100px',
  },
  // Container for content sections (left and right)
  contentContainer: {
    display: 'flex',
    width: '80%',
    maxWidth: '1000px',
    justifyContent: 'flex-start', // Aligns content to the start (left)
    alignItems: 'flex-start',
    marginTop: '20px',
  },
  // Left side container (e.g., avatar)
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centers elements within this container
    width: '40%',
    marginLeft: '50px',
  },
  // Right side container for editable fields
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Aligns fields to the left
    width: '60%',
    marginLeft: '100px',
    marginTop: '-100px', // Adjusts vertical position
  },
  // Avatar container and styling
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centers avatar content
  },
  avatar: {
    width: '400px',
    height: '400px',
    borderRadius: '50%', // Makes the avatar circular
    marginBottom: '50px',
    cursor: 'pointer', // Indicates that the avatar is clickable
  },
  // Styling for the button to change avatar
  changeAvatarButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50', // Green button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer', // Indicates a clickable button
  },
  // Grouping of editable information fields
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    alignItems: 'flex-start',
    marginLeft: '200px', // Adjusts left positioning
  },
  // Layout for label and icon row
  labelRow: {
    display: 'flex',
    alignItems: 'center', // Vertically aligns icon and label
  },
  icon: {
    fontSize: '48px',
    color: '#FFFFFF', // White color for icons
    marginRight: '10px',
    marginBottom: '10px',
  },
  infoLabel: {
    fontSize: '40px',
    color: '#A8A8A8', // Light gray color for labels
    textTransform: 'uppercase', // Ensures labels are uppercase
  },
  // Styling for information text
  infoText: {
    fontSize: '40px',
    color: '#FFFFFF', // White text for information fields
    marginLeft: '55px',
    marginTop: '5px',
    fontWeight: 'bold', // Emphasizes the text
    cursor: 'pointer', // Indicates the field is clickable/editable
  },
  // Container for editing fields
  editContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginLeft: '55px',
  },
  // Input field styling for editing information
  input: {
    fontSize: '40px',
    width: '250px',
    padding: '4px 8px',
    borderRadius: '20px', // Rounded corners for inputs
    backgroundColor: 'transparent', 
    border: '2px solid #FFFFFF', // White border
    color: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  },
  // Container for save and cancel buttons
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '10px',
  },
  // Save button styling
  saveButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50', // Green save button
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer', // Indicates the button is clickable
    marginRight: '5px',
  },
  // Cancel button styling
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336', // Red cancel button
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  // Modal styling for avatar upload
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the modal
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Centers the modal content
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px', // Slight rounding of modal corners
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: '20px',
  },
  fileInput: {
    marginBottom: '20px',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336', // Red close button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


export default ProfilePage;
