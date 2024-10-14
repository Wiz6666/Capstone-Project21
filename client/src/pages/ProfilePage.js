import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters

// EditableField component allows inline editing of profile fields
const EditableField = ({ label, value, field, userId, onUpdate, editable }) => {
  const [isEditing, setIsEditing] = useState(false); // State to track if the field is being edited
  const [editValue, setEditValue] = useState(value); // Store the edited value
  const inputRef = useRef(null); // Reference to the input field

  // If field is editable, enable editing mode
  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(value); // Set the current field value
    }
  };

  // Save the updated field value and exit edit mode
  const handleSave = async () => {
    try {
      await onUpdate(field, editValue); // Call onUpdate function to save changes
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating field:', error); // Log error if the update fails
    }
  };

  // Exit edit mode when clicking outside the input field
  const handleClickOutside = (event) => {
    if (isEditing && inputRef.current && !inputRef.current.contains(event.target)) {
      setIsEditing(false);
      setEditValue(value); // Reset value if editing is cancelled
    }
  };

  // Add/remove event listener to handle clicks outside the input field
  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, [isEditing]);

  // Get corresponding icon for the profile field
  const getIconForField = (field) => {
    switch (field) {
      case 'username': return '👤'; // Icon for username
      case 'role': return '👥'; // Icon for role
      case 'email': return '✉️'; // Icon for email
      case 'phone_number': return '📞'; // Icon for phone number
      case 'location': return '📍'; // Icon for location
      default: return '❓'; // Default icon for unknown fields
    }
  };

  return (
    <div style={styles.infoGroup}>
      <div style={styles.labelRow}>
        <span style={styles.icon}>{getIconForField(field)}</span>
        <span style={styles.infoLabel}>{label}</span>
      </div>
      {editable ? (
        isEditing ? (
          <div style={styles.editContainer} ref={inputRef}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)} // Update value on change
              style={styles.input}
            />
            <div style={styles.buttonContainer}>
              <button onClick={handleSave} style={styles.saveButton}>Save</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        ) : (
          <span style={styles.infoText} onClick={handleEdit}>{value}</span> // Display value when not editing
        )
      ) : (
        <span style={styles.infoText}>{value}</span> // Display value when field is not editable
      )}
    </div>
  );
};

// ProfilePage component displays and allows editing of the user's profile
const ProfilePage = () => {
  const { userId: routeUserId } = useParams(); // Get userId from the URL
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false); // Check if it's the current user's profile

  // Profile fields
  const [avatar, setAvatar] = useState('/person.png');
  const [name, setName] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [email, setEmail] = useState('Unknown');
  const [phone, setPhone] = useState('Unknown');
  const [location, setLocation] = useState('Unknown');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null); // Store any errors

  const [message, setMessage] = useState(''); // Store success/error messages
  const [isLoading, setIsLoading] = useState(true); // Manage loading indicator
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Manage avatar modal visibility
  const [tempAvatar, setTempAvatar] = useState(null); // Store and preview new avatar
  const avatarModalRef = useRef(null); // Reference to the avatar modal

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile when component mounts or userId changes
  }, [routeUserId]);

  // Fetch the user's profile from Supabase
  const fetchUserProfile = async () => {
    setIsLoading(true); // Start loading indicator
    try {
      // Get the currently logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError; // Handle authentication error

      if (user) {
        let profileUserId = routeUserId || user.id; // Use the routeUserId or current user's ID
        setUserId(profileUserId);
        setIsCurrentUserProfile(profileUserId === user.id); // Check if it's the current user's profile

        // Fetch the user's profile data from the 'Users' table
        const { data, error } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', profileUserId)
          .single(); // Fetch single user profile

        if (error) throw error; // Handle any errors

        // Set profile data to state
        if (data) {
          setName(data.username || 'Unknown');
          setRole(data.role || 'Unknown');
          setPhone(data.phone_number || 'Unknown');
          setLocation(data.location || 'Unknown');
          setAvatar(data.avatar_url || '/person.png');
          setEmail(data.email || 'Unknown'); // Always show email
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message); // Set error message
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Handle avatar upload and save to Supabase
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    setTempAvatar(URL.createObjectURL(file)); // Set temporary avatar for preview
    setIsLoading(true); // Start loading indicator

    try {
      const base64 = await convertToBase64(file); // Convert file to Base64 format

      // Update the avatar URL in Supabase
      const { error: updateError } = await supabase
        .from('Users')
        .update({ avatar_url: base64 })
        .eq('user_id', userId);

      if (updateError) throw updateError; // Handle any errors during update

      setAvatar(base64); // Update avatar in state
      setIsAvatarModalOpen(false); // Close avatar modal
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.message); // Set error message
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Helper function to convert file to Base64 format
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as data URL
      reader.onload = () => resolve(reader.result); // Resolve with Base64 string
      reader.onerror = (error) => reject(error); // Reject if there's an error
    });
  };

  // Update profile fields
  const handleFieldUpdate = async (field, value) => {
    try {
      const updates = { [field]: value }; // Create an object to update specific field

      const { error } = await supabase
        .from('Users')
        .update(updates) // Update the field in Supabase
        .eq('user_id', userId); // Match userId

      if (error) throw error; // Handle update errors

      // Update the corresponding field in state
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
      setError(error.message); // Set error message
    }
  };

  // Handle avatar click to open the avatar modal
  const handleClickAvatar = () => {
    if (isCurrentUserProfile) {
      setIsAvatarModalOpen(true); // Open avatar modal if it's the current user's profile
    }
  };

  // Close avatar modal when clicking outside
  const handleClickOutside = (event) => {
    if (isAvatarModalOpen && avatarModalRef.current && !avatarModalRef.current.contains(event.target)) {
      setIsAvatarModalOpen(false); // Close modal
      setTempAvatar(null); // Reset temporary avatar
    }
  };

  // Add event listener to close avatar modal when clicking outside
  useEffect(() => {
    if (isAvatarModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, [isAvatarModalOpen]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PROFILE</h1> {/* Page title */}
      {isLoading ? (
        <p>Loading profile data...</p> // Display loading message
      ) : error ? (
        <p style={styles.error}>{error}</p> // Display error message (if any)
      ) : (
        <div style={styles.contentContainer}>
          <div style={styles.leftContainer}>
            <div style={styles.avatarContainer}>
              <img
                src={tempAvatar || avatar} // Display temporary or actual avatar
                alt="Avatar"
                style={styles.avatar}
                onClick={handleClickAvatar} // Handle avatar click
              />
              <EditableField
                label="LOCATION"
                value={location}
                field="location"
                userId={userId}
                onUpdate={handleFieldUpdate} // Handle location update
                editable={isCurrentUserProfile} // Only current user can edit
              />
            </div>
          </div>
          <div style={styles.rightContainer}>
            <EditableField
              label="NAME"
              value={name}
              field="username"
              userId={userId}
              onUpdate={handleFieldUpdate} // Handle name update
              editable={isCurrentUserProfile} // Only current user can edit
            />
            <EditableField
              label="ROLE"
              value={role}
              field="role"
              userId={userId}
              onUpdate={handleFieldUpdate} // Handle role update
              editable={isCurrentUserProfile} // Only current user can edit
            />
            <EditableField
              label="EMAIL"
              value={email}
              field="email"
              userId={userId}
              onUpdate={handleFieldUpdate} // Handle email update
              editable={isCurrentUserProfile} // Only current user can edit
            />
            <EditableField
              label="PHONE"
              value={phone}
              field="phone_number"
              userId={userId}
              onUpdate={handleFieldUpdate} // Handle phone number update
              editable={isCurrentUserProfile} // Only current user can edit
            />
          </div>
        </div>
      )}

      {message && <p style={styles.message}>{message}</p>} {/* Display success/error message */}

      {isAvatarModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent} ref={avatarModalRef}>
            <h2 style={styles.modalTitle}>Upload New Avatar</h2> {/* Modal title */}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload} // Handle avatar file selection
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
  // Main container for the page
  container: {
    position: 'relative', // Positioned relative to its normal position
    minHeight: '100vh', // Ensures the container takes the full height of the viewport
    width: '100%', // Occupies the full width of the viewport
    background: 'linear-gradient(to bottom, #a0c7c9, #f6d68b)', // Gradient background
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Aligns children in a column
    alignItems: 'flex-start', // Aligns children to the start on the cross-axis
    paddingTop: '100px', // Adds padding at the top
    paddingLeft: '300px', // Adds padding on the left
    boxSizing: 'border-box', // Ensures padding and border are included in the element's total width and height
  },
  // Title of the page
  title: {
    fontSize: '80px', // Large font size for the title
    fontWeight: 'bold', // Bold font weight
    color: '#048492', // Text color
    textAlign: 'left', // Aligns the text to the left
    marginBottom: '20px', // Space below the title
    marginTop: '20px', // Space above the title
    marginLeft: '100px', // Moves the title 100px to the right
  },
  // Container for content
  contentContainer: {
    display: 'flex', // Flexbox layout for the content
    width: '80%', // Takes up 80% of the width
    maxWidth: '1000px', // Maximum width of 1000px
    justifyContent: 'flex-start', // Aligns child elements to the start
    alignItems: 'flex-start', // Aligns child elements to the start on the cross-axis
    marginTop: '20px', // Space above the container
  },
  // Left container for the avatar section
  leftContainer: {
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Aligns children in a vertical column
    alignItems: 'center', // Centers child elements horizontally
    width: '40%', // Takes up 40% of the width
    marginLeft: '50px', // Space to the left of the container
  },
  // Right container for the editable fields
  rightContainer: {
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Aligns children in a vertical column
    alignItems: 'flex-start', // Aligns children to the start
    width: '60%', // Takes up 60% of the width
    marginLeft: '300px', // Adds margin to shift the container left
    marginTop: '-100px', // Moves the container upward
  },
  // Container for the avatar
  avatarContainer: {
    display: 'flex', // Flexbox layout for the avatar container
    flexDirection: 'column', // Aligns children in a vertical column
    alignItems: 'center', // Centers children horizontally
  },
  // Avatar image
  avatar: {
    width: '400px', // Avatar width
    height: '400px', // Avatar height
    borderRadius: '50%', // Makes the avatar circular
    marginBottom: '10px', // Space below the avatar
    cursor: 'pointer', // Changes the cursor to a pointer when hovering
  },
  // Group for displaying each editable field
  infoGroup: {
    display: 'flex', // Flexbox layout
    flexDirection: 'column', // Aligns children in a vertical column
    marginBottom: '15px', // Space below each info group
    alignItems: 'flex-start', // Aligns children to the start
    marginLeft: '-10px', // Shifts the group slightly to the left
  },
  // Row for label and icon
  labelRow: {
    display: 'flex', // Flexbox layout for the label row
    alignItems: 'center', // Aligns children vertically in the center
  },
  // Icon for each field
  icon: {
    fontSize: '48px', // Large icon size
    color: '#048492', // Icon color
    marginRight: '10px', // Space to the right of the icon
    marginBottom: '10px', // Space below the icon
  },
  // Label for each field
  infoLabel: {
    fontSize: '40px', // Large font size for the label
    color: '#048492', // Text color
    textTransform: 'uppercase', // Uppercase text
    textDecoration: 'underline', // Adds underline to the label
  },
  // Displayed text for each field
  infoText: {
    fontSize: '40px', // Large font size for the info text
    color: '#048492', // Text color
    marginLeft: '55px', // Adds left margin for spacing
    marginTop: '5px', // Space above the text
    fontWeight: 'bold', // Bold font weight
    cursor: 'pointer', // Changes the cursor to pointer on hover
  },
  // Container for editable input fields
  editContainer: {
    display: 'flex', // Flexbox layout for the edit container
    flexDirection: 'row', // Aligns children in a horizontal row
    alignItems: 'center', // Aligns children vertically in the center
    position: 'relative', // Positions relative to its normal position
    marginLeft: '55px', // Adds left margin
  },
  // Input fields for editing
  input: {
    fontSize: '40px', // Large font size for input text
    width: '250px', // Width of the input
    padding: '4px 8px', // Padding inside the input
    borderRadius: '20px', // Rounded corners
    backgroundColor: 'transparent', // Transparent background
    border: '2px solid #048492', // Border color
    color: '#048492', // Input text color
    outline: 'none', // Removes the default outline
    boxSizing: 'border-box', // Ensures padding and border are included in total width
  },
  // Container for buttons (save/cancel)
  buttonContainer: {
    display: 'flex', // Flexbox layout for buttons
    flexDirection: 'row', // Aligns buttons in a row
    alignItems: 'center', // Aligns buttons vertically
    marginLeft: '10px', // Adds left margin
  },
  // Save button style
  saveButton: {
    padding: '5px 10px', // Padding inside the save button
    backgroundColor: '#048492', // Save button background color
    color: '#FFFFFF', // Text color for the button
    border: 'none', // No border
    borderRadius: '3px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
    marginRight: '5px', // Adds space to the right of the button
  },
  // Cancel button style
  cancelButton: {
    padding: '5px 10px', // Padding inside the cancel button
    backgroundColor: '#F7AB3B', // Cancel button background color
    color: '#FFFFFF', // Text color for the button
    border: 'none', // No border
    borderRadius: '3px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
  },
  // Modal (for changing avatar)
  modal: {
    position: 'fixed', // Fixed position within the viewport
    top: 0, // Position at the top of the viewport
    left: 0, // Position at the left of the viewport
    width: '100%', // Full width of the viewport
    height: '100%', // Full height of the viewport
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    display: 'flex', // Flexbox layout
    justifyContent: 'center', // Center the modal horizontally
    alignItems: 'center', // Center the modal vertically
  },
  // Modal content (changing avatar)
  modalContent: {
    backgroundColor: '#fff', // White background for modal content
    padding: '20px', // Padding inside the modal
    borderRadius: '5px', // Rounded corners
    textAlign: 'center', // Centered text
  },
  // Modal title style
  modalTitle: {
    marginBottom: '20px', // Space below the title
    color: '#048492', // Title color
  },
  // File input for uploading avatar
  fileInput: {
    marginBottom: '20px', // Space below the file input field
  },
  // Close button style in modal
  closeButton: {
    padding: '10px 20px', // Padding inside the close button
    backgroundColor: '#F7AB3B',  // Close button background color
    color: '#FFFFFF', // White text color
    border: 'none', // No border
    borderRadius: '5px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
  },
  // Message style (for success/error messages)
  message: {
    color: '#048492', // Text color for the message
    fontSize: '16px', // Font size for messages
    marginTop: '20px', // Space above the message
    textAlign: 'center', // Centered text
  },
  // Responsive styles for small screens (e.g., mobile)
  '@media (max-width: 768px)': {
    container: {
      paddingLeft: '20px', // Reduce left padding on small screens
      paddingTop: '20px', // Reduce top padding on small screens
    },
    title: {
      fontSize: '36px', // Smaller font size for mobile
      marginLeft: '0', // No left margin on small screens
      textAlign: 'center', // Center title on mobile
      color: '#048492', // Title color
    },
    contentContainer: {
      flexDirection: 'column', // Stack elements vertically on small screens
      alignItems: 'center', // Center elements on small screens
      width: '100%', // Full width on mobile
    },
    leftContainer: {
      width: '100%', // Full width for left container on small screens
      marginLeft: '0', // No left margin
    },
    rightContainer: {
      width: '100%', // Full width for right container on small screens
      marginLeft: '0', // No left margin
      marginTop: '20px', // Adds margin at the top
    },
    avatar: {
      width: '150px', // Smaller avatar size for mobile
      height: '150px', // Smaller height for the avatar
    },
    infoLabel: {
      fontSize: '18px', // Smaller font size for labels on mobile
      color: '#048492', // Label text color
      textDecoration: 'underline', // Underline text
    },
    infoText: {
      fontSize: '18px', // Smaller font size for info text on mobile
      color: '#048492', // Info text color
    },
    input: {
      fontSize: '18px', // Smaller font size for input fields on mobile
      width: '100%', // Full width for inputs on mobile
      color: '#048492', // Input text color
    },
    saveButton: {
      fontSize: '14px', // Smaller font size for buttons on mobile
      padding: '10px 15px', // Adds larger padding for better touch targets
    },
    cancelButton: {
      fontSize: '14px', // Smaller font size for cancel button on mobile
    },
    modalContent: {
      width: '90%', // Modal takes most of the screen width on mobile
    },
  },
  // Responsive styles for tablets
  '@media (min-width: 769px) and (max-width: 1200px)': {
    avatar: {
      width: '250px', // Avatar size for tablets
      height: '250px', // Avatar height for tablets
    },
    infoLabel: {
      fontSize: '24px', // Font size for labels on tablets
      color: '#048492', // Label color
      textDecoration: 'underline', // Underline text
    },
    infoText: {
      fontSize: '24px', // Font size for info text on tablets
      color: '#048492', // Info text color
    },
    input: {
      fontSize: '24px', // Font size for input fields on tablets
      width: '80%', // Takes up 80% of the width
      color: '#048492', // Input text color
    },
    saveButton: {
      fontSize: '16px', // Font size for save button on tablets
    },
    cancelButton: {
      fontSize: '16px', // Font size for cancel button on tablets
    },
  },
};

export default ProfilePage;
