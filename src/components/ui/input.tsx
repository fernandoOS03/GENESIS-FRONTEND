import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground bg-slate-100/70 h-8 w-full min-w-0 rounded-md px-3 py-1.5 text-sm shadow-none transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/20",
        "aria-invalid:bg-destructive/10 aria-invalid:ring-1 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
