import { motion } from "framer-motion";
import hacktonlog from "/amaravathi footer logo.png"

export const HackathonFooter = () => {
  return (
    <footer className="relative bg-gradient-to-br from-background via-muted/20 to-background border-t border-border">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          {/* Main Hackathon Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Hackathon Logo/Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={hacktonlog} className="h-36 w-36" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Amaravathi Quantum Valley Hackathon 2025
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px bg-primary/50 w-16"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="h-px bg-primary/50 w-16"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="h-px bg-primary/50 w-16"></div>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
              RGUKT Srikakulam
            </h3>
            
            <p className="text-lg text-muted-foreground italic">
              Pushing the Boundaries of Quantum Innovation
            </p>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-border/50 pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Project Category</h4>
                <p className="text-muted-foreground">Quantum Computing & Cryptography</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Technology Stack</h4>
                <p className="text-muted-foreground">React, TypeScript, Framer Motion</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Protocol</h4>
                <p className="text-muted-foreground">BB84 Quantum Key Distribution</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-border/50 pt-4 text-xs text-muted-foreground"
          >
            <p>© 2025 AQV Hackathon - Quantum Key Distribution Simulator</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};