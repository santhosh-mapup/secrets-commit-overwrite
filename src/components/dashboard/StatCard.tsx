
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 pt-4">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="text-lg sm:text-xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p className={cn(
            "text-xs mt-0.5 flex items-center",
            trend.positive ? "text-green-500" : "text-red-500"
          )}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            <span className="ml-1 text-muted-foreground hidden sm:inline">from last week</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
