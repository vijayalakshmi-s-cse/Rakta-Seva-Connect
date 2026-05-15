/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Requests from './pages/Requests';
import Donors from './pages/Donors';
import Profile from './pages/Profile';
import RegisterDonor from './pages/RegisterDonor';
import Layout from './components/Layout';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [flowComplete, setFlowComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleRegistrationComplete = (name: string, bloodGroup: string, city?: string, lastDonated?: string, phone?: string) => {
    localStorage.setItem('rakta_seva_user_name', name);
    localStorage.setItem('rakta_seva_user_blood_group', bloodGroup);
    if (city) localStorage.setItem('rakta_seva_user_city', city);
    if (lastDonated) localStorage.setItem('rakta_seva_last_donated', lastDonated);
    if (phone) localStorage.setItem('rakta_seva_user_phone', phone);
    localStorage.setItem('rakta_seva_registered', 'true');
    setFlowComplete(true);
    // Dispatch storage event to notify other components (like Home) if they are already mounted
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <Splash key="splash" />
      ) : !flowComplete ? (
        <motion.div
          key="registration"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-screen bg-slate-50"
        >
          <RegisterDonor onComplete={handleRegistrationComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-slate-50"
        >
          <Routes location={location}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="requests" element={<Requests />} />
              <Route path="donors" element={<Donors />} />
              <Route path="profile" element={<Profile />} />
              <Route path="register" element={<RegisterDonor />} />
            </Route>
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
