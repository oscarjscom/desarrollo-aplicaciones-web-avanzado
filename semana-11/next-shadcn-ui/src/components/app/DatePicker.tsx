"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, fromISO, toISO } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  id: string;
  value: string; // yyyy-MM-dd o ""
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  // Para fechas de nacimiento: permite elegir año y mes desde listas
  birthdate?: boolean;
}

export function DatePicker({ id, value, onChange, placeholder = "Elige una fecha", invalid, birthdate }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = fromISO(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid}
          className={cn(
            "w-full justify-start font-normal",
            !selected && "text-muted-foreground",
            invalid && "border-destructive",
          )}
        >
          <CalendarIcon className="size-4" />
          {selected ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          selected={selected}
          defaultMonth={selected ?? (birthdate ? new Date(1998, 0) : undefined)}
          captionLayout={birthdate ? "dropdown" : "label"}
          startMonth={birthdate ? new Date(1930, 0) : undefined}
          endMonth={birthdate ? new Date() : undefined}
          onSelect={(date) => {
            if (date) onChange(toISO(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
