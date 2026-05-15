import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Calendar, MapPin, Phone, User, Heart, ChevronRight, HeartPulse } from 'lucide-react';
import { addMonths, isAfter, parseISO, format } from 'date-fns';
import { BloodGroup } from '../types';
import { donorService } from '../services/donorService';

export default function RegisterDonor({ onComplete }: { onComplete?: (name: string, bloodGroup: string, city: string, lastDonationDate?: string, phone?: string) => void }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+' as BloodGroup,
    district: '',
    city: '',
    lastDonationDate: '',
    isAvailable: true,
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Logic: Mark unavailable if donated in last 3 months
    let finalAvailability = formData.isAvailable;
    if (formData.lastDonationDate) {
      const lastDate = parseISO(formData.lastDonationDate);
      const threeMonthsLater = addMonths(lastDate, 3);
      if (isAfter(threeMonthsLater, new Date())) {
        finalAvailability = false;
      }
    }

    console.log('Saving Donor:', { ...formData, isAvailable: finalAvailability });
    
    try {
      await donorService.registerDonor({
        ...formData,
        age: parseInt(formData.age),
        isAvailable: finalAvailability,
        lastDonatedAt: formData.lastDonationDate || null
      });
      
      if (onComplete) {
        onComplete(formData.fullName, formData.bloodGroup, formData.city, formData.lastDonationDate, formData.phoneNumber);
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 max-w-md mx-auto shadow-2xl">
      <header className="flex items-center gap-4 mb-8">
        {!onComplete && (
          <button 
            onClick={() => navigate(-1)}
            className="bg-white p-2 rounded-xl shadow-sm hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
        )}
        <div className="flex-1 mt-4">
          <div className="bg-red-50 w-24 h-24 rounded-[3rem] flex items-center justify-center text-red-600 mx-auto mb-8 shadow-sm border border-red-100 ring-8 ring-red-50/50">
            <HeartPulse className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-3">Every Drop Counts</h1>
          <p className="text-slate-500 font-semibold text-sm max-w-[300px] mx-auto leading-relaxed">
            Register now to join India's fastest growing blood donor network.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Rajesh Kumar"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-medium"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <input
              required
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-medium"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
              <input
                required
                type="number"
                min="18"
                max="65"
                placeholder="25"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-medium"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
              <select
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-medium appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3 h-3" /> Select Blood Group
            </label>
            <div className="grid grid-cols-4 gap-3">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setFormData({ ...formData, bloodGroup: group })}
                  className={cn(
                    "h-14 rounded-2xl font-bold transition-all border-2 flex items-center justify-center text-lg",
                    formData.bloodGroup === group 
                      ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100 scale-105" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-red-200 active:scale-95"
                  )}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location (City/District)
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Bangalore"
              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-semibold placeholder:text-slate-300"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Last Donation Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all font-semibold appearance-none cursor-pointer"
                value={formData.lastDonationDate}
                onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 px-1 italic">Giving blood regularly saves lives. Leave empty if this is your first time.</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-5 rounded-3xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          Complete Registration
        </button>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
