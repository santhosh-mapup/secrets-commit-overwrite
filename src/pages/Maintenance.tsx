
import { Wrench, AlertTriangle, Clock, Calendar, CheckCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Maintenance = () => {
  // Sample maintenance data
  const maintenanceItems = [
    {
      id: "m001",
      vehicleId: "663a461c15dad2afba6f3520",
      vehicleName: "Kenworth T300",
      type: "Oil Change",
      status: "scheduled",
      scheduledDate: "2025-05-15",
      assignedTo: "John Mechanic"
    },
    {
      id: "m002",
      vehicleId: "663a461c15dad2afba6f3542",
      vehicleName: "Peterbilt 389",
      type: "Brake Inspection",
      status: "in-progress",
      scheduledDate: "2025-05-06",
      assignedTo: "Sarah Tech"
    },
    {
      id: "m003",
      vehicleId: "281474977426146",
      vehicleName: "Freightliner Cascadia",
      type: "Tire Replacement",
      status: "completed",
      scheduledDate: "2025-05-01",
      completedDate: "2025-05-02",
      assignedTo: "Mike Tires"
    },
    {
      id: "m004",
      vehicleId: "663a461c15dad2afba6f3520",
      vehicleName: "Kenworth T300",
      type: "Annual Inspection",
      status: "overdue",
      scheduledDate: "2025-04-20",
      assignedTo: "Inspection Team"
    }
  ];

  // Count of maintenance by status
  const scheduled = maintenanceItems.filter(item => item.status === "scheduled").length;
  const inProgress = maintenanceItems.filter(item => item.status === "in-progress").length;
  const completed = maintenanceItems.filter(item => item.status === "completed").length;
  const overdue = maintenanceItems.filter(item => item.status === "overdue").length;

  const statusColors = {
    scheduled: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "in-progress": "bg-primary/10 text-primary border-primary/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <MainLayout title="Maintenance" subtitle="Vehicle maintenance tracking and scheduling">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold">{scheduled}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{inProgress}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completed}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{overdue}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.vehicleName}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.scheduledDate}</TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Maintenance;
