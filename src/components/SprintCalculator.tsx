import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Users, Calendar } from "lucide-react";
import { format, differenceInBusinessDays, isBefore, isWeekend } from "date-fns";
import VacationSettings from "./vacation/VacationSettings";
import VacationList from "./vacation/VacationList";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { calculateWorkingDays } from "@/utils/dateCalculations";
import SprintDuration from "./sprint/SprintDuration";
import { VacationDay } from "@/types/vacation";
import { calculateTotalWorkDays, WEEKS_OF_WORK } from "@/utils/sprintCalculations";

const SprintCalculator = () => {
  const [engineers, setEngineers] = useState<number>(1);
  const [vacationDays, setVacationDays] = useState<VacationDay[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState<number>(1);
  const [vacationHours, setVacationHours] = useState<number>(8);
  const [sprintStartDate, setSprintStartDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const formatDuration = (totalDays: number) => {
    const weeks = Math.floor(totalDays / 5);
    const remainingDays = totalDays % 5;
    
    const parts = [];
    if (weeks > 0) parts.push(`${weeks}w`);
    if (remainingDays > 0) parts.push(`${remainingDays}d`);
    
    return parts.join(', ') || '0d';
  };

  const calculateTotalDays = () => {
    if (!sprintStartDate) return 0;
    if (engineers <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of engineers must be greater than 0",
        variant: "destructive",
      });
      return 0;
    }

    const today = new Date();
    if (isBefore(sprintStartDate, today)) {
      const businessDaysPassed = differenceInBusinessDays(today, sprintStartDate);
      const totalWorkDays = calculateTotalWorkDays(engineers, vacationDays);
      return Math.max(0, totalWorkDays - businessDaysPassed);
    }

    const totalWorkDays = calculateTotalWorkDays(engineers, vacationDays);
    return calculateWorkingDays(sprintStartDate, totalWorkDays);
  };

  const calculateRemainingTime = () => {
    if (!sprintStartDate) return null;
    
    const today = new Date();
    if (isBefore(today, sprintStartDate)) {
      return "Sprint hasn't started yet";
    }

    const totalDays = calculateTotalDays();
    if (totalDays <= 0) {
      return "Sprint is completed";
    }

    return formatDuration(totalDays);
  };

  const handleEngineersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setEngineers(value);
    console.log("Engineers updated:", value);
  };

  const handleVacationHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 8;
    setVacationHours(Math.min(Math.max(1, value), 8));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isWeekend(date)) {
      toast({
        title: "Invalid date",
        description: "Cannot select weekend days as vacation",
        variant: "destructive",
      });
      return;
    }

    const existingVacation = vacationDays.find(
      (v) => v.engineerId === selectedEngineerId && v.date.getTime() === date.getTime()
    );

    if (existingVacation) {
      setVacationDays(vacationDays.filter((v) => v !== existingVacation));
      toast({
        title: "Vacation removed",
        description: `Removed vacation for Engineer ${selectedEngineerId} on ${format(date, 'PP')}`,
      });
    } else {
      setVacationDays([...vacationDays, { 
        date, 
        engineerId: selectedEngineerId,
        hours: vacationHours 
      }]);
      toast({
        title: "Vacation added",
        description: `Added ${vacationHours}h vacation for Engineer ${selectedEngineerId} on ${format(date, 'PP')}`,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-fadeIn">
      <Card className="p-8 bg-white/50 backdrop-blur-sm border-2 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sprint Calculator</h2>
              <p className="text-gray-600 mb-8">
                Calculate sprint duration based on team size and vacation days
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <label htmlFor="engineers" className="text-sm font-medium">
                    Number of Engineers
                  </label>
                </div>
                <Input
                  id="engineers"
                  type="number"
                  min="1"
                  value={engineers}
                  onChange={handleEngineersChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <label className="text-sm font-medium">
                    Sprint Start Date
                  </label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {sprintStartDate ? (
                        format(sprintStartDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={sprintStartDate}
                      onSelect={setSprintStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <VacationSettings
                engineers={engineers}
                selectedEngineerId={selectedEngineerId}
                vacationHours={vacationHours}
                vacationDays={vacationDays}
                onEngineerSelect={setSelectedEngineerId}
                onVacationHoursChange={handleVacationHoursChange}
                onDateSelect={handleDateSelect}
              />
            </div>

            <SprintDuration
              formatDuration={formatDuration}
              calculateTotalDays={calculateTotalDays}
              calculateRemainingTime={calculateRemainingTime}
              sprintStartDate={sprintStartDate}
              weeksOfWork={WEEKS_OF_WORK}
              engineers={engineers}
            />

            <VacationList vacationDays={vacationDays} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SprintCalculator;
