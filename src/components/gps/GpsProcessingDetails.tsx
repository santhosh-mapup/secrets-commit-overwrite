
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessingStepData } from "@/services/gpsProcessingService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Check, X, FileSearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GpsProcessingDetailsProps {
  data: ProcessingStepData;
}

export function GpsProcessingDetails({ data }: GpsProcessingDetailsProps) {
  // Define the processing steps and their associated data fields
  const processingSteps = [
    {
      name: "GPS Fetch Producer",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Job Count", value: data.job_count },
        { label: "Done Jobs", value: data.done_jobs },
        { label: "Error Jobs", value: data.error_jobs }
      ]
    },
    {
      name: "GPS Fetch Consumer",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Done Jobs", value: data.done_jobs },
        { label: "Error Jobs", value: data.error_jobs }
      ]
    },
    {
      name: "Toll GPS Filter",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Toll Road Jobs", value: data.tollRoadJobs },
        { label: "Non-Toll Road Jobs", value: data.nonTollRoadJobs },
        { label: "Filtered Vehicles", value: data.tollGpsFilteredVehicles }
      ]
    },
    {
      name: "Trip Creator",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Trip Fetch Jobs", value: data.tripFetchJobs },
        { label: "Trip Created Vehicles", value: data.tripCreatedVehicles }
      ]
    },
    {
      name: "Map Matcher",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Map Matched Jobs", value: data.mapMatchedJobs },
        { label: "Map Matched Success", value: data.mapMatchedJobSuccesfull },
        { label: "Map Matched Error", value: data.mapMatchedJobError },
        { label: "Map Matched Vehicles", value: data.mapMatchedVehicles }
      ]
    },
    {
      name: "Intersection Finder",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Intersection Finder Jobs", value: data.intersectionFinderJobs },
        { label: "Intersection Finder Success", value: data.intersectionFinderJobSucesss },
        { label: "Intersection Finder Error", value: data.intersectionFinderJobError },
        { label: "Intersection Processed Vehicles", value: data.intersectionProcessedVehicles }
      ]
    },
    {
      name: "Map Match Analyzer",
      icon: <FileSearchIcon className="h-4 w-4" />,
      fields: [
        { label: "Map Matched Jobs", value: data.mapMatchedJobs },
        { label: "Map Matched Success", value: data.mapMatchedJobSuccesfull },
        { label: "Map Matched Error", value: data.mapMatchedJobError }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">Processing Details</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
              {data.marketplace}
            </Badge>
            <Badge variant={data.status === "complete" ? "secondary" : "secondary"}>
              {data.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          <div>Processing ID: {data._id}</div>
          <div>
            <span className="font-medium">From:</span> {new Date(data.start_time).toLocaleString()} 
            <span className="mx-2">•</span>
            <span className="font-medium">To:</span> {new Date(data.end_time).toLocaleString()}
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {processingSteps.map((step, index) => {
            // Calculate completion metrics for each step
            let total = 0;
            let completed = 0;
            let errors = 0;
            
            switch (step.name) {
              case "GPS Fetch Producer":
              case "GPS Fetch Consumer":
                total = data.job_count;
                completed = data.done_jobs;
                errors = data.error_jobs;
                break;
              case "Toll GPS Filter":
                total = data.job_count;
                completed = data.tollRoadJobs + data.nonTollRoadJobs;
                errors = 0;
                break;
              case "Trip Creator":
                total = data.tollRoadJobs;
                completed = data.tripFetchJobs;
                errors = 0;
                break;
              case "Map Matcher":
                total = data.mapMatchedJobs;
                completed = data.mapMatchedJobSuccesfull;
                errors = data.mapMatchedJobError;
                break;
              case "Intersection Finder":
                total = data.intersectionFinderJobs;
                completed = data.intersectionFinderJobSucesss;
                errors = data.intersectionFinderJobError;
                break;
              case "Map Match Analyzer":
                total = data.mapMatchedJobs;
                completed = data.mapMatchedJobSuccesfull;
                errors = data.mapMatchedJobError;
                break;
            }
            
            const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const errorPercentage = total > 0 ? Math.round((errors / total) * 100) : 0;
            
            return (
              <AccordionItem key={index} value={`step-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center text-left">
                    <div className="mr-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{step.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {completed}/{total} completed
                        {errors > 0 && ` • ${errors} errors`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-auto mr-6">
                    <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs">{completionPercentage}%</span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Progress</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center">
                            <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                            <span>Completed: {completed}/{total}</span>
                          </div>
                          <div className="flex items-center">
                            <X className="h-3.5 w-3.5 mr-1 text-red-500" />
                            <span>Errors: {errors}</span>
                          </div>
                          <span>{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Metrics</div>
                      <div className="grid grid-cols-2 gap-2">
                        {step.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="bg-accent/50 p-2 rounded-md">
                            <div className="text-xs text-muted-foreground">{field.label}</div>
                            <div className="font-medium">{field.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
