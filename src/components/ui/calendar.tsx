import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
          className={cn("p-4 border rounded-md w-full max-w-md mx-auto", className)} // Center and style container
          classNames={{
            months: "flex flex-col space-y-4", // Simplified for single column layout
            month: "space-y-2", // Add spacing between month content
            caption: "flex justify-between items-center py-2", // Center navigation and label
            caption_label: "text-lg font-medium text-center",
            nav: "flex items-center justify-between",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-8 w-8 bg-transparent p-0 hover:opacity-100"
            ),
            nav_button_previous: "",
            nav_button_next: "",
            table: "w-full border-collapse text-center", // Ensure proper alignment
            head_row: "flex justify-between",
            head_cell: "text-muted-foreground w-10 font-medium text-sm",
            row: "flex justify-between w-full", // Fix row layout
            cell: "h-10 w-10 flex items-center justify-center text-sm p-0 border border-gray-200 bg-white",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 flex items-center justify-center font-normal text-gray-800" // Simplified styling
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary focus:outline focus:ring-2 focus:ring-offset-2",
            day_today: "bg-accent text-accent-foreground font-bold",
            day_outside: "hidden", // Hide days outside the current month
            day_disabled: "text-gray-400 opacity-50",
          }}
          components={{
            IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
          }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
