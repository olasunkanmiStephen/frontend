import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionList from './SubscriptionList';
import ExpenseChart from './ExpenseChart';
import { useUserContext } from '../context/UserContext';

const HomePage = () => {
  const { user, logout } = useUserContext();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // To control form visibility

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubscriptions((prev) => prev.filter(sub => sub._id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleEditSubscription = async (updatedSubscription) => {
    try {
      await axios.put(`http://localhost:7000/subscriptions/${updatedSubscription._id}`, updatedSubscription, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubscriptions((prev) =>
        prev.map((sub) => (sub._id === updatedSubscription._id ? updatedSubscription : sub))
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const addSubscription = async (newSubscription) => {
    try {
      const response = await axios.post('http://localhost:7000/subscriptions', newSubscription, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubscriptions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm); // Toggle the visibility
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;
      try {
        const response = await axios.get('http://localhost:7000/subscriptions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [user]);

  if (loading) {
    return <h2>Loading subscriptions...</h2>;
  }

  // Slice the username to 14 characters with ellipsis if longer
  const displayUsername = user.username.length > 14
    ? `${user.username.slice(0, 14)}...`
    : user.username;

  return (
    <div className="home-container">
      <div className="user">
        <h3>SETracker</h3>
        <div className="btn">
          <button onClick={logout}>Logout</button>
          <button onClick={toggleFormVisibility}>
            {showForm ? 'Cancel' : 'Add Subscription'}
          </button>
        </div>
      </div>
      <p className='userN'>Welcome, <span>{displayUsername}</span></p>
      {showForm && <SubscriptionForm onAdd={addSubscription} />}
      <ExpenseChart subscriptions={subscriptions} />
      <SubscriptionList subscriptions={subscriptions} onDelete={handleDelete} onEdit={handleEditSubscription} />
    </div>
  );
};

export default HomePage;
