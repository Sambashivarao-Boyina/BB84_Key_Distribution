import { motion } from "framer-motion";
import { Basis, Bit } from "@/types/bb84";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Check, X } from "lucide-react";

interface BobPanelProps {
  bases: Basis[];
  measurements: (Bit | null)[];
  aliceBases: Basis[];
  currentRound: number;
  isActive: boolean;
  onBasisChoice?: (basis: Basis) => void;
  isManualMode?: boolean;
}

export const BobPanel = ({ 
  bases, 
  measurements, 
  aliceBases, 
  currentRound, 
  isActive,
  onBasisChoice,
  isManualMode = false
}: BobPanelProps) => {
  const basesMatch = (index: number) => {
    return aliceBases[index] && bases[index] && aliceBases[index] === bases[index];
  };

  return (
    <Card className="h-full glass border-bob/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-bob">
          <User className="w-5 h-5" />
          Bob
          <Badge variant="outline" className="border-bob/50 text-bob">
            Receiver
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Measurement Bases & Results
        </div>
        
        {/* Manual basis selection for current round */}
        {isManualMode && isActive && currentRound < bases.length && (
          <div className="p-3 border border-bob/30 rounded-lg bg-bob/5">
            <div className="text-sm font-medium mb-2">Choose basis for round {currentRound + 1}:</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBasisChoice?.("+") }
                className="border-bob/50 hover:bg-bob/10"
              >
                + (Rectilinear)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBasisChoice?.("x")}
                className="border-bob/50 hover:bg-bob/10"
              >
                × (Diagonal)
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: Math.max(bases.length, 8) }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: bases[index] ? 1 : 0.3, 
                scale: index === currentRound ? 1.1 : 1,
                borderColor: index === currentRound && isActive ? "hsl(var(--bob))" : "transparent"
              }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }}
              className="relative aspect-square border-2 rounded-lg p-2 text-center transition-colors"
            >
              {bases[index] && (
                <>
                  {/* Basis symbol */}
                  <div className={`text-lg font-mono ${
                    bases[index] === "+" ? "basis-plus" : "basis-cross"
                  }`} />
                  
                  {/* Measurement result */}
                  {measurements[index] !== null && (
                    <div className="text-xs font-mono mt-1">
                      Measured: {measurements[index]}
                    </div>
                  )}
                  
                  {/* Match indicator */}
                  {aliceBases[index] && (
                    <div className="absolute -top-1 -right-1">
                      {basesMatch(index) ? (
                        <Check className="w-4 h-4 text-success bg-background rounded-full p-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-destructive bg-background rounded-full p-0.5" />
                      )}
                    </div>
                  )}
                </>
              )}
              
              {/* Current round indicator */}
              {index === currentRound && isActive && (
                <motion.div
                  className="absolute -inset-1 border-2 border-bob rounded-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {bases.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Green ✓ = Basis match, Red ✗ = Basis mismatch</div>
            <div>Only matching bases contribute to the key</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};