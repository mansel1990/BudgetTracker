"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";

interface FetchFormProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  refetch: () => void;
  isLoading: boolean;
}

const FetchForm = ({
  selectedDate,
  setSelectedDate,
  refetch,
  isLoading,
}: FetchFormProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="pl-3 text-left font-normal flex items-center gap-2"
          >
            {format(selectedDate, "PPP")}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
          />
        </PopoverContent>
      </Popover>
      <Button
        onClick={() => refetch()}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          "Fetch Emails"
        )}
      </Button>
    </div>
  );
};

export default FetchForm;
