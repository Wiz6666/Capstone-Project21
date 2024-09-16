import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';

const EditableField = ({ label, value, field, userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('Users')
        .update({ [field]: editValue })
        .eq('user_id', userId);

      if (error) throw error;

      onUpdate(field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

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
        <div style={styles.editContainer}>
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
  const [avatar, setAvatar] = useState('/person.png');
  const [name, setName] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [email, setEmail] = useState('Unknown');
  const [phone, setPhone] = useState('Unknown');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        setUserId(user.id);
        setEmail(user.email || 'Unknown');

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
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const base64 = await convertToBase64(file);
      
      const { error: updateError } = await supabase
        .from('Users')
        .update({ avatar_url: base64 })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatar(base64);
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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
              <img src={avatar} alt="Avatar" style={styles.avatar} />
              <button onClick={() => setIsAvatarModalOpen(true)} style={styles.changeAvatarButton}>
                Change Avatar
              </button>
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
      {isAvatarModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
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
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(90deg, #142924 10%, rgba(101, 125, 131, 0.9) 90%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '100px',
    paddingLeft: '300px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '100px',
  },
  contentContainer: {
    display: 'flex',
    width: '80%',
    maxWidth: '1000px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: '20px',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40%',
    marginLeft: '50px',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '60%',
    marginLeft: '100px',
    marginTop: '-100px',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    marginBottom: '50px',
    cursor: 'pointer',
  },
  changeAvatarButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    alignItems: 'flex-start',
    marginLeft: '200px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '48px',
    color: '#FFFFFF',
    marginRight: '10px',
    marginBottom: '10px',
  },
  infoLabel: {
    fontSize: '40px',
    color: '#A8A8A8',
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: '40px',
    color: '#FFFFFF',
    marginLeft: '55px',
    marginTop: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginLeft: '55px',
  },
  input: {
    fontSize: '40px', 
    width: '250px', 
    padding: '4px 8px',
    borderRadius: '20px',
    backgroundColor: 'transparent', 
    border: '2px solid #FFFFFF',
    color: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '10px',
  },
  saveButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
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
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProfilePage;
