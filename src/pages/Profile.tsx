import { motion } from 'motion/react';
import { Settings, History, Calendar, MapPin, LogOut, ChevronRight, Edit2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

export default function Profile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [userCity, setUserCity] = useState('Location');
  const [lastDonated, setLastDonated] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem('rakta_seva_user_name');
    const savedGroup = localStorage.getItem('rakta_seva_user_blood_group');
    const savedCity = localStorage.getItem('rakta_seva_user_city');
    const savedLastDonated = localStorage.getItem('rakta_seva_last_donated');
    
    if (savedName) setUserName(savedName);
    if (savedGroup) setBloodGroup(savedGroup);
    if (savedCity) setUserCity(savedCity);
    if (savedLastDonated) {
      setLastDonated(savedLastDonated);
      // Check 90 days eligibility
      const lastDate = new Date(savedLastDonated);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setIsEligible(diffDays >= 90);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const menuItems = [
    { icon: Edit2, label: 'Edit Profile', color: 'text-blue-600', bg: 'bg-blue-50', onClick: () => navigate('/register') },
    { icon: ShieldCheck, label: 'Privacy Settings', color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-full">
      {/* Header / Brand */}
      <div className="bg-red-600 h-40 pt-12 px-6 rounded-b-[3rem] relative">
        <div className="flex justify-between items-center text-white mb-6">
          <h1 className="text-xl font-bold">My Profile</h1>
          <button className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="absolute -bottom-16 left-6 right-6 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200 border border-slate-100 flex items-center gap-4">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{userName}</h2>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
              <MapPin className="w-3 h-3 text-red-600" /> {userCity}
            </div>
            <div className="mt-2 flex gap-2">
              {!isEligible && (
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                  On Recovery
                </div>
              )}
              <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-widest">
                Verified
              </div>
            </div>
          </div>
          <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
            {bloodGroup}
          </div>
        </div>
      </div>

      <div className="mt-24 p-6 space-y-6">
        {/* Last Donated Stat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <span className="text-xl font-bold text-slate-900 block truncate">
            {lastDonated ? format(parseISO(lastDonated), 'dd MMM yyyy') : 'First Time'}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 inline-block">Last Donated</span>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {menuItems.map((item, i) => (
            <button 
              key={i}
              onClick={item.onClick}
              className={cn(
                "w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors",
                i !== menuItems.length - 1 && "border-bottom border-slate-50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-xl", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <span className="font-bold text-slate-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="w-full py-4 text-red-600 font-bold text-sm bg-red-50 rounded-3xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Clear Data & Logout
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pb-12">
        Rakta Seva Connect v1.0.4
      </p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
