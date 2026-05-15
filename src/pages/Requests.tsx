import { motion } from 'motion/react';
import { MapPin, Phone, Clock, AlertCircle, CheckCircle2, Building2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { donorService } from '../services/donorService';
import { BloodRequest } from '../types';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function Requests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userPhone = localStorage.getItem('rakta_seva_user_phone');
    const fetchRequests = async () => {
      const data = await donorService.getRequests();
      // Sort: My requests first, then emergency
      const sorted = [...data].sort((a, b) => {
        const isAMine = a.phoneNumber === userPhone;
        const isBMine = b.phoneNumber === userPhone;
        if (isAMine && !isBMine) return -1;
        if (!isAMine && isBMine) return 1;
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return 0;
      });
      setRequests(sorted);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAccept = (id: string) => {
    setAcceptedIds(prev => [...prev, id]);
  };

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blood Requests</h1>
          <p className="text-slate-500 text-sm">Help others in need</p>
        </div>
        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 italic">
          Live
        </div>
      </header>

      <div className="space-y-4">
        {requests.map((req, i) => {
          const isAccepted = acceptedIds.includes(req.id);
          return (
            <motion.div
              key={req.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "bg-white rounded-3xl p-5 border shadow-sm transition-all relative overflow-hidden",
                req.isEmergency ? "border-red-100" : "border-slate-100",
                isAccepted && "bg-slate-50 opacity-90"
              )}
            >
              {req.isEmergency && !isAccepted && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-2xl text-[10px] font-bold tracking-widest flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" /> EMERGENCY
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm",
                  req.isEmergency ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
                )}>
                  {req.bloodGroup}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 truncate">
                      {isAccepted ? "Details Shared" : req.patientName}
                    </h3>
                    {req.requesterType === 'Hospital' ? (
                      <Building2 className="w-3 h-3 text-blue-500" />
                    ) : (
                      <User className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  <p className="text-slate-600 text-sm font-medium mt-0.5">{req.hospitalName}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    <div className="flex items-center gap-1 text-slate-500 text-[10px] font-medium uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> {req.location}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> {req.timestamp ? formatDistanceToNow(parseISO(req.timestamp), { addSuffix: true }) : 'Just now'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-widest mb-0.5">Units</span>
                    <span className="font-bold text-slate-900">{req.units} Units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-widest mb-0.5">Distance</span>
                    <span className="font-bold text-slate-900">{typeof req.distance === 'number' ? `${req.distance.toFixed(1)} KM` : (req.distance || '0.0 KM')}</span>
                  </div>
                </div>

                <button
                  disabled={isAccepted}
                  onClick={() => handleAccept(req.id)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
                    isAccepted 
                      ? "bg-green-100 text-green-700" 
                      : req.isEmergency
                        ? "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95"
                        : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                  )}
                >
                  {isAccepted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Accepted
                    </>
                  ) : (
                    "Accept Request"
                  )}
                </button>
              </div>

              {isAccepted && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-dashed border-slate-200"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Requester Contact:</span>
                    <a href={`tel:+919876543210`} className="text-red-600 font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" /> +91 98765 43210
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
