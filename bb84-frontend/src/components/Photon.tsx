import { motion } from "framer-motion";
import { PhotonData } from "@/types/bb84";
import { cn } from "@/lib/utils";

interface PhotonProps {
  photon: PhotonData;
  onAnimationComplete?: () => void;
  speed: "slow" | "normal" | "fast";
}

const SPEED_MAP = {
  slow: 1.4,
  normal: 0.8,
  fast: 0.4,
};

export const Photon = ({ photon, onAnimationComplete, speed }: PhotonProps) => {
  const { bit, basis } = photon;
  
  // Color mapping based on bit and basis
  const getPhotonClass = () => {
    if (bit === 0 && basis === "+") return "bit-0-plus";
    if (bit === 1 && basis === "+") return "bit-1-plus";
    if (bit === 0 && basis === "x") return "bit-0-cross";
    if (bit === 1 && basis === "x") return "bit-1-cross";
    return "bit-0-plus";
  };

  return (
    <motion.div
      className={cn(
        "photon",
        getPhotonClass(),
        photon.isIntercepted && "photon-glitch"
      )}
      initial={{ x: 0, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: 400, 
        opacity: 1, 
        scale: 1,
        y: Math.sin(photon.x / 50) * 6 // Slight wave motion
      }}
      transition={{
        duration: SPEED_MAP[speed],
        ease: [0.22, 0.61, 0.36, 1],
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }}
      onAnimationComplete={onAnimationComplete}
      style={{
        position: "absolute",
        left: `${photon.x}px`,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-3 h-3 rounded-full shadow-lg" />
      {/* Photon tail effect */}
      <motion.div
        className="absolute inset-0 w-8 h-1 -left-6 top-1/2 -translate-y-1/2 opacity-50 blur-sm rounded-full"
        style={{ backgroundColor: "currentColor" }}
        animate={{ scaleX: [0.5, 1, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.div>
  );
};