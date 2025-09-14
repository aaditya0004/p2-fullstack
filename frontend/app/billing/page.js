'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import jsPDF from 'jspdf'; // Import the new library

const BillingPage = () => {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (user && token) {
      setIsFetching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/invoices/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch invoices');
        }

        const data = await res.json();
        setInvoices(data);
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
        fetchInvoices();
      }
    }
  }, [user, loading, router, fetchInvoices]);

  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text('Osto.one Cybersecurity', 20, 30);

    // Invoice Details
    doc.text(`Invoice ID: ${invoice._id}`, 20, 40);
    doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 20, 45);
    doc.text(`Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`, 20, 50);

    // Billed To
    doc.text('Billed To:', 20, 60);
    doc.text(user.companyName, 20, 65);
    doc.text(user.email, 20, 70);

    // Line Items Table Header
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);
    doc.text('Description', 22, 85);
    doc.text('Amount', 188, 85, null, null, 'right');
    doc.line(20, 88, 190, 88);

    // Line Items
    let yPos = 95;
    invoice.lineItems.forEach(item => {
        doc.text(item.description, 22, yPos);
        doc.text(`$${(item.amount / 100).toFixed(2)}`, 188, yPos, null, null, 'right');
        yPos += 7;
    });

    // Total
    doc.line(20, yPos, 190, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', 22, yPos + 5);
    doc.text(`$${(invoice.amount / 100).toFixed(2)}`, 188, yPos + 5, null, null, 'right');
    
    // Save the PDF
    doc.save(`Invoice-${invoice._id}.pdf`);
  };

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Billing History</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        {invoices.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">You have no invoices.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap font-mono text-xs">{invoice._id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          invoice.status === 'paid' ? 'text-green-900' : 'text-gray-900'
                        }`}>
                        <span aria-hidden className={`absolute inset-0 ${
                            invoice.status === 'paid' ? 'bg-green-200' : 'bg-gray-200'
                          } opacity-50 rounded-full`}></span>
                        <span className="relative">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">${(invoice.amount / 100).toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                       <button
                         onClick={() => handleDownloadPDF(invoice)}
                         className="text-indigo-600 hover:text-indigo-900 transition duration-300"
                       >
                         Download PDF
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default BillingPage;

