import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    renewalDate: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:7000/subscriptions', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    onAdd(response.data.newSubscription);
    setFormData({ name: '', cost: '', renewalDate: '', category: '' }); // Reset form
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Subscription Name" value={formData.name} onChange={handleChange} required />
        <input name="cost" type="number" placeholder="Cost" value={formData.cost} onChange={handleChange} required />
        <input name="renewalDate" type="date" placeholder="Renewal Date" value={formData.renewalDate} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <button type="submit">Add Subscription</button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
