import { useState } from "react";
import { HomeScreen } from "@/components/HomeScreen";
import { BB84Simulator } from "@/components/BB84Simulator";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "simulation">("home");
  const [simulationMode, setSimulationMode] = useState<"without-eve" | "with-eve">("without-eve");

  const handleStartSimulation = (mode: "without-eve" | "with-eve") => {
    setSimulationMode(mode);
    setCurrentView("simulation");
  };

  if (currentView === "home") {
    return <HomeScreen onStartSimulation={handleStartSimulation} />;
  }

  return <BB84Simulator />;
};

export default Index;
