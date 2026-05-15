import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Users, User, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/requests', icon: ClipboardList, label: 'Requests' },
    { path: '/donors', icon: Users, label: 'Donors' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden" id="app-container">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center px-6 py-4 pb-8 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 transition-colors relative",
                  isActive ? "text-red-600" : "text-slate-400 hover:text-slate-600"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1 h-1 bg-red-600 rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Action Button */}
      <NavLink
        to="/requests"
        className="absolute bottom-24 right-6 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-colors active:scale-95"
      >
        <HeartPulse className="w-8 h-8" />
      </NavLink>
    </div>
  );
}
