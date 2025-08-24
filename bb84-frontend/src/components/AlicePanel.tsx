import { motion } from "framer-motion";
import { QubitData } from "@/types/bb84";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface AlicePanelProps {
  qubits: QubitData[];
  currentRound: number;
  isActive: boolean;
}

export const AlicePanel = ({ qubits, currentRound, isActive }: AlicePanelProps) => {
  return (
    <Card className="h-full glass border-alice/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-alice">
          <User className="w-5 h-5" />
          Alice
          <Badge variant="outline" className="border-alice/50 text-alice">
            Sender
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Quantum Bits & Bases
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {qubits.map((qubit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: index === currentRound ? 1.1 : 1,
                borderColor: index === currentRound && isActive ? "hsl(var(--alice))" : "transparent"
              }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }}
              className="relative aspect-square border-2 rounded-lg p-2 text-center transition-colors"
            >
              {/* Bit representation */}
              <div className={`w-full h-6 rounded mb-1 ${
                qubit.bit === 0 && qubit.basis === "+" ? "bg-alice/60" :
                qubit.bit === 1 && qubit.basis === "+" ? "bg-warning/60" :
                qubit.bit === 0 && qubit.basis === "x" ? "bg-destructive/60" :
                "bg-success/60"
              }`} />
              
              {/* Basis symbol */}
              <div className={`text-lg font-mono ${
                qubit.basis === "+" ? "basis-plus" : "basis-cross"
              }`} />
              
              {/* Bit value */}
              <div className="text-xs font-mono mt-1 text-muted-foreground">
                {qubit.bit}
              </div>
              
              {/* Current round indicator */}
              {index === currentRound && isActive && (
                <motion.div
                  className="absolute -inset-1 border-2 border-alice rounded-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {qubits.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Colors: Blue(0+), Yellow(1+), Red(0×), Green(1×)</div>
            <div>Symbols: + (rectilinear), × (diagonal)</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};