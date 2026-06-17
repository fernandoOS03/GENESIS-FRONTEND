import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  /** ISO date string "YYYY-MM-DD" */
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  disableFuture?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Selecciona una fecha',
  error,
  disabled,
  disableFuture,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = (() => {
    if (!value) return undefined;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return undefined;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed
    const day = parseInt(match[3], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? undefined : d;
  })();

  const displayLabel = selected
    ? format(selected, "d 'de' MMMM yyyy", { locale: es })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center gap-2.5 rounded-xl bg-slate-100/70 px-4 text-sm transition-all duration-200',
            'text-left font-normal outline-none',
            error
              ? 'ring-1 ring-destructive/30 bg-destructive/10'
              : open
              ? 'ring-2 ring-primary/20 bg-slate-100'
              : 'hover:bg-slate-100',
            !selected && 'text-muted-foreground/50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{displayLabel}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 shadow-2xl rounded-2xl overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '');
            setOpen(false);
          }}
          disabled={disableFuture ? { after: new Date() } : undefined}
          defaultMonth={selected ?? new Date(2000, 0)}
          locale={es}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
