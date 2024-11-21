import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Users, X } from "lucide-react";
import { format, isWeekend } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface VacationSettingsProps {
  engineers: number;
  selectedEngineerId: number;
  vacationHours: number;
  vacationDays: Array<{
    date: Date;
    engineerId: number;
    hours?: number;
  }>;
  onEngineerSelect: (id: number) => void;
  onVacationHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateSelect: (date: Date | undefined) => void;
}

const VacationSettings = ({
  engineers,
  selectedEngineerId,
  vacationHours,
  vacationDays,
  onEngineerSelect,
  onVacationHoursChange,
  onDateSelect,
}: VacationSettingsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          Manage Vacations
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Vacation Settings
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
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
              onChange={(e) => onEngineerSelect(Number(e.target.value))}
              className="w-full border rounded-md p-2"
            >
              {Array.from({ length: engineers }, (_, i) => i + 1).map((id) => (
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
              onChange={onVacationHoursChange}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Select Vacation Days</span>
            </div>
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={onDateSelect}
              className="rounded-md border"
              disabled={(date) => isWeekend(date)}
              modifiers={{
                vacation: vacationDays
                  .filter((v) => v.engineerId === selectedEngineerId)
                  .map((v) => v.date),
              }}
              modifiersStyles={{
                vacation: { backgroundColor: "#0EA5E9", color: "white" },
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VacationSettings;