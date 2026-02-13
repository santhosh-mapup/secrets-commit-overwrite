
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Job {
  _id: string;
  job_id: string;
  status: "completed" | "in-progress" | "scheduled" | "cancelled";
  start_time: string;
  end_time: string;
}

interface JobStatsProps {
  jobs?: Job[];
}

export function JobStats({ jobs = [] }: JobStatsProps) {
  // Calculate job statistics
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const cancelledJobs = jobs.filter(job => job.status === "cancelled").length;
  
  // Calculate completion percentage
  const completionPercentage = totalJobs > 0 
    ? Math.round((completedJobs / totalJobs) * 100) 
    : 0;
  
  // Get today's jobs
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysJobs = jobs.filter(job => {
    const startDate = new Date(job.start_time);
    startDate.setHours(0, 0, 0, 0);
    return startDate.getTime() === today.getTime();
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Job Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Jobs</span>
                <span className="text-2xl font-bold">{totalJobs}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-2xl font-bold text-primary">{inProgressJobs}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="text-2xl font-bold text-yellow-500">{scheduledJobs}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-2xl font-bold text-green-500">{todaysJobs.length}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Job Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Completed</div>
                  <div className="text-xl font-bold">{completedJobs}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm font-medium">Cancelled</div>
                  <div className="text-xl font-bold">{cancelledJobs}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
