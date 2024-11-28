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
      <div className="text-center p-2 text-gray-500 text-sm">
        <Users className="w-6 h-6 mx-auto mb-1 opacity-50" />
        <p>No vacations scheduled yet</p>
      </div>
    );
  }

  const sortedVacations = [...vacationDays].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Scheduled Vacations</h3>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-2">Date</TableHead>
              <TableHead className="py-2">Engineer</TableHead>
              <TableHead className="py-2">Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVacations.map((vacation) => (
              <TableRow key={`${vacation.engineerId}-${vacation.date.getTime()}`} className="text-sm">
                <TableCell className="py-1.5">{format(vacation.date, 'PP')}</TableCell>
                <TableCell className="py-1.5">Engineer {vacation.engineerId}</TableCell>
                <TableCell className="py-1.5">{vacation.hours || 8}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VacationList;