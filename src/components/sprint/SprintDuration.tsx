import { Clock } from "lucide-react";

interface SprintDurationProps {
  formatDuration: (days: number) => string;
  calculateTotalDays: () => number;
  calculateRemainingTime: () => string | null;
  sprintStartDate: Date | undefined;
  weeksOfWork: number;
  engineers: number;
}

const SprintDuration = ({
  formatDuration,
  calculateTotalDays,
  calculateRemainingTime,
  sprintStartDate,
  weeksOfWork,
  engineers
}: SprintDurationProps) => {
  return (
    <div className="pt-6 border-t">
      <div className="text-center space-y-2">
        <p className="text-2xl font-semibold text-primary">
          Total Sprint Time: {formatDuration(calculateTotalDays())}
        </p>
        {sprintStartDate && (
          <p className="text-xl font-medium text-primary">
            Remaining Time: {calculateRemainingTime()}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Based on {weeksOfWork * engineers} total weeks of work
        </p>
      </div>
    </div>
  );
};

export default SprintDuration;