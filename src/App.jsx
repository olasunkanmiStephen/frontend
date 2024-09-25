import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <UserProvider>
      <Router>
        <Toaster/>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
