import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Users, Calendar } from "lucide-react";

const SprintCalculator = () => {
  const [engineers, setEngineers] = useState<number>(1);
  const { toast } = useToast();

  const WORK_HOURS_PER_DAY = 8; // 9:00-17:00
  const DAYS_PER_WEEK = 5; // Monday to Friday
  const WEEKS_OF_WORK = 3;
  const TOTAL_HOURS = WORK_HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_OF_WORK;

  const calculateTotalDays = () => {
    if (engineers <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of engineers must be greater than 0",
        variant: "destructive",
      });
      return 0;
    }

    const totalDays = (TOTAL_HOURS / engineers) / WORK_HOURS_PER_DAY;
    return Math.ceil(totalDays);
  };

  const handleEngineersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setEngineers(value);
    console.log("Engineers updated:", value);
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
              Total Sprint Days: {calculateTotalDays()}
            </p>
            <p className="text-sm text-gray-500">
              Based on {WEEKS_OF_WORK} weeks of work
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SprintCalculator;