
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleStatus {
  name: string;
  value: number;
  color: string;
}

interface VehicleStatusChartProps {
  data?: VehicleStatus[];
  className?: string;
}

export function VehicleStatusChart({ data = [
  { name: "Active", value: 38, color: "#22c55e" },
  { name: "Inactive", value: 12, color: "#f59e0b" },
  { name: "Maintenance", value: 8, color: "#3b82f6" },
  { name: "Unknown", value: 4, color: "#9ca3af" }
], className }: VehicleStatusChartProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: isMobile ? '200px' : '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={isMobile ? 40 : 60}
                outerRadius={isMobile ? 60 : 80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} vehicles`, name]}
                contentStyle={{ 
                  backgroundColor: 'rgb(34, 45, 58)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
