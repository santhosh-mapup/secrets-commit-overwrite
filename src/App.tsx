
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FleetList from "./pages/FleetList";
import FleetDetails from "./pages/FleetDetails";
import VehicleList from "./pages/VehicleList";
import JobList from "./pages/JobList";
import Maintenance from "./pages/Maintenance";
import GpsProcessing from "./pages/GpsProcessing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleets" element={<FleetList />} />
          <Route path="/fleet-details" element={<FleetDetails />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/gps-processing" element={<GpsProcessing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
