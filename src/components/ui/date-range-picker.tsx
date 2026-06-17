import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  /** ISO string "YYYY-MM-DDTHH:mm" */
  fromValue: string;
  toValue: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  fromError?: string;
  toError?: string;
  disabled?: boolean;
}

function toDateOnly(iso: string): Date | undefined {
  if (!iso) return undefined;
  const match = iso.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return undefined;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 0-indexed
  const day = parseInt(match[3], 10);
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? undefined : d;
}

function buildIso(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  return `${dateStr}T${timeStr || '00:00'}`;
}

function getDatePart(iso: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function getTimePart(iso: string): string {
  if (!iso || iso.length < 16) return '00:00';
  return iso.slice(11, 16);
}

export function DateRangePicker({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromError,
  toError,
  disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const fromDate = toDateOnly(fromValue);
  const toDate = toDateOnly(toValue);
  const range: DateRange = { from: fromDate, to: toDate };

  const fromTime = getTimePart(fromValue);
  const toTime = getTimePart(toValue);

  function handleRangeSelect(selected: DateRange | undefined) {
    if (!selected) {
      onFromChange('');
      onToChange('');
      return;
    }
    if (selected.from) {
      const dateStr = format(selected.from, 'yyyy-MM-dd');
      onFromChange(buildIso(dateStr, fromTime));
    } else {
      onFromChange('');
    }
    if (selected.to) {
      const dateStr = format(selected.to, 'yyyy-MM-dd');
      onToChange(buildIso(dateStr, toTime));
    } else {
      onToChange('');
    }
  }

  const displayLabel = (() => {
    if (fromDate && toDate) {
      return `${format(fromDate, 'd MMM', { locale: es })} → ${format(toDate, 'd MMM yyyy', { locale: es })}`;
    }
    if (fromDate) return `Desde ${format(fromDate, 'd MMM yyyy', { locale: es })} — elige fin`;
    return 'Selecciona rango de fechas';
  })();

  const hasError = !!fromError || !!toError;
  const hasAnyDate = !!(fromDate || toDate);

  return (
    <div className="space-y-3">
      {/* Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex h-9 w-full items-center gap-2.5 rounded-xl border bg-muted/30 px-3 text-sm transition-all',
              'text-left font-normal outline-none',
              hasError
                ? 'border-destructive'
                : open
                ? 'border-primary/50 bg-background ring-3 ring-primary/15'
                : 'border-input/50 hover:bg-muted/50',
              !fromDate && 'text-muted-foreground/60',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{displayLabel}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 shadow-2xl rounded-2xl overflow-hidden" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {/* Time inputs — siempre visibles cuando hay cualquier fecha */}
      {hasAnyDate && (
        <div className="grid grid-cols-2 gap-3">
          {/* Hora de llegada */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              🛬 Hora de llegada
            </Label>
            <Input
              type="time"
              value={fromTime}
              onChange={(e) =>
                onFromChange(buildIso(getDatePart(fromValue), e.target.value))
              }
              disabled={!fromDate || disabled}
              className={cn(fromError ? 'border-destructive' : '')}
            />
            {fromError && (
              <p className="text-xs text-destructive">{fromError}</p>
            )}
          </div>

          {/* Hora de ida */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              🛫 Hora de ida
            </Label>
            <Input
              type="time"
              value={toTime}
              onChange={(e) =>
                onToChange(buildIso(getDatePart(toValue), e.target.value))
              }
              disabled={!toDate || disabled}
              className={cn(toError ? 'border-destructive' : '')}
            />
            {toError && (
              <p className="text-xs text-destructive">{toError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
