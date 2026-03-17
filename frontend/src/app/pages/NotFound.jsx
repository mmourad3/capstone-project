import { AlertTriangle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SmartBackButton } from '../components/SmartBackButton';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!userId);
    setUserType(role);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar isLoggedIn={isLoggedIn} userType={userType} />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <section className="text-center flex flex-col justify-center items-center py-20">
          <AlertTriangle className="text-yellow-400 dark:text-yellow-500 text-6xl mb-6 w-20 h-20" />
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            404 Not Found
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-400">
            This page does not exist
          </p>
          <SmartBackButton label="Go Back" />
        </section>
      </div>
    </div>
  );
}