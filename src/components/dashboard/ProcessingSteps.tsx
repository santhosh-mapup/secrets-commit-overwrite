
import { Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProcessingStepData {
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

interface ProcessingStepsProps {
  data?: ProcessingStepData[];
  className?: string;
}

export function ProcessingSteps({ data, className }: ProcessingStepsProps) {
  // If no data is provided, return a placeholder
  if (!data || data.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Fleet Processing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No processing data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use the first data point for the steps visualization
  const processData = data[0];

  // Define the processing steps
  const processingSteps = [
    {
      name: "GPS Fetch Producer",
      total: processData.job_count,
      completed: processData.done_jobs,
      errors: processData.error_jobs,
      description: "Initial GPS data gathering from vehicles"
    },
    {
      name: "GPS Fetch Consumer",
      total: processData.job_count,
      completed: processData.done_jobs,
      errors: processData.error_jobs,
      description: "Processing collected GPS data"
    },
    {
      name: "Toll GPS Filter",
      total: processData.job_count,
      completed: processData.tollRoadJobs + processData.nonTollRoadJobs,
      errors: 0,
      vehicles: processData.tollGpsFilteredVehicles,
      description: "Filtering GPS data for toll roads"
    },
    {
      name: "Trip Creator",
      total: processData.tollRoadJobs,
      completed: processData.tripFetchJobs,
      errors: 0,
      vehicles: processData.tripCreatedVehicles,
      description: "Creating trips from filtered GPS data"
    },
    {
      name: "Map Matcher",
      total: processData.mapMatchedJobs,
      completed: processData.mapMatchedJobSuccesfull,
      errors: processData.mapMatchedJobError,
      vehicles: processData.mapMatchedVehicles,
      description: "Matching GPS coordinates to road network"
    },
    {
      name: "Intersection Finder",
      total: processData.intersectionFinderJobs,
      completed: processData.intersectionFinderJobSucesss,
      errors: processData.intersectionFinderJobError,
      vehicles: processData.intersectionProcessedVehicles,
      description: "Finding road intersections for toll calculations"
    },
    {
      name: "Map Match Analyzer",
      total: processData.mapMatchedJobs,
      completed: processData.mapMatchedJobSuccesfull,
      errors: processData.mapMatchedJobError,
      description: "Analyzing map matching quality"
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Fleet Processing Pipeline</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
              {processData.marketplace}
            </Badge>
            <Badge variant="outline" className={
              processData.status === "complete" 
                ? "bg-green-500/10 text-green-500" 
                : "bg-yellow-500/10 text-yellow-500"
            }>
              {processData.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">From:</span> {new Date(processData.start_time).toLocaleDateString()} 
            <span className="mx-2">•</span>
            <span className="font-medium">To:</span> {new Date(processData.end_time).toLocaleDateString()}
          </div>
          
          <div className="space-y-4">
            {processingSteps.map((step, index) => {
              const completionPercentage = step.total > 0 ? Math.round((step.completed / step.total) * 100) : 0;
              const errorPercentage = step.total > 0 ? Math.round((step.errors / step.total) * 100) : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{step.name}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                    {step.vehicles && (
                      <div className="text-xs bg-primary/5 px-2 py-1 rounded-full">
                        {step.vehicles} vehicles
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center">
                        <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                        <span>Completed: {step.completed}/{step.total}</span>
                      </div>
                      <div className="flex items-center">
                        <X className="h-3.5 w-3.5 mr-1 text-red-500" />
                        <span>Errors: {step.errors}</span>
                      </div>
                      <span>{completionPercentage}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-grow">
                        <Progress 
                          value={completionPercentage} 
                          className="h-2" 
                        />
                      </div>
                      {errorPercentage > 0 && (
                        <div className="ml-1 h-2 rounded-full bg-red-500" style={{ width: `${errorPercentage * 0.2}%` }}></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
