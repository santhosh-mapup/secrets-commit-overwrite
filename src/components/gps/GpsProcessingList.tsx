
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessingStepData } from "@/services/gpsProcessingService";
import { Clock, FileText } from "lucide-react";

interface GpsProcessingListProps {
  data: ProcessingStepData[];
  onSelectItem: (id: string) => void;
  selectedItemId: string | null;
}

export function GpsProcessingList({ data, onSelectItem, selectedItemId }: GpsProcessingListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <FileText className="h-5 w-5" />
          GPS Processing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marketplace</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const completionPercentage = item.job_count > 0 
                ? Math.round((item.done_jobs / item.job_count) * 100) 
                : 0;
              
              return (
                <TableRow 
                  key={item._id}
                  className={`cursor-pointer ${selectedItemId === item._id ? 'bg-primary/10' : ''}`}
                  onClick={() => onSelectItem(item._id)}
                >
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                      {item.marketplace}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "complete" ? "secondary" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(item.start_time).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(item.end_time).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.done_jobs}/{item.job_count}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs">{completionPercentage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
