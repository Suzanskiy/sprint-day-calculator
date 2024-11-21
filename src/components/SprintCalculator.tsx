import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Users, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, isWeekend, format } from "date-fns";

interface VacationDay {
  date: Date;
  engineerId: number;
  hours?: number;  // New optional field for vacation hours
}

const SprintCalculator = () => {
  const [engineers, setEngineers] = useState<number>(1);
  const [vacationDays, setVacationDays] = useState<VacationDay[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState<number>(1);
  const [vacationHours, setVacationHours] = useState<number>(8); // Default to full day
  const { toast } = useToast();

  const WORK_HOURS_PER_DAY = 8;
  const DAYS_PER_WEEK = 5;
  const WEEKS_OF_WORK = 3;
  const TOTAL_HOURS = WORK_HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_OF_WORK;

  const formatDuration = (totalDays: number) => {
    const totalHours = totalDays * WORK_HOURS_PER_DAY;
    
    const weeks = Math.floor(totalDays / DAYS_PER_WEEK);
    const remainingDays = Math.floor(totalDays % DAYS_PER_WEEK);
    const remainingHours = Math.round((totalHours % WORK_HOURS_PER_DAY));

    const parts = [];
    if (weeks > 0) parts.push(`${weeks}w`);
    if (remainingDays > 0) parts.push(`${remainingDays}d`);
    if (remainingHours > 0) parts.push(`${remainingHours}h`);

    return parts.join(', ') || '0h';
  };

  const calculateTotalDays = () => {
    if (engineers <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of engineers must be greater than 0",
        variant: "destructive",
      });
      return 0;
    }

    // Calculate total work days without vacation
    const totalWorkDays = Math.ceil((TOTAL_HOURS * engineers) / WORK_HOURS_PER_DAY);

    // Subtract vacation days/hours
    const totalVacationDays = vacationDays.reduce((acc, vDay) => {
      if (isWeekend(vDay.date)) return acc;
      const hoursToSubtract = vDay.hours || WORK_HOURS_PER_DAY; // If hours not specified, subtract full day
      return acc + (hoursToSubtract / WORK_HOURS_PER_DAY);
    }, 0);

    return totalWorkDays - totalVacationDays;
  };

  const handleEngineersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setEngineers(value);
    console.log("Engineers updated:", value);
  };

  const handleVacationHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 8;
    setVacationHours(Math.min(Math.max(1, value), 8)); // Limit between 1 and 8 hours
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

  const getEngineerOptions = () => {
    return Array.from({ length: engineers }, (_, i) => i + 1);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Sprint Calculator</h2>
        
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
            <Users className="w-5 h-5 text-primary" />
            <label htmlFor="engineerId" className="text-sm font-medium">
              Select Engineer for Vacation
            </label>
          </div>
          <select
            id="engineerId"
            value={selectedEngineerId}
            onChange={(e) => setSelectedEngineerId(Number(e.target.value))}
            className="w-full border rounded-md p-2"
          >
            {getEngineerOptions().map((id) => (
              <option key={id} value={id}>
                Engineer {id}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <label htmlFor="vacationHours" className="text-sm font-medium">
              Vacation Hours (1-8)
            </label>
          </div>
          <Input
            id="vacationHours"
            type="number"
            min="1"
            max="8"
            value={vacationHours}
            onChange={handleVacationHoursChange}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Select Vacation Days</span>
          </div>
          <CalendarComponent
            mode="single"
            selected={undefined}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => isWeekend(date)}
            modifiers={{
              vacation: vacationDays.filter(v => v.engineerId === selectedEngineerId).map(v => v.date)
            }}
            modifiersStyles={{
              vacation: { backgroundColor: '#0EA5E9', color: 'white' }
            }}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm">Working Hours: 9:00 - 17:00</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm">Working Days: Monday - Friday</span>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              Total Sprint Time: {formatDuration(calculateTotalDays())}
            </p>
            <p className="text-sm text-gray-500">
              Based on {WEEKS_OF_WORK * engineers} total weeks of work
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SprintCalculator;