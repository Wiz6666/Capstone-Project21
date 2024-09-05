import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer'; // 导入 Footer 组件

const ProfilePage = () => {
  const [avatar, setAvatar] = useState('/person.png');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [email, setEmail] = useState('Unknown');
  const [phone, setPhone] = useState('Unknown');
  const [mobilePhone, setMobilePhone] = useState('Unknown');
  const [location, setLocation] = useState('Unknown');
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
    setShowModal(false);
  };

  const startEditing = (field) => {
    setEditingField(field);
    setInputValue(''); // 清空输入框中的值
  };

  const saveEdit = () => {
    if (editingField === 'name') setName(inputValue || 'Unknown');
    if (editingField === 'role') setRole(inputValue || 'Unknown');
    if (editingField === 'email') setEmail(inputValue || 'Unknown');
    if (editingField === 'phone') setPhone(inputValue || 'Unknown');
    if (editingField === 'mobilePhone') setMobilePhone(inputValue || 'Unknown');
    if (editingField === 'location') setLocation(inputValue || 'Unknown');
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setInputValue(''); // 取消编辑时清空输入框中的值
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingField && !event.target.closest('.edit-container')) {
        cancelEdit();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField]);

  useEffect(() => {
    if (showModal) {
      const modal = document.getElementById('modal');
      let isDragging = false;
      let offsetX, offsetY;

      const onMouseMove = (e) => {
        if (isDragging) {
          modal.style.left = `${e.clientX - offsetX}px`;
          modal.style.top = `${e.clientY - offsetY}px`;
        }
      };

      const onMouseDown = (e) => {
        isDragging = true;
        offsetX = e.clientX - modal.getBoundingClientRect().left;
        offsetY = e.clientY - modal.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
      };

      modal.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        modal.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [showModal]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PROFILE</h1>
      <div style={styles.contentContainer}>
        <div style={styles.leftContainer}>
          <img
            src={avatar}
            alt="Avatar"
            style={styles.avatar}
            onClick={() => setShowModal(true)}
          />
          <div className="locationSection" style={styles.locationSection}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>📍</span>
              <span style={styles.infoLabel}>LOCATION</span>
            </div>
            {editingField === 'location' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={location} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('location')}>{location}</span>
            )}
          </div>
        </div>
        <div style={styles.rightContainer}>
          <div style={styles.infoGroup}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>👤</span>
              <span style={styles.infoLabel}>NAME</span>
            </div>
            {editingField === 'name' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={name} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('name')}>{name}</span>
            )}
          </div>
          <div style={styles.infoGroup}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>👥</span>
              <span style={styles.infoLabel}>ROLE</span>
            </div>
            {editingField === 'role' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={role} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('role')}>{role}</span>
            )}
          </div>
          <div style={styles.infoGroup}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>✉️</span>
              <span style={styles.infoLabel}>EMAIL</span>
            </div>
            {editingField === 'email' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={email} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('email')}>{email}</span>
            )}
          </div>
          <div style={styles.infoGroup}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>📞</span>
              <span style={styles.infoLabel}>PHONE</span>
            </div>
            {editingField === 'phone' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={phone} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('phone')}>{phone}</span>
            )}
          </div>
          <div style={styles.infoGroup}>
            <div style={styles.labelRow}>
              <span style={styles.icon}>📱</span>
              <span style={styles.infoLabel}>MOBILE PHONE</span>
            </div>
            {editingField === 'mobilePhone' ? (
              <div className="edit-container" style={styles.editContainer}>
                <input
                  type="text"
                  value={inputValue}
                  placeholder={mobilePhone} // 设置 placeholder 为原来的值
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.buttonContainer}>
                  <img src="/save.png" alt="Save" style={styles.saveButton} onClick={saveEdit} />
                  <img src="/cancel.png" alt="Cancel" style={styles.cancelButton} onClick={cancelEdit} />
                </div>
              </div>
            ) : (
              <span style={styles.infoText} onClick={() => startEditing('mobilePhone')}>{mobilePhone}</span>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div id="modal" style={styles.modal}>
          <input type="file" onChange={handleAvatarChange} style={styles.fileInput} />
          <button onClick={() => setShowModal(false)} style={styles.closeButton}>Cancel</button>
        </div>
      )}
      <Footer /> {/* 在页面中使用 Footer 组件 */}
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
