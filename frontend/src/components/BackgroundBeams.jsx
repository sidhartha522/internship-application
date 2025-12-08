import { motion } from 'framer-motion';

export default function BackgroundBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card" />
      
      {/* Animated gradient beams */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-0 top-1/4 h-1 w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-0 bottom-1/4 h-1 w-full bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
      />
    </div>
  );
}
