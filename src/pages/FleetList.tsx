import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, LayoutGrid, LayoutList, FileText, Database } from "lucide-react";

interface FleetAuthentication {
  auth_created_at: number;
  expires_in: number;
  scope?: string;
  token_type: string;
  auth_id: string;
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
  account_id: string;
  company_name: string;
  meta: FleetMeta;
  authentication: FleetAuthentication;
  connected_sessions: any[];
  version: number;
  last_sync: number;
  // Additional fields for UI display
  vehicles?: number;
  activeVehicles?: number;
  drivers?: number;
}

const FleetList = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();
  
  // Mock fleet data with enhanced structure and matching company_ids for vehicles
  const fleets: Fleet[] = [
    {
      id: "669027989755fcf4ecf6ce11",
      user_id: "14674542010192980000",
      application_type: "samsara",
      email: "garrys@longviewlogistics.ca",
      account_id: "",
      company_name: "Longview Logistics",
      meta: {
        dot_number: 2884286,
        motive_companies: [],
        samsara_org_id: ""
      },
      authentication: {
        auth_created_at: 1720723052,
        expires_in: 3153600000,
        token_type: "Bearer",
        auth_id: "669027989755fcf4ecf6ce12"
      },
      connected_sessions: [],
      version: 0,
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
      account_id: "",
      company_name: "CHHJ Transport",
      meta: {
        dot_number: 0,
        motive_companies: ["400307"],
        samsara_org_id: ""
      },
      authentication: {
        auth_created_at: 1723800646,
        expires_in: 7200,
        scope: "locations.vehicle_locations_single companies.read locations.asset_locations driving_periods.read vehicles.manage assets.read",
        token_type: "Bearer",
        auth_id: "663a5904f8b7d5a516cc0e51"
      },
      connected_sessions: [],
      version: 0,
      last_sync: 1722936647812,
      vehicles: 32,
      activeVehicles: 26,
      drivers: 30
    },
    {
      id: "660acb78ff1993be2a8cb528", // This ID matches the user_id in vehicles
      user_id: "660acb78ff1993be2a8cb528",
      application_type: "motive",
      email: "parveenk@mapup.ai",
      account_id: "",
      company_name: "MapUp Transport",
      meta: {
        dot_number: 0,
        motive_companies: ["149727"], // This matches company_id in vehicles
        samsara_org_id: ""
      },
      authentication: {
        auth_created_at: 1723800650,
        expires_in: 7200,
        scope: "locations.vehicle_locations_single companies.read locations.asset_locations driving_periods.read vehicles.manage assets.read",
        token_type: "Bearer",
        auth_id: "66b612b013b744d3ead07030"
      },
      connected_sessions: [],
      version: 0,
      last_sync: 0,
      vehicles: 51,
      activeVehicles: 43,
      drivers: 48
    },
    {
      id: "66671cb5823cf756571d4948",
      user_id: "2046291827442318000",
      application_type: "samsara",
      email: "nhofbauer@calhountrucklines.com",
      account_id: "",
      company_name: "Calhoun Truck Lines",
      meta: {
        dot_number: 764739,
        motive_companies: [],
        samsara_org_id: ""
      },
      authentication: {
        auth_created_at: 1723800347,
        expires_in: 3599,
        scope: "admin:write",
        token_type: "bearer",
        auth_id: "66671cb5823cf756571d4949"
      },
      connected_sessions: [],
      version: 0,
      last_sync: 1723800646527,
      vehicles: 18,
      activeVehicles: 15,
      drivers: 20
    },
    {
      id: "6671e3f3a4b22fda3368a5e0",
      user_id: "424775047651574100",
      application_type: "samsara",
      email: "jalberti@jomaratrucking.com",
      account_id: "",
      company_name: "Jomara Trucking",
      meta: {
        dot_number: 3982523,
        motive_companies: [],
        samsara_org_id: ""
      },
      authentication: {
        auth_created_at: 1723800348,
        expires_in: 3599,
        scope: "admin:write",
        token_type: "bearer",
        auth_id: "6671e3f3a4b22fda3368a5e1"
      },
      connected_sessions: [],
      version: 0,
      last_sync: 1723800647467,
      vehicles: 24,
      activeVehicles: 20,
      drivers: 26
    }
  ];

  // Navigate to vehicles with fleet ID filter
  const handleViewVehicles = (fleetId: string, companyId: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("fleetId", fleetId);
    
    // If we have company ID from motive companies, also add it
    if (companyId) {
      queryParams.append("companyId", companyId);
    }
    
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  // Filter fleets based on search term and active tab
  const filteredFleets = fleets.filter((fleet) => {
    const matchesSearch = fleet.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         fleet.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "samsara") return matchesSearch && fleet.application_type === "samsara";
    if (activeTab === "motive") return matchesSearch && fleet.application_type === "motive";
    
    return matchesSearch;
  });

  // Calculate time since last sync
  const getTimeSinceLastSync = (timestamp: number): string => {
    if (timestamp === 0) return "Never";
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)} days ago`;
    }
  };

  // Get badge style based on application type
  const getApplicationBadgeStyle = (type: string) => {
    if (type === "samsara") {
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    } else {
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    }
  };

  // Grid layout - improved and more compact
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredFleets.map((fleet) => (
        <Card key={fleet.id} className="overflow-hidden">
          <div className={`h-1 ${fleet.application_type === 'samsara' ? 'bg-blue-500' : 'bg-amber-500'}`} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-primary">{fleet.company_name || "Unnamed Fleet"}</h3>
                <p className="text-xs text-muted-foreground">{fleet.email}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className={`${getApplicationBadgeStyle(fleet.application_type)} text-xs py-0`}>
                    {fleet.application_type}
                  </Badge>
                  {fleet.meta.dot_number > 0 && (
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs py-0">
                      DOT: {fleet.meta.dot_number}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Database className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="truncate">ID: {fleet.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{getTimeSinceLastSync(fleet.last_sync)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center py-1 px-1 bg-background rounded-md">
                <div className="text-sm font-bold">{fleet.vehicles}</div>
                <div className="text-[10px] text-muted-foreground">Vehicles</div>
              </div>
              <div className="text-center py-1 px-1 bg-background rounded-md">
                <div className="text-sm font-bold">{fleet.activeVehicles}</div>
                <div className="text-[10px] text-muted-foreground">Active</div>
              </div>
              <div className="text-center py-1 px-1 bg-background rounded-md">
                <div className="text-sm font-bold">{fleet.drivers}</div>
                <div className="text-[10px] text-muted-foreground">Drivers</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="w-full text-xs">Details</Button>
              <Button 
                size="sm" 
                className="w-full text-xs"
                onClick={() => handleViewVehicles(
                  fleet.id, 
                  fleet.meta.motive_companies.length > 0 ? fleet.meta.motive_companies[0] : ''
                )}
              >
                Vehicles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // List layout - more compact and cleaner
  const renderListView = () => (
    <Card>
      <div className="divide-y divide-border/20">
        {filteredFleets.map((fleet) => (
          <div key={fleet.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-medium text-sm text-primary">{fleet.company_name || "Unnamed Fleet"}</h3>
                  <Badge variant="outline" className={`${getApplicationBadgeStyle(fleet.application_type)} text-xs py-0 px-1`}>
                    {fleet.application_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{fleet.email}</p>
                <div className="flex gap-2 mt-0.5 text-[10px] text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    <span>Synced: {getTimeSinceLastSync(fleet.last_sync)}</span>
                  </div>
                  {fleet.meta.dot_number > 0 && (
                    <div className="flex items-center">
                      <FileText className="h-2.5 w-2.5 mr-0.5" />
                      <span>DOT: {fleet.meta.dot_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs font-medium">{fleet.vehicles}</div>
                <div className="text-[10px] text-muted-foreground">Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{fleet.activeVehicles}</div>
                <div className="text-[10px] text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{fleet.drivers}</div>
                <div className="text-[10px] text-muted-foreground">Drivers</div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs">Details</Button>
                <Button 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleViewVehicles(
                    fleet.id, 
                    fleet.meta.motive_companies.length > 0 ? fleet.meta.motive_companies[0] : ''
                  )}
                >
                  Vehicles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <MainLayout title="Fleets" subtitle="Manage your connected fleet platforms">
      <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search fleets..."
            className="bg-background border-border/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Tabs defaultValue="all" className="w-[300px]" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="samsara" className="text-xs">Samsara</TabsTrigger>
              <TabsTrigger value="motive" className="text-xs">Motive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex border rounded-md overflow-hidden border-border/20">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("grid")}
              className="rounded-none h-8 w-8"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("list")}
              className="rounded-none h-8 w-8"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? renderGridView() : renderListView()}
    </MainLayout>
  );
};

export default FleetList;
