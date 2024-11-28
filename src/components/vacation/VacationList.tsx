import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

interface VacationDay {
  date: Date;
  engineerId: number;
  hours?: number;
}

interface VacationListProps {
  vacationDays: VacationDay[];
}

const VacationList = ({ vacationDays }: VacationListProps) => {
  if (vacationDays.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No vacations scheduled yet</p>
      </div>
    );
  }

  const sortedVacations = [...vacationDays].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Scheduled Vacations</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Engineer</TableHead>
              <TableHead>Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVacations.map((vacation, index) => (
              <TableRow key={`${vacation.engineerId}-${vacation.date.getTime()}`}>
                <TableCell>{format(vacation.date, 'PP')}</TableCell>
                <TableCell>Engineer {vacation.engineerId}</TableCell>
                <TableCell>{vacation.hours || 8}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VacationList;