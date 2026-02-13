
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Car, Truck, Info, ArrowLeft } from "lucide-react";

interface Vehicle {
  vehicle_id: string;
  number: string;
  company_id: string;
  user_id: string;
  status: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  license_plate_state: string;
  license_plate_number: string;
  vehicle_type: string;
  fuel_type: string;
  height: number;
  weight: number;
  length: number;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

const VehicleList = () => {
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterVehicleType, setFilterVehicleType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  
  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fleetId = queryParams.get('fleetId');
  const companyId = queryParams.get('companyId');

  // Mock pagination data
  const pagination: PaginationData = {
    limit: 20,
    page: 1,
    pages: 4215,
    total: 84300
  };
  
  // Mock vehicle data with matching IDs to connect with fleets and jobs
  const vehicles: Vehicle[] = [
    {
      vehicle_id: "663a461c15dad2afba6f3520",
      number: "demo_vehicle_1588635036",
      company_id: "149727", // Matches MapUp Transport's company ID
      user_id: "660acb78ff1993be2a8cb528", // Matches MapUp Transport's user ID
      status: "active",
      vin: "DEMO0123456789012",
      make: "Kenworth",
      model: "T300",
      year: "2016",
      license_plate_state: "CA",
      license_plate_number: "DEMO862",
      vehicle_type: "2AxlesTruck",
      fuel_type: "diesel",
      height: 13,
      weight: 20000,
      length: 25,
      created_at: "0001-01-01T00:00:00Z",
      updated_at: "0001-01-01T00:00:00Z"
    },
    {
      vehicle_id: "663a461c15dad2afba6f3542",
      number: "demo_vehicle_1588635045",
      company_id: "149727", // Matches MapUp Transport's company ID
      user_id: "660acb78ff1993be2a8cb528", // Matches MapUp Transport's user ID
      status: "active",
      vin: "DEMO0123456789012",
      make: "Peterbilt",
      model: "",
      year: "2011",
      license_plate_state: "CA",
      license_plate_number: "DEMO753",
      vehicle_type: "2AxlesTruck",
      fuel_type: "diesel",
      height: 13,
      weight: 20000,
      length: 25,
      created_at: "0001-01-01T00:00:00Z",
      updated_at: "0001-01-01T00:00:00Z"
    },
    {
      vehicle_id: "281474977426146", // Matching vehicle ID from jobs
      number: "demo_vehicle_1588635031",
      company_id: "149727", // Matches MapUp Transport's company ID
      user_id: "660acb78ff1993be2a8cb528", // Matches MapUp Transport's user ID
      status: "active",
      vin: "DEMO0123456789012",
      make: "Freightliner",
      model: "Cascadia",
      year: "2015",
      license_plate_state: "CA",
      license_plate_number: "DEMO456",
      vehicle_type: "5AxlesTruck", // Changed to match jobs' vehicle type
      fuel_type: "diesel",
      height: 13,
      weight: 20000,
      length: 25,
      created_at: "0001-01-01T00:00:00Z",
      updated_at: "0001-01-01T00:00:00Z"
    }
  ];

  // Filter vehicles when fleetId or companyId change
  useEffect(() => {
    let filtered = [...vehicles];
    
    // Apply company ID filtering (from fleet)
    if (companyId && companyId !== 'all') {
      filtered = filtered.filter(v => v.company_id === companyId);
    }
    
    // Apply other filters
    if (filterCompany !== "all") {
      filtered = filtered.filter(v => v.company_id === filterCompany);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(v => v.status === filterStatus);
    }
    
    if (filterVehicleType !== "all") {
      filtered = filtered.filter(v => v.vehicle_type === filterVehicleType);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredVehicles(filtered);
  }, [companyId, filterCompany, filterStatus, filterVehicleType, searchTerm, vehicles]);

  // Navigate to jobs with vehicle ID filter
  const handleViewJobs = (vehicleId: string) => {
    navigate(`/jobs?vehicleId=${vehicleId}`);
  };

  // Go back to fleets
  const handleBackToFleets = () => {
    navigate('/fleets');
  };
  
  // Company data for filter dropdown
  const companies = [...new Set(vehicles.map(vehicle => vehicle.company_id))];
  
  // Vehicle types for filter dropdown
  const vehicleTypes = [...new Set(vehicles.map(vehicle => vehicle.vehicle_type))];
  
  const statusStyles = {
    "active": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "inactive": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "maintenance": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  };

  const getVehicleIcon = (vehicleType: string) => {
    if (vehicleType.includes("Truck")) {
      return <Truck className="h-4 w-4" />;
    }
    return <Car className="h-4 w-4" />;
  };

  // Generate title based on whether we're viewing all vehicles or a specific fleet's vehicles
  const pageTitle = fleetId ? "Fleet Vehicles" : "Vehicles";
  const pageSubtitle = fleetId ? "Manage vehicles for this fleet" : "Manage your vehicle fleet";

  return (
    <MainLayout title={pageTitle} subtitle={pageSubtitle}>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {fleetId && (
          <Button 
            variant="outline" 
            className="mb-4 sm:mb-0" 
            onClick={handleBackToFleets}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Fleets
          </Button>
        )}
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by make, model, VIN, or license plate"
            className="bg-background border-border/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>Company {company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterVehicleType} onValueChange={setFilterVehicleType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vehicleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredVehicles.length} of {pagination.total} vehicles
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.vehicle_id}>
                <TableCell className="font-medium">{vehicle.number}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 mr-2 rounded bg-primary/10 text-primary flex items-center justify-center">
                      {getVehicleIcon(vehicle.vehicle_type)}
                    </div>
                    <div>
                      <div className="font-medium">{vehicle.make}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.model || "N/A"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{vehicle.vehicle_type}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{vehicle.vin}</span>
                </TableCell>
                <TableCell>
                  {vehicle.license_plate_state}-{vehicle.license_plate_number}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[vehicle.status] || ""}>
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                      {vehicle.weight / 1000}k lbs
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                      {vehicle.length}ft
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                      {vehicle.fuel_type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewJobs(vehicle.vehicle_id)}
                    >
                      View Jobs
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </MainLayout>
  );
};

export default VehicleList;
