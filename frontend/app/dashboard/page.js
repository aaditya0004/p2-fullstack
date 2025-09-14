'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

const DashboardPage = () => {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (user && token) {
      setIsFetching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/subscriptions/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch subscriptions');
        }

        const data = await res.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    }
  }, [user, token]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchSubscriptions();
      }
    }
  }, [user, loading, router, fetchSubscriptions]);

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/subscriptions/${subscriptionId}/cancel`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to cancel subscription');
        }

        // To show the change instantly, we update the state
        setSubscriptions(currentSubscriptions =>
            currentSubscriptions.map(sub =>
                sub._id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
            )
        );

    } catch (err) {
        setError(err.message);
    }
  };


  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Subscriptions</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        {subscriptions.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">You have no active subscriptions.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              {subscriptions.map((sub) => (
                <li key={sub._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{sub.plan.name}</h3>
                    <p className="text-sm text-gray-500">{sub.plan.module}</p>
                    <p className="text-lg font-medium text-gray-700 mt-1">
                      ${(sub.plan.price / 100).toFixed(2)} / {sub.plan.billingCycle}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center">
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                    {sub.status === 'active' && (
                         <button 
                            onClick={() => handleCancel(sub._id)}
                            className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Cancel
                        </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

