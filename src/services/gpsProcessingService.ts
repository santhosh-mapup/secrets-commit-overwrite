export interface ProcessingStepData {
  _id: string;
  done_jobs: number;
  end_time: string;
  error_jobs: number;
  intersectionFinderJobError: number;
  intersectionFinderJobSucesss: number;
  intersectionFinderJobs: number;
  intersectionProcessedVehicles: number;
  job_count: number;
  mapMatchedJobError: number;
  mapMatchedJobSuccesfull: number;
  mapMatchedJobs: number;
  mapMatchedVehicles: number;
  marketplace: string;
  nonTollRoadJobs: number;
  refresh_token: string;
  request_type: string;
  start_time: string;
  status: string;
  tollGpsFilteredVehicles: number;
  tollRoadJobs: number;
  tripCreatedVehicles: number;
  tripFetchJobs: number;
  trip_strategy: string;
  updated_at: string;
  user_id: string;
  vehicle_id: string;
}

// Utility function to normalize a value to a number
const normalizeToNumber = (val: number | any[]): number => {
  if (Array.isArray(val)) {
    return val.length;
  }
  return typeof val === "number" ? val : 0;
};

export const fetchProcessingData = async (): Promise<ProcessingStepData[]> => {
  try {
    const response = await fetch("http://localhost:9000/jobs/process-gps");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); 

    // Normalize the relevant fields
    return data.map((item: any) => ({
      ...item,
      job_count: normalizeToNumber(item.job_count),
      done_jobs: normalizeToNumber(item.done_jobs),
      error_jobs: normalizeToNumber(item.error_jobs),
    }));
  } catch (error) {
    console.error("Failed to fetch processing data:", error);
    return [];
  }
};