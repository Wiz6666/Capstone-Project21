import React, { useState, useEffect } from 'react';
import TaskManagementApp from './components/TaskManagementApp';
import Login from './components/Login';
import Register from './components/Register';

function App({ supabaseClient }) {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const handleLogin = (session) => {
    setSession(session);
  };

  const handleLogout = () => {
    supabaseClient.auth.signOut().then(() => {
      setSession(null);
    });
  };

  const switchToRegister = () => {
    setView('register');
  };

  const switchToLogin = () => {
    setView('login');
  };

  if (session) {
    return <TaskManagementApp user={session.user} supabaseClient={supabaseClient} onLogout={handleLogout} />;
  }

  if (view === 'register') {
    return <Register supabaseClient={supabaseClient} onSwitchToLogin={switchToLogin} />;
  }

  return <Login supabaseClient={supabaseClient} onLogin={handleLogin} onSwitchToRegister={switchToRegister} />;
}

export default App;