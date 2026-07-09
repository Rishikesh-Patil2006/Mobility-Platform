import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export default function AdminDashboardPage() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await apiClient.get('/health');
        if (response.data.success) {
          setStatus('Backend is Connected');
        } else {
          setStatus('Backend Connection Failed');
        }
      } catch (error) {
        setStatus('Error connecting to backend');
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Roadmate Admin</h1>
        <p className="text-lg text-gray-600 mb-6">Admin Web Connected</p>
        
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-700 font-medium">Backend Status:</p>
          <p className={`text-lg font-semibold mt-1 ${status.includes('Connected') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
