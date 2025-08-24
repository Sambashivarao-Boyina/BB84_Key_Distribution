import { motion } from "framer-motion";
import { PhotonData } from "@/types/bb84";
import { Photon } from "./Photon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface QuantumChannelProps {
  photons: PhotonData[];
  isActive: boolean;
  speed: "slow" | "normal" | "fast";
  onPhotonComplete?: (photonId: string) => void;
}

export const QuantumChannel = ({ 
  photons, 
  isActive, 
  speed, 
  onPhotonComplete 
}: QuantumChannelProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          Quantum Channel
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-full">
        <div className="relative h-32 quantum-channel rounded-lg overflow-hidden">
          {/* Channel guides */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-primary/20 relative">
              {/* Measurement points */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-alice border-2 border-background shadow-lg" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bob border-2 border-background shadow-lg" />
              
              {/* Distance markers */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-primary/30"
                  style={{ left: `${20 + i * 15}%` }}
                />
              ))}
            </div>
          </div>
          
          {/* Photons */}
          <div className="absolute inset-0">
            {photons.map((photon) => (
              <Photon
                key={photon.id}
                photon={photon}
                speed={speed}
                onAnimationComplete={() => onPhotonComplete?.(photon.id)}
              />
            ))}
          </div>
          
          {/* Activity indicator */}
          {isActive && (
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {/* Quantum state label */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full">
            Quantum Superposition
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div>Photons carry quantum information from Alice to Bob</div>
          <div>Colors encode bit values in different bases</div>
        </div>
      </CardContent>
    </Card>
  );
};