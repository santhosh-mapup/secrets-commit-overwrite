
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusChart } from "@/components/dashboard/VehicleStatusChart";
import { ProcessingSteps } from "@/components/dashboard/ProcessingSteps";
import { FleetOverview } from "@/components/dashboard/FleetOverview";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { JobStats } from "@/components/dashboard/JobStats";
import { Truck, Users, FileSpreadsheet } from "lucide-react";

interface FleetMeta {
  dot_number: number;
  motive_companies: string[];
  samsara_org_id: string;
}

interface Fleet {
  id: string;
  user_id: string;
  application_type: "samsara" | "motive";
  email: string;
  company_name: string;
  meta: FleetMeta;
  last_sync: number;
  vehicles: number;
  activeVehicles: number;
  drivers: number;
  activeDrivers: number;
}

interface ProcessingData {
  _id: string;
  done_jobs: number;
  end_time: string;
  error_jobs: number;
  intersectionFinderJobError: number;
  intersectionFinderJobSucesss: number;
  intersectionFinderJobs: number;
  intersectionProcessedVehicles: number;
  job_count: number;
  mapMatchedJobError: number;
  mapMatchedJobSuccesfull: number;
  mapMatchedJobs: number;
  mapMatchedVehicles: number;
  marketplace: string;
  nonTollRoadJobs: number;
  refresh_token: string;
  request_type: string;
  start_time: string;
  status: string;
  tollGpsFilteredVehicles: number;
  tollRoadJobs: number;
  tripCreatedVehicles: number;
  tripFetchJobs: number;
  trip_strategy: string;
  updated_at: string;
  user_id: string;
  vehicle_id: string;
}

interface Job {
  _id: string;
  job_id: string;
  marketplace: string;
  created_at: string;
  start_time: string;
  end_time: string;
  status: "completed" | "in-progress" | "scheduled" | "cancelled";
  trip_strategy: string;
  vehicle: {
    height: number;
    length: number;
    vehicle_id: string;
    vehicle_type: string;
    weight: number;
  };
  vehicle_count: number;
  vehicle_id: string;
}

const Dashboard = () => {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [processingData, setProcessingData] = useState<ProcessingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data loading simulation
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockFleets = [
        {
          id: "669027989755fcf4ecf6ce11",
          user_id: "14674542010192980000",
          application_type: "samsara" as const,
          email: "garrys@longviewlogistics.ca",
          company_name: "Longview Logistics",
          meta: {
            dot_number: 2884286,
            motive_companies: [],
            samsara_org_id: ""
          },
          last_sync: Date.now() - 3600000, // 1 hour ago
          vehicles: 45,
          activeVehicles: 38,
          drivers: 42,
          activeDrivers: 39
        },
        {
          id: "663a5904f8b7d5a516cc0e50",
          user_id: "663a590415dad2afba70943d",
          application_type: "motive" as const,
          email: "tom.craig@chhj.com",
          company_name: "CHHJ Transport",
          meta: {
            dot_number: 0,
            motive_companies: ["400307"],
            samsara_org_id: ""
          },
          last_sync: Date.now() - 86400000, // 1 day ago
          vehicles: 32,
          activeVehicles: 26,
          drivers: 30,
          activeDrivers: 28
        },
      ];
      
      // Mock jobs data
      const mockJobs = [
        {
          _id: "job1",
          job_id: "JOB20250512001",
          marketplace: "Samsara",
          created_at: new Date().toISOString(),
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 86400000).toISOString(),
          status: "in-progress" as const,
          trip_strategy: "Standard",
          vehicle: {
            height: 4.5,
            length: 18,
            vehicle_id: "vehicle1",
            vehicle_type: "Semi-truck",
            weight: 12000
          },
          vehicle_count: 1,
          vehicle_id: "vehicle1"
        },
        {
          _id: "job2",
          job_id: "JOB20250510002",
          marketplace: "Motive",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          start_time: new Date(Date.now() - 172800000).toISOString(),
          end_time: new Date(Date.now() - 86400000).toISOString(),
          status: "completed" as const,
          trip_strategy: "Optimized",
          vehicle: {
            height: 3.8,
            length: 15,
            vehicle_id: "vehicle2",
            vehicle_type: "Delivery Truck",
            weight: 8000
          },
          vehicle_count: 1,
          vehicle_id: "vehicle2"
        }
      ];
      
      // Mock processing data
      const mockProcessingData = [
        {
          _id: "process1",
          done_jobs: 45,
          end_time: new Date(Date.now() + 86400000).toISOString(),
          error_jobs: 3,
          intersectionFinderJobError: 1,
          intersectionFinderJobSucesss: 10,
          intersectionFinderJobs: 12,
          intersectionProcessedVehicles: 10,
          job_count: 50,
          mapMatchedJobError: 2,
          mapMatchedJobSuccesfull: 43,
          mapMatchedJobs: 45,
          mapMatchedVehicles: 15,
          marketplace: "Samsara",
          nonTollRoadJobs: 10,
          refresh_token: "token123",
          request_type: "full",
          start_time: new Date().toISOString(),
          status: "in-progress",
          tollGpsFilteredVehicles: 25,
          tollRoadJobs: 40,
          tripCreatedVehicles: 22,
          tripFetchJobs: 38,
          trip_strategy: "Standard",
          updated_at: new Date().toISOString(),
          user_id: "user123",
          vehicle_id: "fleet1"
        }
      ];
      
      setFleets(mockFleets);
      setJobs(mockJobs);
      setProcessingData(mockProcessingData);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const totalVehicles = fleets.reduce((sum, fleet) => sum + fleet.vehicles, 0);
  const totalActiveVehicles = fleets.reduce((sum, fleet) => sum + fleet.activeVehicles, 0);
  const totalDrivers = fleets.reduce((sum, fleet) => sum + fleet.drivers, 0);
  
  // Vehicle status data for chart
  const vehicleStatusData = [
    { name: "Active", value: totalActiveVehicles, color: "#22c55e" },
    { name: "Inactive", value: totalVehicles - totalActiveVehicles, color: "#f59e0b" }
  ];
  
  return (
    <MainLayout title="Dashboard" subtitle="Overview of your fleet and processing status">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard 
          title="Total Vehicles" 
          value={totalVehicles} 
          description={`${totalActiveVehicles} active`}
          icon={<Truck className="h-4 w-4" />}
          trend={{ 
            value: 5.2, 
            positive: true
          }}
        />
        <StatCard 
          title="Total Drivers" 
          value={totalDrivers} 
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard 
          title="Processing Jobs" 
          value={12} 
          description="3 completed today"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          trend={{ 
            value: 2.1, 
            positive: false
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <VehicleStatusChart data={vehicleStatusData} className="lg:col-span-2 h-[280px]" />
        <FleetOverview fleets={fleets.slice(0, 2)} className="lg:col-span-1" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ProcessingSteps data={processingData} className="lg:col-span-1" />
        <div className="lg:col-span-2 space-y-4">
          <JobStats jobs={jobs} />
          <RecentJobs jobs={jobs} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
