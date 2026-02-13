
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Car, Clock, Database, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data interfaces
interface Vehicle {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  type: string;
  last_updated: string;
}

interface GpsProcessingJob {
  id: string;
  status: "completed" | "in-progress" | "scheduled" | "cancelled";
  start_time: string;
  end_time: string;
  vehicle_count: number;
}

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
}

const FleetDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [gpsJobs, setGpsJobs] = useState<GpsProcessingJob[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("gps");
  
  // Get the fleet ID from URL params
  const searchParams = new URLSearchParams(location.search);
  const fleetId = searchParams.get("id");
  
  useEffect(() => {
    if (!fleetId) {
      navigate("/fleets");
      return;
    }
    
    // In a real app, fetch data from API
    // For now, using mock data
    const mockFleets: Fleet[] = [
      {
        id: "669027989755fcf4ecf6ce11",
        user_id: "14674542010192980000",
        application_type: "samsara",
        email: "garrys@longviewlogistics.ca",
        company_name: "Longview Logistics",
        meta: {
          dot_number: 2884286,
          motive_companies: [],
          samsara_org_id: ""
        },
        last_sync: 1723800649435,
        vehicles: 45,
        activeVehicles: 38,
        drivers: 42
      },
      {
        id: "663a5904f8b7d5a516cc0e50",
        user_id: "663a590415dad2afba70943d",
        application_type: "motive",
        email: "tom.craig@chhj.com",
        company_name: "CHHJ Transport",
        meta: {
          dot_number: 0,
          motive_companies: ["400307"],
          samsara_org_id: ""
        },
        last_sync: 1722936647812,
        vehicles: 32,
        activeVehicles: 26,
        drivers: 30
      }
    ];
    
    const mockGpsJobs: GpsProcessingJob[] = [
      {
        id: "job123",
        status: "completed",
        start_time: "2025-05-10T10:00:00",
        end_time: "2025-05-10T12:00:00",
        vehicle_count: 28
      },
      {
        id: "job124",
        status: "in-progress",
        start_time: "2025-05-11T09:00:00",
        end_time: "2025-05-11T11:00:00",
        vehicle_count: 15
      },
      {
        id: "job125",
        status: "scheduled",
        start_time: "2025-05-12T14:00:00",
        end_time: "2025-05-12T16:00:00",
        vehicle_count: 32
      }
    ];
    
    const mockVehicles: Vehicle[] = [
      {
        id: "v1",
        name: "Truck 101",
        status: "active",
        type: "Semi-Truck",
        last_updated: "2025-05-12T08:23:15"
      },
      {
        id: "v2",
        name: "Truck 102",
        status: "inactive",
        type: "Semi-Truck",
        last_updated: "2025-05-11T19:45:22"
      },
      {
        id: "v3",
        name: "Van 201",
        status: "active",
        type: "Delivery Van",
        last_updated: "2025-05-12T10:12:05"
      },
      {
        id: "v4",
        name: "Truck 103",
        status: "maintenance",
        type: "Semi-Truck",
        last_updated: "2025-05-10T14:33:45"
      },
      {
        id: "v5",
        name: "Van 202",
        status: "active",
        type: "Delivery Van",
        last_updated: "2025-05-12T07:55:30"
      }
    ];
    
    // Find the fleet
    const foundFleet = mockFleets.find(f => f.id === fleetId);
    
    if (foundFleet) {
      setFleet(foundFleet);
      setGpsJobs(mockGpsJobs);
      setVehicles(mockVehicles);
    } else {
      navigate("/fleets");
    }
    
    setLoading(false);
  }, [fleetId, navigate]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "inactive":
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "maintenance":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleViewGpsDetails = (jobId: string) => {
    navigate(`/gps-processing?jobId=${jobId}`);
  };

  const handleViewVehicleDetails = (vehicleId: string) => {
    navigate(`/vehicles?id=${vehicleId}`);
  };

  if (loading || !fleet) {
    return (
      <MainLayout title="Fleet Details" subtitle="Loading...">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading fleet details...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={fleet.company_name} 
      subtitle={`Fleet details and processing information`}
    >
      <div className="mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/fleets")}
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Fleets
        </Button>
      </div>
      
      {/* Fleet Overview Card */}
      <Card className="mb-4">
        <CardHeader className="p-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Fleet Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Fleet Email</p>
              <p className="font-medium text-sm">{fleet.email}</p>
              <Badge variant="outline" className="mt-1 text-xs py-0">
                {fleet.application_type}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Vehicles</p>
              <p className="text-lg font-bold">{fleet.vehicles}</p>
              <p className="text-xs text-muted-foreground">
                {fleet.activeVehicles} active
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Meta</p>
              {fleet.meta.dot_number > 0 && (
                <p className="text-xs">DOT: {fleet.meta.dot_number}</p>
              )}
              {fleet.meta.motive_companies.length > 0 && (
                <p className="text-xs">Motive ID: {fleet.meta.motive_companies.join(', ')}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for GPS and Vehicles */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="gps" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> GPS Processing
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-1">
            <Car className="h-4 w-4" /> Vehicles
          </TabsTrigger>
        </TabsList>
        
        {/* GPS Content */}
        <TabsContent value="gps" className="mt-0">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-lg font-medium">GPS Processing Jobs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Period</TableHead>
                    <TableHead>Vehicles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gpsJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No GPS processing jobs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    gpsJobs.map((job) => (
                      <TableRow 
                        key={job.id} 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => handleViewGpsDetails(job.id)}
                      >
                        <TableCell className="font-medium">{job.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeStyle(job.status)}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-xs">
                              {formatDate(job.start_time)} - {formatDate(job.end_time)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{job.vehicle_count}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="p-3 flex justify-end">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/gps-processing?fleetId=${fleet.id}`)}
                >
                  View All GPS Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vehicles Content */}
        <TabsContent value="vehicles" className="mt-0">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-lg font-medium">Fleet Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No vehicles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vehicles.map((vehicle) => (
                      <TableRow 
                        key={vehicle.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewVehicleDetails(vehicle.id)}
                      >
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeStyle(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-xs">
                              {formatDate(vehicle.last_updated)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="p-3 flex justify-end">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/vehicles?fleetId=${fleet.id}`)}
                >
                  View All Vehicles
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default FleetDetails;
