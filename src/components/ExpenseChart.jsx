import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion'; // Import framer-motion

// Register required components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ExpenseChart = ({ subscriptions }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  // Generate years for dropdown
  const years = Array.from(new Array(10), (_, i) => selectedYear - i); // Last 10 years

  // Calculate total expenses and subscriptions for the selected month and year
  useEffect(() => {
    const monthlySubscriptions = subscriptions.filter(sub => {
      const renewalDate = new Date(sub.renewalDate);
      return (
        renewalDate.getMonth() + 1 === selectedMonth &&
        renewalDate.getFullYear() === selectedYear
      );
    });

    // Calculate total expense and number of subscriptions
    const total = monthlySubscriptions.reduce((acc, sub) => acc + sub.cost, 0);
    setTotalExpense(total);
    setTotalSubscriptions(monthlySubscriptions.length);
  }, [subscriptions, selectedMonth, selectedYear]);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewalDate);
    return renewalDate.getFullYear() === selectedYear && renewalDate.getMonth() + 1 === selectedMonth;
  });

  const data = {
    labels: filteredSubscriptions.map(sub => sub.name),
    datasets: [
      {
        label: 'Subscription Costs',
        data: filteredSubscriptions.map(sub => sub.cost),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div className='cardflex'>
        <div className='filter'>
          <h2>Expense Chart</h2>
          <div className="fil">
            <label>
              Month:
              <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
            </label>

            <label>
              Year:
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="card">
          <h3>Total Expense for Selected Month: </h3>
          <span>${totalExpense.toFixed(2)}</span>
        </div>
        <div className="card">
          <h3>Total Subscriptions for Selected Month: </h3>
          <span>{totalSubscriptions}</span>
        </div>
      </div>

      {/* Framer Motion applied to animate the chart */}
      <motion.div
        className="line"
        initial={{ opacity: 0, y: 50 }} // Start with 0 opacity and move from 50px below
        animate={{ opacity: 1, y: 0 }}  // Fade in and move to original position
        transition={{ duration: 0.6 }}  // Animation duration of 0.6 seconds
      >
        <Line data={data} />
      </motion.div>
    </div>
  );
};

export default ExpenseChart;
