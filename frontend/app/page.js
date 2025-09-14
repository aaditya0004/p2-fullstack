'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import Header from '../components/Header.js'; // Import the new Header

export default function HomePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  
  const { user } = useAuth(); // Get the logged-in user from our context

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/plans');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    setSubscriptionStatus({ state: 'loading' });

    if (!user) {
      alert("Please log in to subscribe.");
      setSubscriptionStatus({ state: 'idle' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, userId: user._id }), // Use the user ID from context
      });

      if (!response.ok) {
        throw new Error('Subscription failed!');
      }

      const data = await response.json();
      setSubscriptionStatus({ state: 'success', message: `Successfully subscribed! Sub ID: ${data._id}` });
    } catch (err) {
      setSubscriptionStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
       <Header /> 
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Flexible and transparent pricing for all your cybersecurity needs.
          </p>
        </div>

        {subscriptionStatus?.state === 'loading' && <p className="text-center text-blue-400 mt-4">Processing subscription...</p>}
        {subscriptionStatus?.state === 'success' && <p className="text-center text-green-400 mt-4">{subscriptionStatus.message}</p>}
        {subscriptionStatus?.state === 'error' && <p className="text-center text-red-500 mt-4">Error: {subscriptionStatus.message}</p>}

        {loading && <p className="text-center mt-8">Loading plans...</p>}
        {error && <p className="text-center text-red-500 mt-8">Error: {error}</p>}
        
        {!loading && !error && (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan._id} className="border border-gray-700 rounded-lg shadow-lg p-8 flex flex-col bg-gray-800">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-2 text-gray-400">{plan.module}</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold">${plan.price / 100}</span>
                  <span className="text-base font-medium text-gray-400">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={subscriptionStatus?.state === 'loading' || !user}
                  className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
                  title={!user ? "You must be logged in to subscribe" : ""}
                >
                  {user ? (subscriptionStatus?.state === 'loading' ? 'Subscribing...' : 'Subscribe') : 'Login to Subscribe'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

