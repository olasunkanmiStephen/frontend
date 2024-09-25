import React, { useState } from 'react';

const SubscriptionList = ({ subscriptions, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const handleEditClick = (subscription) => {
    setCurrentSubscription(subscription);
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(currentSubscription); // Call the onEdit function passed from the parent
    setIsEditing(false); // Exit editing mode after saving
  };

  return (
    <div>
      <h2>Subscriptions</h2>

      {/* Conditionally render Edit Form or Subscription Table */}
      {isEditing ? (
        <div>
          <h3>Edit Subscription</h3>
          <form>
            <label>
              Name:
              <input
                type="text"
                value={currentSubscription.name}
                onChange={(e) =>
                  setCurrentSubscription({ ...currentSubscription, name: e.target.value })
                }
              />
            </label>
            <br />
            <label>
              Cost:
              <input
                type="number"
                value={currentSubscription.cost}
                onChange={(e) =>
                  setCurrentSubscription({ ...currentSubscription, cost: e.target.value })
                }
              />
            </label>
            <br />
            <label>
              Renewal Date:
              <input
                type="date"
                value={new Date(currentSubscription.renewalDate).toISOString().split('T')[0]}
                onChange={(e) =>
                  setCurrentSubscription({ ...currentSubscription, renewalDate: e.target.value })
                }
              />
            </label>
            <br />
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Renewal Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.name}</td>
                <td>${sub.cost}</td>
                <td>{new Date(sub.renewalDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEditClick(sub)}>Edit</button>
                  <button onClick={() => onDelete(sub._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionList;
