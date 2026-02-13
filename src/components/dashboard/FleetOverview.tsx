
import { Database, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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
  activeDrivers: number;
}

interface FleetOverviewProps {
  fleets: Fleet[];
  className?: string;
}

export function FleetOverview({ fleets, className }: FleetOverviewProps) {
  const navigate = useNavigate();
  
  const getApplicationBadgeStyle = (type: string) => {
    if (type === "samsara") {
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    } else {
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    }
  };

  const handleFleetClick = (fleetId: string) => {
    navigate(`/fleet-details?id=${fleetId}`);
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2 pt-3">
        <CardTitle className="text-md font-medium">Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {fleets.map((fleet) => (
            <div 
              key={fleet.id} 
              className="space-y-1.5 hover:bg-muted/50 p-2 rounded-md cursor-pointer transition-colors"
              onClick={() => handleFleetClick(fleet.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-xs">{fleet.company_name || fleet.email}</span>
                  <Badge variant="outline" className={`${getApplicationBadgeStyle(fleet.application_type)} text-xs py-0 px-1.5`}>
                    {fleet.application_type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {fleet.vehicles} vehicles
                </span>
              </div>
              <div className="flex items-center">
                <div className="p-1 rounded bg-primary/10 mr-1.5">
                  <Database className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs">{fleet.email}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-1.5">
                <Button 
                  className="w-full text-xs" 
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/fleet-details?id=${fleet.id}&tab=gps`);
                  }}
                >
                  GPS
                </Button>
                <Button 
                  className="w-full text-xs" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/fleet-details?id=${fleet.id}&tab=vehicles`);
                  }}
                >
                  <Car className="mr-1 h-3 w-3" />
                  Vehicles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
