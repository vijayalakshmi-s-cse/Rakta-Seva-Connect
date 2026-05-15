import { motion } from 'motion/react';
import { Search, MapPin, Filter, MessageSquare, Phone, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BloodGroup, Donor } from '../types';
import { donorService } from '../services/donorService';

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'All'>('All');

  useEffect(() => {
    const fetchDonors = async () => {
      const data = await donorService.getNearbyDonors();
      setDonors(data);
      setLoading(false);
    };
    fetchDonors();
  }, []);

  const bloodGroups: (BloodGroup | 'All')[] = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = donors.filter(donor => 
    selectedGroup === 'All' || donor.bloodGroup === selectedGroup
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nearby Donors</h1>
        <p className="text-slate-500 text-sm">Find life-savers in your area</p>
      </header>

      {/* Search & Filter */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 pb-4 -mx-6 px-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by city or area..." 
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {bloodGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border",
                selectedGroup === group
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-100"
                  : "bg-white border-slate-100 text-slate-500 hover:border-red-200"
              )}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDonors.map((donor, i) => (
          <motion.div
            key={donor.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-50 border-b-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm transition-colors border border-slate-100 bg-slate-50 text-slate-700"
            )}>
              {donor.bloodGroup}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 truncate uppercase tracking-tight">{donor.name}</h3>
                {donor.isAvailable && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <MapPin className="w-3 h-3" /> {typeof (donor as any).distance === 'number' ? `${(donor as any).distance.toFixed(1)} KM` : ((donor as any).distance || 'Near')}
                </div>
                {!donor.isAvailable && (
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-slate-100 text-slate-400">
                    Busy
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-slate-100 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredDonors.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
            <Info className="w-12 h-12 mb-4" />
            <p className="font-bold">No donors found for this group</p>
            <p className="text-sm">Try selecting 'All' to see nearby people</p>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
