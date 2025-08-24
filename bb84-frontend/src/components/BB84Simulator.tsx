import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ProtocolState,
  ChatMessage,
  PhotonData,
  QubitData,
  Basis,
  Bit,
} from "@/types/bb84";
import { AlicePanel } from "./AlicePanel";
import { BobPanel } from "./BobPanel";
import { QuantumChannel } from "./QuantumChannel";
import { EvePanel } from "./EvePanel";
import { ControlPanel } from "./ControlPanel";
import { ChatLog } from "./ChatLog";
import { ResultsCard } from "./ResultsCard";
import { ThemeToggle } from "./ThemeToggle";
import { BB84Api, handleApiError } from "@/services/bb84Api";
import { useToast } from "@/hooks/use-toast";

const generateRandomBit = (): Bit => (Math.random() < 0.5 ? 0 : 1);
const generateRandomBasis = (): Basis => (Math.random() < 0.5 ? "+" : "x");

export const BB84Simulator = () => {
  const { toast } = useToast();

  const [state, setState] = useState<ProtocolState>({
    mode: "without-eve",
    step: "idle",
    currentRound: 0,
    totalRounds: 8,
    aliceData: [],
    bobBases: [],
    bobMeasurements: [],
    eveInterceptions: [],
    matchingIndices: [],
    sharedKey: "",
    errorRate: 0,
    speed: "normal",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [photons, setPhotons] = useState<PhotonData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [eveInterceptionRate, setEveInterceptionRate] = useState(0.5);
  const [errorHistory, setErrorHistory] = useState<number[]>([]);

  const addMessage = useCallback(
    (sender: ChatMessage["sender"], message: string, round?: number) => {
      const newMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        sender,
        message,
        timestamp: Date.now(),
        round,
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const generateQubits = useCallback((): QubitData[] => {
    return Array.from({ length: state.totalRounds }, () => ({
      bit: generateRandomBit(),
      basis: generateRandomBasis(),
    }));
  }, [state.totalRounds]);

  const generateBobBases = useCallback((): Basis[] => {
    return Array.from({ length: state.totalRounds }, () =>
      generateRandomBasis()
    );
  }, [state.totalRounds]);

  const onPrepareQubits = useCallback(async () => {
    try {
      setIsProcessing(true);
      await BB84Api.reset();

      const aliceData = generateQubits();
      const bobBases = generateBobBases();

      setState((prev) => ({
        ...prev,
        step: "prepared",
        currentRound: 0,
        aliceData,
        bobBases,
        bobMeasurements: new Array(state.totalRounds).fill(null),
        eveInterceptions: [],
        matchingIndices: [],
        sharedKey: "",
        errorRate: 0,
      }));

      setMessages([]);
      setPhotons([]);
      setErrorHistory([]);

      addMessage(
        "system",
        `Prepared ${state.totalRounds} random qubits with random bases`
      );
      addMessage(
        "alice",
        `Generated ${state.totalRounds} qubits for transmission`
      );
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [state.totalRounds, generateQubits, generateBobBases, addMessage, toast]);

  const onSendQubits = useCallback(async () => {
    if (state.aliceData.length === 0) return;

    try {
      setIsProcessing(true);
      setState((prev) => ({ ...prev, step: "sending", currentRound: 0 }));

      const eveInterceptions: boolean[] = [];
      const bobMeasurements: (Bit | null)[] = new Array(state.totalRounds).fill(
        null
      );

      for (let i = 0; i < state.aliceData.length; i++) {
        const qubit = state.aliceData[i];
        const bobBasis = state.bobBases[i];

        // Update current round
        setState((prev) => ({ ...prev, currentRound: i }));

        // Send qubit from Alice
        await BB84Api.sendQubit({ bit: qubit.bit, basis: qubit.basis });
        addMessage("alice", `Sent bit ${qubit.bit} in ${qubit.basis} basis`, i);

        // Create and animate photon
        const photon: PhotonData = {
          id: `photon-${i}`,
          bit: qubit.bit,
          basis: qubit.basis,
          round: i,
          x: 0,
          y: 0,
          isIntercepted: false,
          isComplete: false,
        };

        setPhotons((prev) => [...prev, photon]);

        // Eve interception (if enabled)
        const shouldIntercept =
          state.mode === "with-eve" && Math.random() < eveInterceptionRate;
        eveInterceptions[i] = shouldIntercept;

        if (shouldIntercept) {
          await BB84Api.eveIntercept(i);
          photon.isIntercepted = true;
          addMessage("eve", `Intercepted and measured qubit ${i + 1}`, i);
        }

        const bobResponse = await BB84Api.bobMeasure(i, { basis: bobBasis });
        bobMeasurements[i] = bobResponse.bob_result.measured;
        addMessage(
          "bob",
          `Measured in ${bobBasis} basis → ${bobResponse.bob_result.measured}`,
          i
        );
        // Wait for animation
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            state.speed === "fast"
              ? 500
              : state.speed === "normal"
              ? 1000
              : 1500
          )
        );
      }

      setState((prev) => ({
        ...prev,
        step: "measuring",
        currentRound: state.totalRounds,
        bobMeasurements,
        eveInterceptions,
      }));

      addMessage("system", "All qubits transmitted and measured");
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [state, eveInterceptionRate, addMessage, toast]);

  const onCompareBases = useCallback(async () => {
    try {
      setIsProcessing(true);

      const result = await BB84Api.compareBases();

      setState((prev) => ({
        ...prev,
        step: "comparing",
        matchingIndices: result.matching_indices,
      }));

      addMessage(
        "system",
        `Publicly compared bases: ${result.matching_indices.length} matches found`
      );
      addMessage(
        "alice",
        `Keeping bits at positions: ${result.matching_indices.join(", ")}`
      );
      addMessage(
        "bob",
        `Keeping bits at positions: ${result.matching_indices.join(", ")}`
      );
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, toast]);

  const onGenerateKey = useCallback(async () => {
    try {
      setIsProcessing(true);

      const result = await BB84Api.getFinalKey();

      setState((prev) => ({
        ...prev,
        step: "complete",
        sharedKey: result.shared_key || "",
        errorRate: result.error_rate / 100, // normalize backend percentage
      }));
      setErrorHistory((prev) => [...prev, result.error_rate / 100]); // ✅ history normalized too

      if (result.shared_key) {
        addMessage("system", `✅ Shared key generated: ${result.shared_key}`);
        addMessage("system", `Error rate: ${result.error_rate.toFixed(1)}%`);

        if (result.error_rate > 20) {
          // backend already returns percent
          addMessage(
            "system",
            "⚠️ High error rate detected - possible eavesdropping!"
          );
        } else {
          addMessage(
            "system",
            "🔒 Low error rate - secure communication established"
          );
        }
      } else {
        addMessage("system", `❌ Key generation aborted: ${result.msg}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, toast]);

  const onReset = useCallback(() => {
    setState({
      mode: state.mode,
      step: "idle",
      currentRound: 0,
      totalRounds: state.totalRounds,
      aliceData: [],
      bobBases: [],
      bobMeasurements: [],
      eveInterceptions: [],
      matchingIndices: [],
      sharedKey: "",
      errorRate: 0,
      speed: state.speed,
    });
    setMessages([]);
    setPhotons([]);
    setErrorHistory([]);
    setIsProcessing(false);
    addMessage("system", "Protocol reset - ready for new simulation");
  }, [state.mode, state.totalRounds, state.speed, addMessage]);

  return (
    <div className="min-h-screen p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            BB84 Quantum Key Distribution
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Interactive demonstration of quantum cryptography protocol
          </motion.p>
        </div>

        {/* Eve Panel (only when active) */}
        <AnimatePresence>
          {state.mode === "with-eve" && (
            <EvePanel
              isActive={state.step === "sending"}
              interceptionRate={eveInterceptionRate}
              interceptedRounds={state.eveInterceptions
                .map((intercepted, i) => (intercepted ? i : -1))
                .filter((i) => i >= 0)}
              totalRounds={state.totalRounds}
              onInterceptionRateChange={setEveInterceptionRate}
              currentRound={state.currentRound}
            />
          )}
        </AnimatePresence>

        {/* Main Simulation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alice Panel */}
          <AlicePanel
            qubits={state.aliceData}
            currentRound={state.currentRound}
            isActive={state.step === "sending"}
          />

          {/* Quantum Channel */}
          <QuantumChannel
            photons={photons}
            isActive={state.step === "sending"}
            speed={state.speed}
            onPhotonComplete={(photonId) => {
              setPhotons((prev) =>
                prev.map((p) =>
                  p.id === photonId ? { ...p, isComplete: true } : p
                )
              );
            }}
          />

          {/* Bob Panel */}
          <BobPanel
            bases={state.bobBases}
            measurements={state.bobMeasurements}
            aliceBases={state.aliceData.map((q) => q.basis)}
            currentRound={state.currentRound}
            isActive={state.step === "measuring"}
          />
        </div>

        {/* Control Panel */}
        <ControlPanel
          state={state}
          onPrepareQubits={onPrepareQubits}
          onSendQubits={onSendQubits}
          onCompareBases={onCompareBases}
          onGenerateKey={onGenerateKey}
          onReset={onReset}
          onModeChange={(mode) => setState((prev) => ({ ...prev, mode }))}
          onSpeedChange={(speed) => setState((prev) => ({ ...prev, speed }))}
          onQubitCountChange={(count) =>
            setState((prev) => ({ ...prev, totalRounds: count }))
          }
          isProcessing={isProcessing}
        />

        {/* Bottom Row: Chat and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChatLog
            messages={messages}
            isCollapsed={chatCollapsed}
            onToggle={() => setChatCollapsed(!chatCollapsed)}
          />

          <ResultsCard
            sharedKey={state.sharedKey}
            errorRate={state.errorRate}
            isSecure={state.errorRate <= 0.11}
            matchingBits={state.matchingIndices.length}
            totalBits={state.totalRounds}
            errorHistory={errorHistory}
          />
        </div>
      </div>
    </div>
  );
};
