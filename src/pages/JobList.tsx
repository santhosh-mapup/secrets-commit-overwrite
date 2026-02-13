
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Clock, Filter, MapPin, Tag, TrendingUp, Truck, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface JobVehicle {
  height: number;
  length: number;
  vehicle_id: string;
  vehicle_type: string;
  weight: number;
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
  vehicle: JobVehicle;
  vehicle_count: number;
  vehicle_id: string;
  database_id?: string;
  is_last?: boolean;
  process_id?: string;
  rate_limit?: number;
  refresh_token?: string;
  request_id?: string;
  request_type?: string;
  session_id?: string;
  user_id?: string;
  user_name?: string;
}

const JobList = () => {
  const [filterMarketplace, setFilterMarketplace] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicleId = queryParams.get('vehicleId');

  // Sample job data with vehicle IDs that match our vehicle data
  const jobs: Job[] = [
    // Jobs for Kenworth T300 (vehicle_id: "663a461c15dad2afba6f3520")
    {
      _id: "67f5446e63143e64f46d089b",
      job_id: "f640d6d6-08c6-4e97-8f69-8174a13e9e8e",
      marketplace: "samsara",
      created_at: "2025-04-08T15:43:20.801Z",
      start_time: "2025-01-11T00:00:00Z",
      end_time: "2025-01-11T23:59:59.999Z",
      status: "completed",
      trip_strategy: "tollguru",
      vehicle: {
        height: 13,
        length: 25,
        vehicle_id: "663a461c15dad2afba6f3520",
        vehicle_type: "2AxlesTruck",
        weight: 20000
      },
      vehicle_count: 1,
      vehicle_id: "663a461c15dad2afba6f3520",
      user_id: "660acb78ff1993be2a8cb528"
    },
    {
      _id: "67f5446e63143e64f46d0898",
      job_id: "59a8cff5-42cb-48ae-a365-4a87c27b5870",
      marketplace: "samsara",
      created_at: "2025-04-07T15:43:20.801Z",
      start_time: "2025-01-08T00:00:00Z",
      end_time: "2025-01-08T23:59:59.999Z",
      status: "in-progress",
      trip_strategy: "tollguru",
      vehicle: {
        height: 13,
        length: 25,
        vehicle_id: "663a461c15dad2afba6f3520",
        vehicle_type: "2AxlesTruck",
        weight: 20000
      },
      vehicle_count: 1,
      vehicle_id: "663a461c15dad2afba6f3520",
      user_id: "660acb78ff1993be2a8cb528"
    },

    // Jobs for Peterbilt (vehicle_id: "663a461c15dad2afba6f3542")
    {
      _id: "67f5446e63143e64f46d089a",
      job_id: "f46d0b69-85d8-466e-8b1f-2298e0993dee",
      marketplace: "samsara",
      created_at: "2025-04-06T15:43:20.801Z",
      start_time: "2025-01-10T00:00:00Z",
      end_time: "2025-01-10T23:59:59.999Z",
      status: "scheduled",
      trip_strategy: "tollguru",
      vehicle: {
        height: 13,
        length: 25,
        vehicle_id: "663a461c15dad2afba6f3542",
        vehicle_type: "2AxlesTruck",
        weight: 20000
      },
      vehicle_count: 1,
      vehicle_id: "663a461c15dad2afba6f3542",
      user_id: "660acb78ff1993be2a8cb528"
    },

    // Jobs for Freightliner Cascadia (vehicle_id: "281474977426146")
    {
      _id: "67f5446e63143e64f46d089e",
      job_id: "8582a335-ceb4-4c47-98ec-ab520ab16e5d",
      marketplace: "samsara",
      created_at: "2025-04-05T15:43:20.801Z",
      start_time: "2025-01-14T00:00:00Z",
      end_time: "2025-01-14T23:59:59.999Z",
      status: "completed",
      trip_strategy: "tollguru",
      vehicle: {
        height: 13,
        length: 25,
        vehicle_id: "281474977426146",
        vehicle_type: "5AxlesTruck",
        weight: 20000
      },
      vehicle_count: 1,
      vehicle_id: "281474977426146",
      user_id: "660acb78ff1993be2a8cb528"
    },
    {
      _id: "67f5446e63143e64f46d0894",
      job_id: "e8706dc0-560a-4b92-a75b-83cb56af20e1",
      marketplace: "samsara",
      created_at: "2025-04-03T15:43:20.801Z",
      start_time: "2025-01-04T00:00:00Z",
      end_time: "2025-01-04T23:59:59.999Z",
      status: "cancelled",
      trip_strategy: "tollguru",
      vehicle: {
        height: 13,
        length: 25,
        vehicle_id: "281474977426146",
        vehicle_type: "5AxlesTruck",
        weight: 20000
      },
      vehicle_count: 1,
      vehicle_id: "281474977426146",
      user_id: "660acb78ff1993be2a8cb528"
    }
  ];

  // Filter jobs when filters change or vehicleId changes
  useEffect(() => {
    let filtered = [...jobs];

    // Apply vehicle ID filtering (from URL)
    if (vehicleId) {
      filtered = filtered.filter(job => job.vehicle_id === vehicleId);
    }

    // Apply marketplace filter
    if (filterMarketplace !== "all") {
      filtered = filtered.filter(job => job.marketplace === filterMarketplace);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(job => job.status === filterStatus);
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        (job.job_id && job.job_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.marketplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.trip_strategy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [vehicleId, filterMarketplace, filterStatus, searchTerm, jobs]);

  // Get unique marketplaces
  const marketplaces = [...new Set(jobs.map(job => job.marketplace))];

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Go back to vehicles
  const handleBackToVehicles = () => {
    navigate('/vehicles');
  };

  const statusStyles = {
    "completed": "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-primary/10 text-primary border-primary/20",
    "scheduled": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "cancelled": "bg-red-500/10 text-red-500 border-red-500/20",
  };

  // Generate title based on whether we're viewing all jobs or a specific vehicle's jobs
  const pageTitle = vehicleId ? "Vehicle Jobs" : "Jobs";
  const pageSubtitle = vehicleId ? "Manage and track jobs for this vehicle" : "Manage and track vehicle jobs";

  return (
    <MainLayout title={pageTitle} subtitle={pageSubtitle}>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {vehicleId && (
          <Button
            variant="outline"
            className="mb-4 sm:mb-0"
            onClick={handleBackToVehicles}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vehicles
          </Button>
        )}
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search jobs..."
            className="bg-background border-border/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <Select value={filterMarketplace} onValueChange={setFilterMarketplace}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Marketplace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Marketplaces</SelectItem>
                {marketplaces.map(marketplace => (
                  <SelectItem key={marketplace} value={marketplace}>{marketplace}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job._id} className="overflow-hidden">
            <div className={`h-1 ${job.status === "completed" ? "bg-green-500" :
              job.status === "in-progress" ? "bg-primary" :
                job.status === "scheduled" ? "bg-yellow-500" :
                  "bg-red-500"
              }`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg text-primary">
                  Job #{job.job_id ? job.job_id.substring(0, 8) : "Unknown"}
                </CardTitle>
                <Badge variant="outline" className={statusStyles[job.status]}>
                  {job.status.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{job.marketplace}</Badge>
                <Badge variant="outline" className="text-xs">{job.trip_strategy}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-muted-foreground mr-2">Vehicle Type:</span>
                  <span>{job.vehicle.vehicle_type}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-muted-foreground mr-2">Period:</span>
                  <span>{formatDate(job.start_time)} - {formatDate(job.end_time)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-muted-foreground mr-2">Created:</span>
                  <span>{formatDate(job.created_at)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="w-full">Details</Button>
                <Button className="w-full">{
                  job.status === "scheduled" ? "Start Job" :
                    job.status === "in-progress" ? "Complete" :
                      "View Report"
                }</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default JobList;
