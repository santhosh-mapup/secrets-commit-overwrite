
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessingStepData } from "@/services/gpsProcessingService";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "lucide-react";

interface GpsProcessingTimelineProps {
  data: ProcessingStepData[];
  onSelectItem: (id: string) => void;
  selectedItemId: string | null;
}

export function GpsProcessingTimeline({ data, onSelectItem, selectedItemId }: GpsProcessingTimelineProps) {
  // Sort data by start_time
  const sortedData = [...data].sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Processing Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mt-4">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {sortedData.map((item) => {
              const startDate = new Date(item.start_time);
              const endDate = new Date(item.end_time);
              const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={item._id}
                  className={`relative pl-8 cursor-pointer ${
                    selectedItemId === item._id ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                  }`}
                  onClick={() => onSelectItem(item._id)}
                >
                  {/* Timeline node */}
                  <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                    selectedItemId === item._id 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-card border-border'
                  }`}>
                    <LineChart className="h-4 w-4" />
                  </div>
                  
                  {/* Content */}
                  <div className={`bg-card p-4 rounded-lg border ${
                    selectedItemId === item._id ? 'border-primary shadow-md' : 'border-border'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          {item.marketplace}
                        </Badge>
                        <Badge variant={item.status === "complete" ? "secondary" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {duration} day{duration !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <div className="mb-1">
                        <span className="font-medium">Started:</span>{' '}
                        {startDate.toLocaleDateString()}{' '}
                        <span className="text-xs text-muted-foreground">
                          ({startDate.toLocaleTimeString()})
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Ended:</span>{' '}
                        {endDate.toLocaleDateString()}{' '}
                        <span className="text-xs text-muted-foreground">
                          ({endDate.toLocaleTimeString()})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <div>
                        <span className="font-medium">Jobs:</span>{' '}
                        {item.done_jobs}/{item.job_count}{' '}
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((item.done_jobs / item.job_count) * 100)}% complete)
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Vehicles:</span>{' '}
                        <span className="text-muted-foreground">{item.mapMatchedVehicles}</span>
                      </div>
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
