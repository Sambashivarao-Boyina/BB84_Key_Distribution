import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Shield, 
  Eye, 
  Zap, 
  Key, 
  ArrowRight, 
  Play,
  Lock,
  Users
} from "lucide-react";

interface HomeScreenProps {
  onStartSimulation: (mode: "without-eve" | "with-eve") => void;
}

export const HomeScreen = ({ onStartSimulation }: HomeScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-alice bg-clip-text text-transparent">
            BB84 Protocol
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience quantum cryptography in action. Watch Alice and Bob establish a secure key using quantum mechanics, 
            and see how eavesdropping attempts by Eve can be detected.
          </p>
          
          {/* Animated intro visualization */}
          <motion.div 
            className="flex items-center justify-center gap-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex items-center gap-2 text-alice">
              <Users className="w-5 h-5" />
              <span className="font-medium">Alice</span>
            </div>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ 
                    x: [0, 40, 80, 120, 160],
                    opacity: [0, 1, 1, 1, 0] 
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-bob">
              <span className="font-medium">Bob</span>
              <Users className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        {/* Protocol Explanation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card className="glass border-alice/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-alice">
                <Zap className="w-5 h-5" />
                1. Quantum Transmission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Alice encodes random bits in quantum states using random bases and sends photons to Bob through a quantum channel.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-bob/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bob">
                <Shield className="w-5 h-5" />
                2. Random Measurement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bob measures each photon using randomly chosen bases, sometimes matching Alice's basis, sometimes not.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Key className="w-5 h-5" />
                3. Key Sifting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Alice and Bob publicly compare their bases and keep only the bits where they used matching bases.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simulation Mode Selection */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Secure Mode */}
          <Card className="glass border-success/30 hover:border-success/50 transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Lock className="w-6 h-6" />
                Secure Channel
                <Badge variant="outline" className="ml-auto border-success/50 text-success">
                  No Eve
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Experience the BB84 protocol in ideal conditions. Watch Alice and Bob establish a secure shared key with minimal errors.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Low quantum bit error rate (QBER)</li>
                <li>• Successful key establishment</li>
                <li>• Demonstrates quantum security</li>
              </ul>
              <Button 
                className="w-full group-hover:bg-success group-hover:text-success-foreground transition-colors"
                onClick={() => onStartSimulation("without-eve")}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Secure Simulation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Eve Intercept Mode */}
          <Card className="glass border-eve/30 hover:border-eve/50 transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-eve">
                <Eye className="w-6 h-6" />
                Eavesdropping Attack
                <Badge variant="destructive" className="ml-auto">
                  Eve Intercepts
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                See what happens when Eve tries to intercept the quantum communication. Quantum mechanics reveals her presence!
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Increased quantum bit error rate</li>
                <li>• Eavesdropping detection</li>
                <li>• Protocol security demonstration</li>
              </ul>
              <Button 
                variant="destructive"
                className="w-full group-hover:bg-eve group-hover:text-eve-foreground transition-colors"
                onClick={() => onStartSimulation("with-eve")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Start with Eavesdropper
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Concepts */}
        <motion.div 
          className="text-center space-y-4 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-primary">Key Quantum Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="p-3 bg-muted/30 rounded-lg">
              <strong className="text-foreground">No-Cloning Theorem:</strong> Quantum states cannot be perfectly copied
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <strong className="text-foreground">Measurement Disturbance:</strong> Observing a quantum state changes it
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <strong className="text-foreground">Basis Dependence:</strong> Measurement outcome depends on chosen basis
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <strong className="text-foreground">Eavesdropping Detection:</strong> Interference increases error rates
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};