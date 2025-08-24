import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eye, AlertTriangle } from "lucide-react";

interface EvePanelProps {
  isActive: boolean;
  interceptionRate: number;
  interceptedRounds: number[];
  totalRounds: number;
  onInterceptionRateChange?: (rate: number) => void;
  currentRound: number;
}

export const EvePanel = ({ 
  isActive, 
  interceptionRate, 
  interceptedRounds, 
  totalRounds, 
  onInterceptionRateChange,
  currentRound 
}: EvePanelProps) => {
  const interceptionPercentage = Math.round(interceptionRate * 100);
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="glass border-eve/30 bg-eve/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-eve">
            <Eye className="w-5 h-5" />
            Eve
            <Badge variant="destructive" className="bg-eve text-eve-foreground">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Eavesdropper
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground min-w-fit">
              Interception Rate:
            </div>
            <div className="flex-1">
              <Slider
                value={[interceptionPercentage]}
                onValueChange={(values) => onInterceptionRateChange?.(values[0] / 100)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            <div className="text-sm font-mono text-eve min-w-fit">
              {interceptionPercentage}%
            </div>
          </div>
          
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: totalRounds }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: interceptedRounds.includes(index) ? "hsl(var(--eve))" : "hsl(var(--muted))",
                  borderColor: index === currentRound && isActive ? "hsl(var(--eve))" : "transparent"
                }}
                transition={{ delay: index * 0.02 }}
                className="aspect-square rounded border-2 flex items-center justify-center"
              >
                {interceptedRounds.includes(index) && (
                  <Eye className="w-2 h-2 text-eve-foreground" />
                )}
                {index === currentRound && isActive && (
                  <motion.div
                    className="absolute inset-0 border border-eve rounded"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>Intercepted: {interceptedRounds.length}/{totalRounds} qubits</div>
            <div>Each interception introduces measurement disturbance</div>
          </div>
          
          {isActive && (
            <motion.div
              className="text-xs text-eve"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡ Currently intercepting quantum channel
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};