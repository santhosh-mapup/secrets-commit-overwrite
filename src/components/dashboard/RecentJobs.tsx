import { Calendar, Clock, Car, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  access_token?: string;
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

interface RecentJobsProps {
  jobs?: Job[];
  className?: string;
}

const statusStyles = {
  "completed": "bg-green-500/10 text-green-500 border-green-500/20",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  "scheduled": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "cancelled": "bg-red-500/10 text-red-500 border-red-500/20",
};

export function RecentJobs({ jobs = [], className }: RecentJobsProps) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Navigate to view all jobs for a specific vehicle
  const handleViewVehicleJobs = (vehicleId: string) => {
    navigate(`/jobs?vehicleId=${vehicleId}`);
  };

  if (!jobs || jobs.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No jobs available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-border/20 pb-4 last:border-0 last:pb-0 gap-2">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">
                  Job #{job.job_id ? job.job_id.substring(0, 8) : "Unknown"}
                </h4>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2">
                    {job.marketplace}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {job.trip_strategy}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(job.start_time)} - {formatDate(job.end_time)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Car className="h-3.5 w-3.5 mr-1" />
                    {job.vehicle.vehicle_type}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge variant="outline" className={cn("font-normal mt-2 sm:mt-0 w-fit", statusStyles[job.status])}>
                  {job.status.replace('-', ' ')}
                </Badge>
                {job.vehicle_id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleViewVehicleJobs(job.vehicle_id)}
                  >
                    View all jobs
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
