import { motion, AnimatePresence } from 'motion/react';
import { Search, AlertTriangle, MapPin, Clock, ArrowRight, X, HeartPulse, Building2, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';
import { donorService } from '../services/donorService';
import { BloodGroup, BloodRequest } from '../types';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function Home() {
  const [userName, setUserName] = useState(() => localStorage.getItem('rakta_seva_user_name') || 'Donor');
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [newRequestAlert, setNewRequestAlert] = useState<BloodRequest | null>(null);
  const userPhone = localStorage.getItem('rakta_seva_user_phone');
  
  useEffect(() => {
    const handleStorageChange = () => {
      const name = localStorage.getItem('rakta_seva_user_name');
      if (name) setUserName(name);
    };

    const handleNewRequestGlobal = (e: any) => {
      const resp = e.detail;
      // If it's MY request being accepted
      if (resp.phoneNumber === userPhone && resp.status === 'accepted') {
        setNewRequestAlert({...resp, customTitle: "Request Accepted!"});
        // Auto hide after 12 seconds for personal alerts
        setTimeout(() => setNewRequestAlert(null), 12000);
      } else if (resp.isEmergency && !newRequestAlert) {
        setNewRequestAlert(resp);
        setTimeout(() => setNewRequestAlert(null), 8000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('new-blood-request', handleNewRequestGlobal);
    // Initial check
    handleStorageChange();

    // Fetch requests
    const fetchRequests = async () => {
      const data = await donorService.getRequests();
      // Sort: My requests first, then emergency, then others
      const sorted = [...data].sort((a, b) => {
        const isAMine = a.phoneNumber === userPhone;
        const isBMine = b.phoneNumber === userPhone;
        if (isAMine && !isBMine) return -1;
        if (!isAMine && isBMine) return 1;
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return 0;
      });
      setRequests(sorted.slice(0, 10));
    };
    fetchRequests();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('new-blood-request', handleNewRequestGlobal);
    };
  }, [userPhone]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    patientName: '',
    phoneNumber: '',
    bloodGroup: 'O+' as BloodGroup,
    hospitalName: 'Apollo Hospital Bangalore',
    location: '',
    unitsRequired: 1,
    isEmergency: true
  });

  const handleSubmitRequest = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const resp = await donorService.createRequest(requestData);
      setShowRequestModal(false);
      // Dispatch global event to simulate push notification for testing
      window.dispatchEvent(new CustomEvent('new-blood-request', { detail: resp.request }));
      
      // Refresh requests
      const data = await donorService.getRequests();
      setRequests(data.filter(r => r.isEmergency).slice(0, 10));
      // Reset form
      setRequestData({
        patientName: '',
        phoneNumber: '',
        bloodGroup: 'O+',
        hospitalName: 'Apollo Hospital Bangalore',
        location: '',
        unitsRequired: 1,
        isEmergency: true
      });
      alert('Request created! Nearby donors notified via FCM.');
    } catch (err) {
      alert('Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Real-time Emergency Alert */}
      <AnimatePresence>
        {newRequestAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-6 right-6 z-[70]"
          >
            <div className={`${newRequestAlert.status === 'accepted' ? 'bg-green-600 ring-green-500/20' : 'bg-red-600 ring-red-500/20'} text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 border ${newRequestAlert.status === 'accepted' ? 'border-green-500' : 'border-red-500'} ring-4`}>
              <div className={`${newRequestAlert.status === 'accepted' ? 'bg-white text-green-600' : 'bg-white text-red-600'} p-2 rounded-2xl animate-pulse`}>
                {newRequestAlert.status === 'accepted' ? <HeartPulse className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm uppercase tracking-tighter">
                  {(newRequestAlert as any).customTitle || 'Emergency Alert!'}
                </h4>
                <p className="text-xs font-bold opacity-90 truncate">
                  {newRequestAlert.status === 'accepted' 
                    ? `Donor ${newRequestAlert.acceptedBy} has accepted your request!` 
                    : `${newRequestAlert.bloodGroup} needed for ${newRequestAlert.patientName} at ${newRequestAlert.hospitalName}`}
                </p>
              </div>
              <button onClick={() => setNewRequestAlert(null)} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-8 p-2">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-3">
          <HeartPulse className="w-4 h-4" /> Rakta Seva
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Namaste, {userName}!</h1>
        <p className="text-slate-500 font-medium mt-1">Together, we can save lives today.</p>
      </header>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <NavLink 
          to="/donors" 
          className="bg-red-50 p-4 rounded-3xl border border-red-100 flex flex-col gap-3 hover:bg-red-100 transition-colors"
        >
          <div className="bg-red-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white">
            <Search className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900">Find Donors</span>
        </NavLink>

        <button 
          onClick={() => setShowRequestModal(true)}
          className="bg-orange-50 p-4 rounded-3xl border border-orange-100 flex flex-col gap-3 hover:bg-orange-100 text-left transition-colors"
        >
          <div className="bg-orange-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900">Create Request</span>
        </button>
      </div>

      {/* Emergency Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Emergency Requests</h2>
          <NavLink to="/requests" className="text-red-600 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="space-y-4">
          {requests.map((req, i) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={req.id}
              className="bg-white border border-slate-100 rounded-3xl p-4 flex gap-4 shadow-sm relative overflow-hidden"
            >
              <div className="bg-red-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 z-10">
                {req.bloodGroup}
              </div>
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-900 truncate">{req.patientName}</h3>
                  {req.requesterType === 'Hospital' ? (
                    <Building2 className="w-3 h-3 text-blue-500" />
                  ) : (
                    <User className="w-3 h-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span className="truncate">{req.hospitalName}</span>
                  <span className="text-red-600 font-bold ml-1">({typeof req.distance === 'number' ? `${req.distance.toFixed(1)} KM` : (req.distance || '0.0 KM')})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{req.timestamp ? formatDistanceToNow(parseISO(req.timestamp), { addSuffix: true }) : 'Just now'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full w-fit">
                  URGENT
                </div>
                {req.status === 'accepted' ? (
                  <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    Help on way
                  </div>
                ) : (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await fetch(`/api/requests/${req.id}/accept`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ donorName: userName })
                        });
                        // Refresh
                        const data = await donorService.getRequests();
                        // Dispatch event to self (if it's our own request accepted, though someone else usually accepts)
                        window.dispatchEvent(new CustomEvent('new-blood-request', { detail: { ...req, status: 'accepted', acceptedBy: userName } }));
                        
                        setRequests(data.filter(r => r.phoneNumber === userPhone || r.isEmergency).slice(0, 10));
                        alert(`Request accepted! The requester (${req.patientName}) has been notified on ${req.phoneNumber}. You are now hidden from the donor list for 90 days.`);
                      } catch (err) {
                        alert('Failed to accept request');
                      }
                    }}
                    className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-red-100 active:scale-95"
                  >
                    Accept
                  </button>
                )}
                <div className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${
                  req.requesterType === 'Hospital' 
                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                    : 'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {req.requesterType || 'Patient'}
                </div>
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No emergency requests active</p>
            </div>
          )}
        </div>
      </section>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-2 rounded-xl text-white">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Emergency Request</h2>
                </div>
                <button onClick={() => setShowRequestModal(false)} className="p-2 bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Patient Name</label>
                    <input 
                      required
                      className="w-full bg-slate-50 rounded-2xl p-4 font-medium"
                      value={requestData.patientName}
                      onChange={e => setRequestData({...requestData, patientName: e.target.value})}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-slate-50 rounded-2xl p-4 font-medium"
                      value={requestData.phoneNumber}
                      onChange={e => setRequestData({...requestData, phoneNumber: e.target.value})}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Blood Group</label>
                      <select 
                        className="w-full bg-slate-50 rounded-2xl p-4 font-medium appearance-none"
                        value={requestData.bloodGroup}
                        onChange={e => setRequestData({...requestData, bloodGroup: e.target.value as BloodGroup})}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Units Needed</label>
                      <input 
                        type="number"
                        min="1"
                        className="w-full bg-slate-50 rounded-2xl p-4 font-medium"
                        value={requestData.unitsRequired}
                        onChange={e => setRequestData({...requestData, unitsRequired: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Hospital/Location</label>
                    <input 
                      required
                      className="w-full bg-slate-50 rounded-2xl p-4 font-medium"
                      value={requestData.location}
                      onChange={e => setRequestData({...requestData, location: e.target.value, hospitalName: e.target.value})}
                      placeholder="Enter hospital or area"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-5 rounded-3xl font-bold shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Sending Alerts...' : 'Send FCM Alerts'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
