import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function Splash() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-red-600 text-white z-50"
      id="splash-screen"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-full mb-6">
          <Heart className="w-16 h-16 text-red-600 fill-red-600" />
        </div>
        
        <motion.h1 
          className="text-4xl font-bold tracking-tight mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Rakta-Seva Connect
        </motion.h1>
        
        <motion.p 
          className="text-red-100 text-lg font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Life Saving Bridge
        </motion.p>
      </motion.div>
      
      <div className="absolute bottom-12">
        <div className="flex gap-1">
          <motion.div 
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
