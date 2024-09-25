import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthPage = () => {
  const { signup, login } = useUserContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const isSuccess = await login({ email: formData.email, password: formData.password });
        if (isSuccess) {
          toast.success('Login successful!');
          navigate('/home'); // Redirect to subscriptions page after login
        } else {
          toast.error('Invalid email or password. Please try again.'); // Show error for failed login
        }
      } else {
        await signup({ username: formData.username, email: formData.email, password: formData.password });
        toast.success('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.'); // Show generic error message
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <h2>Create an account</h2>
            <input name="username" placeholder="Username" onChange={handleChange} required />
          </>
        )}
        {isLogin && <h2>Login</h2>}
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
