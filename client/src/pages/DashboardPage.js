import React from 'react';

const DashboardPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Your Dashboard</h1>
      <div style={styles.content}>
        {/* Add your actual dashboard content here */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    color: '#2E4A29',
    marginBottom: '20px',
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '5px',
  },
};

export default DashboardPage;