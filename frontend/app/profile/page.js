'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

const ProfilePage = () => {
  const { user, token, setUser, loading } = useAuth(); // Add loading from context
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // This effect handles redirection and fetching data
  useEffect(() => {
    // Wait until the initial loading is done
    if (!loading) {
      if (!token) {
        router.push('/login');
      } else {
        // Fetch profile only if we have a token and are not loading
        const fetchProfile = async () => {
          try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) {
              throw new Error('Failed to fetch profile');
            }

            const data = await res.json();
            setEmail(data.email);
            setCompanyName(data.companyName);
          } catch (err) {
            setError(err.message);
          }
        };
        fetchProfile();
      }
    }
  }, [loading, token, router]); // Depend on loading and token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setUser(prevUser => ({...prevUser, ...data}));
      setMessage('Profile updated successfully!');

    } catch (err) {
      setError(err.message);
    }
  };

  // Show a loading screen while AuthContext is checking the user's status
  if (loading || !user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600 animate-pulse">Loading user profile...</p>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto mt-10 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
          
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

