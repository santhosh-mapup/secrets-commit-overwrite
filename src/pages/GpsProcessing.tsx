
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProcessingData } from "@/services/gpsProcessingService";
import { MainLayout } from "@/components/layout/MainLayout";
import { GpsProcessingList } from "@/components/gps/GpsProcessingList";
import { GpsProcessingTimeline } from "@/components/gps/GpsProcessingTimeline";
import { GpsProcessingDetails } from "@/components/gps/GpsProcessingDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const GpsProcessing = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const { data: processingData, isLoading, error } = useQuery({
    queryKey: ['processing-data'],
    queryFn: fetchProcessingData
  });

  // Sort and filter data based on user selections
  const filteredAndSortedData = processingData ? 
    processingData
      .filter(item => {
        const itemDate = new Date(item.start_time);
        
        // Apply start date filter if set
        if (startDate && itemDate < startDate) {
          return false;
        }
        
        // Apply end date filter if set
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (itemDate > endOfDay) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_time);
        const dateB = new Date(b.start_time);
        
        // Sort by date, newest or oldest first based on sortOrder
        return sortOrder === "newest" 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime();
      }) 
    : [];

  const selectedItem = processingData?.find(item => item._id === selectedItemId) || null;
  
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    setIsDetailsOpen(true);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <MainLayout title="GPS Processing History" subtitle="Track GPS data processing pipeline">
      <div className="space-y-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] pl-3 text-left font-normal">
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Start date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate || undefined}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] pl-3 text-left font-normal">
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span className="text-muted-foreground">End date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate || undefined}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearFilters}
                    title="Clear filters"
                  >
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Loading processing history...
              </Card>
            ) : error ? (
              <Card className="p-8 text-center text-destructive">
                Error loading processing data
              </Card>
            ) : filteredAndSortedData.length > 0 ? (
              <GpsProcessingList 
                data={filteredAndSortedData}
                onSelectItem={handleSelectItem}
                selectedItemId={selectedItemId}
              />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                {processingData && processingData.length > 0 ? 
                  'No results match your filters' : 
                  'No processing history available'}
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            {isLoading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Loading timeline data...
              </Card>
            ) : error ? (
              <Card className="p-8 text-center text-destructive">
                Error loading timeline data
              </Card>
            ) : processingData && processingData.length > 0 ? (
              <GpsProcessingTimeline 
                data={processingData}
                onSelectItem={handleSelectItem}
                selectedItemId={selectedItemId}
              />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No timeline data available
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedItem && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Processing Details</DialogTitle>
              </DialogHeader>
              <GpsProcessingDetails data={selectedItem} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default GpsProcessing;
