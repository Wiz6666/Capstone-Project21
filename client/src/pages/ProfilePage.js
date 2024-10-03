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
      await onUpdate(field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  // Handle click outside to close the edit mode
  const handleClickOutside = (event) => {
    if (isEditing && inputRef.current && !inputRef.current.contains(event.target)) {
      setIsEditing(false);
      setEditValue(value); // Reset to original value if clicked outside
    }
  };

  // Attach and detach the event listener for detecting outside clicks
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

  // Determine the appropriate icon for each field
  const getIconForField = (field) => {
    switch (field) {
      case 'username': return '👤';
      case 'role': return '👥';
      case 'email': return '✉️';
      case 'phone_number': return '📞';
      case 'location': return '📍';
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
              <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={styles.input}
              />
              <div style={styles.buttonContainer}>
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

const ProfilePage = () => {
  const [avatar, setAvatar] = useState('/person.png'); // Default avatar
  const [name, setName] = useState('Unknown'); // Default name
  const [role, setRole] = useState('Unknown'); // Default role
  const [email, setEmail] = useState('Unknown'); // Default email
  const [phone, setPhone] = useState('Unknown'); // Default phone number
  const [location, setLocation] = useState('Unknown'); // Default location
  const [userId, setUserId] = useState(null); // To store the user ID
  const [error, setError] = useState(null); // Error handling for API calls

  const [message, setMessage] = useState(''); // Display messages
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Control avatar modal state
  const [tempAvatar, setTempAvatar] = useState(null); // Temporary avatar before saving
  const avatarModalRef = useRef(null); // Reference to avatar modal

  // Fetch user profile when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        setUserId(user.id);
        setEmail(user.email || 'Unknown');

        // Fetch user details from the Users table
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        if (data) {
          // Set profile fields with fetched data
          setName(data.username || 'Unknown');
          setRole(data.role || 'Unknown');
          setPhone(data.phone_number || 'Unknown');
          setLocation(data.location || 'Unknown');
          setAvatar(data.avatar_url || '/person.png');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  // Handle avatar upload and save the base64 string to Supabase
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTempAvatar(URL.createObjectURL(file)); // Show temporary avatar
    setIsLoading(true);

    try {
      const base64 = await convertToBase64(file); // Convert the file to base64

      // Update the avatar URL in Supabase
      const { error: updateError } = await supabase
          .from('Users')
          .update({ avatar_url: base64 })
          .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatar(base64); // Update the displayed avatar
      setIsAvatarModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Stop loading once avatar is saved
    }
  };

  // Convert uploaded file to base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Resolve with base64 data
      reader.onerror = (error) => reject(error); // Reject on error
    });
  };

  // Handle updating individual profile fields
  const handleFieldUpdate = async (field, value) => {
    try {
      const updates = { [field]: value };

      // Update the specific field in the Users table in Supabase
      const { error } = await supabase
          .from('Users')
          .update(updates)
          .eq('user_id', userId);

      if (error) throw error;

      // Update local state based on the field
      switch (field) {
        case 'username': setName(value); break;
        case 'role': setRole(value); break;
        case 'email': setEmail(value); break;
        case 'phone_number': setPhone(value); break;
        case 'location': setLocation(value); break;
        default: break;
      }
    } catch (error) {
      console.error('Error updating field:', error);
      setError(error.message);
    }
  };

  // Handle avatar click to open the modal for upload
  const handleClickAvatar = () => {
    setIsAvatarModalOpen(true);
  };

  // Handle click outside the avatar modal to close it
  const handleClickOutside = (event) => {
    if (isAvatarModalOpen && avatarModalRef.current && !avatarModalRef.current.contains(event.target)) {
      setIsAvatarModalOpen(false);
      setTempAvatar(null);
    }
  };

  // Add and remove event listener for detecting clicks outside the modal
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
                      onClick={handleClickAvatar} // Clicking avatar triggers upload
                  />
                  <EditableField
                      label="LOCATION"
                      value={location}
                      field="location"
                      userId={userId}
                      onUpdate={handleFieldUpdate}
                  />
                </div>
              </div>
              <div style={styles.rightContainer}>
                <EditableField label="NAME" value={name} field="username" userId={userId} onUpdate={handleFieldUpdate} />
                <EditableField label="ROLE" value={role} field="role" userId={userId} onUpdate={handleFieldUpdate} />
                <EditableField label="EMAIL" value={email} field="email" userId={userId} onUpdate={handleFieldUpdate} />
                <EditableField label="PHONE" value={phone} field="phone_number" userId={userId} onUpdate={handleFieldUpdate} />
              </div>
            </div>
        )}

        {message && <p style={styles.message}>{message}</p>}

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
  container: {
    position: 'relative',
    minHeight: '100vh', // Ensures the container takes the full height of the viewport
    width: '100%', // Occupies full width of the viewport
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)', // Applies a linear gradient background
    display: 'flex', // Uses Flexbox for layout
    flexDirection: 'column', // Positions child elements in a column layout
    alignItems: 'flex-start', // Aligns children to the start on the cross-axis
    paddingTop: '100px', // Adds top padding
    paddingLeft: '300px', // Adds left padding
    boxSizing: 'border-box', // Ensures padding and border are included in the element's total width and height
  },
  title: {
    fontSize: '80px', // Large font size for the title
    fontWeight: 'bold', // Bold font weight for emphasis
    color: '#FFFFFF', // White text color
    textAlign: 'left', // Aligns text to the left
    marginBottom: '20px', // Adds space below the title
    marginTop: '20px', // Adds space above the title
    marginLeft: '100px', // Shifts the title to the right by 100px
  },
  contentContainer: {
    display: 'flex', // Flexbox layout for the content
    width: '80%', // Takes up 80% of the width
    maxWidth: '1000px', // Sets a maximum width of 1000px
    justifyContent: 'flex-start', // Aligns child elements to the start of the main axis
    alignItems: 'flex-start', // Aligns child elements to the start on the cross-axis
    marginTop: '20px', // Adds space above the container
  },
  leftContainer: {
    display: 'flex', // Flexbox layout for the left container
    flexDirection: 'column', // Positions children in a vertical column
    alignItems: 'center', // Centers child elements horizontally
    width: '40%', // Takes up 40% of the width
    marginLeft: '50px', // Adds space to the left of the container
  },
  rightContainer: {
    display: 'flex', // Flexbox layout for the right container
    flexDirection: 'column', // Positions children in a vertical column
    alignItems: 'flex-start', // Aligns child elements to the start
    width: '60%', // Takes up 60% of the width
    marginLeft: '300px', // Adds left margin to shift the container
    marginTop: '-100px', // Adds negative top margin to adjust position upwards
  },
  avatarContainer: {
    display: 'flex', // Flexbox layout for the avatar container
    flexDirection: 'column', // Positions children in a vertical column
    alignItems: 'center', // Centers child elements horizontally
  },
  avatar: {
    width: '400px', // Width of the avatar
    height: '400px', // Height of the avatar
    borderRadius: '50%', // Makes the avatar circular
    marginBottom: '10px', // Adds space below the avatar
    cursor: 'pointer', // Changes the cursor to pointer when hovering over the avatar
  },
  infoGroup: {
    display: 'flex', // Flexbox layout for the info group
    flexDirection: 'column', // Positions children in a vertical column
    marginBottom: '15px', // Adds space below each info group
    alignItems: 'flex-start', // Aligns child elements to the start
    marginLeft: '-10px', // Slightly shifts the group to the left
  },
  labelRow: {
    display: 'flex', // Flexbox layout for the label row
    alignItems: 'center', // Aligns child elements in the center vertically
  },
  icon: {
    fontSize: '48px', // Large icon size
    color: '#FFFFFF', // White icon color
    marginRight: '10px', // Adds space to the right of the icon
    marginBottom: '10px', // Adds space below the icon
  },
  infoLabel: {
    fontSize: '40px', // Large font size for the info label
    color: '#A8A8A8', // Grey color for the info label
    textTransform: 'uppercase', // Makes the text uppercase
  },
  infoText: {
    fontSize: '40px', // Large font size for the info text
    color: '#FFFFFF', // White text color
    marginLeft: '55px', // Adds left margin for spacing
    marginTop: '5px', // Adds space above the info text
    fontWeight: 'bold', // Makes the text bold
    cursor: 'pointer', // Adds pointer cursor on hover
  },
  editContainer: {
    display: 'flex', // Flexbox layout for the edit container
    flexDirection: 'row', // Positions children in a horizontal row
    alignItems: 'center', // Aligns children in the center vertically
    position: 'relative', // Positions the container relative to its normal position
    marginLeft: '55px', // Adds space to the left of the container
  },
  input: {
    fontSize: '40px', // Large font size for the input field
    width: '250px', // Width of the input field
    padding: '4px 8px', // Adds padding inside the input field
    borderRadius: '20px', // Rounds the corners of the input field
    backgroundColor: 'transparent', // Makes the input field background transparent
    border: '2px solid #FFFFFF', // Adds a white border around the input field
    color: '#FFFFFF', // White text color inside the input field
    outline: 'none', // Removes the default input field outline
    boxSizing: 'border-box', // Ensures padding and border are included in the total width and height
  },
  buttonContainer: {
    display: 'flex', // Flexbox layout for the button container
    flexDirection: 'row', // Positions buttons in a horizontal row
    alignItems: 'center', // Aligns buttons in the center vertically
    marginLeft: '10px', // Adds space to the left of the container
  },
  saveButton: {
    padding: '5px 10px', // Padding inside the save button
    backgroundColor: '#4CAF50', // Green background color
    color: 'white', // White text color
    border: 'none', // Removes the button border
    borderRadius: '3px', // Rounds the corners of the save button
    cursor: 'pointer', // Adds pointer cursor on hover
    marginRight: '5px', // Adds space to the right of the button
  },
  cancelButton: {
    padding: '5px 10px', // Padding inside the cancel button
    backgroundColor: '#f44336', // Red background color
    color: 'white', // White text color
    border: 'none', // Removes the button border
    borderRadius: '3px', // Rounds the corners of the cancel button
    cursor: 'pointer', // Adds pointer cursor on hover
  },
  modal: {
    position: 'fixed', // Fixes the modal in the viewport
    top: 0, // Positions the modal at the top of the viewport
    left: 0, // Positions the modal at the left of the viewport
    width: '100%', // Full width of the viewport
    height: '100%', // Full height of the viewport
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent black background
    display: 'flex', // Flexbox layout for the modal
    justifyContent: 'center', // Centers the modal content horizontally
    alignItems: 'center', // Centers the modal content vertically
  },
  modalContent: {
    backgroundColor: '#fff', // White background for the modal content
    padding: '20px', // Adds padding inside the modal
    borderRadius: '5px', // Rounds the corners of the modal
    textAlign: 'center', // Centers the text inside the modal
  },
  modalTitle: {
    marginBottom: '20px', // Adds space below the modal title
  },
  fileInput: {
    marginBottom: '20px', // Adds space below the file input field
  },
  closeButton: {
    padding: '10px 20px', // Padding inside the close button
    backgroundColor: '#f44336', // Red background color
    color: 'white', // White text color
    border: 'none', // Removes the button border
    borderRadius: '5px', // Rounds the corners of the close button
    cursor: 'pointer', // Adds pointer cursor on hover
  },
  message: {
    color: '#4CAF50', // Green text color
    fontSize: '16px', // Font size for messages
    marginTop: '20px', // Adds space above the message
    textAlign: 'center', // Centers the message text
  },
};

export default ProfilePage;

