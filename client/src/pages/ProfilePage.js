import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [avatar, setAvatar] = useState('/person.png');
  const [name, setName] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [email, setEmail] = useState('Unknown');
  const [phone, setPhone] = useState('Unknown');
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      console.log("Authenticated user:", user);
      if (user) {
        setUserId(user.id);
        setEmail(user.email || 'Unknown');

        const { data, error } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        console.log("Fetched user data:", data);
        if (data) {
          setName(data.username || 'Unknown');
          setRole(data.role || 'Unknown');
          setPhone(data.phone_number || 'Unknown');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (field) => {
    setEditingField(field);
    setInputValue('');
  };

  const saveEdit = async () => {
    try {
      const updates = {};
      if (editingField === 'name') updates.username = inputValue || name;
      if (editingField === 'role') updates.role = inputValue || role;
      if (editingField === 'phone') updates.phone_number = inputValue || phone;

      const { error } = await supabase
        .from('Users')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      fetchUserProfile();
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setInputValue('');
  };

  const renderEditableField = (label, value, field) => (
    <div style={styles.infoGroup}>
      <div style={styles.labelRow}>
        <span style={styles.icon}>{getIconForField(field)}</span>
        <span style={styles.infoLabel}>{label}</span>
      </div>
      {editingField === field ? (
        <div className="edit-container" style={styles.editContainer}>
          <input
            type="text"
            value={inputValue}
            placeholder={value}
            onChange={(e) => setInputValue(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
            <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
          </div>
        </div>
      ) : (
        <span style={styles.infoText} onClick={() => startEditing(field)}>{value}</span>
      )}
    </div>
  );

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
            <img src={avatar} alt="Avatar" style={styles.avatar} />
          </div>
          <div style={styles.rightContainer}>
            {renderEditableField('NAME', name, 'name')}
            {renderEditableField('ROLE', role, 'role')}
            {renderEditableField('EMAIL', email, 'email')}
            {renderEditableField('PHONE', phone, 'phone')}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

const getIconForField = (field) => {
  switch (field) {
    case 'name': return '👤';
    case 'role': return '👥';
    case 'email': return '✉️';
    case 'phone': return '📞';
    default: return '❓';
  }
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
  avatar: {
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    marginBottom: '50px',
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
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  cancelButton: {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#142924',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
    cursor: 'move', 
  },
  fileInput: {
    marginBottom: '10px',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#5A5E63',
    color: '#FFFFFF',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProfilePage;
