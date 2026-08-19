import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
        warning:
          "border-transparent bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
        info: "border-transparent bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30",
        purple:
          "border-transparent bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30",
        destructive:
          "border-transparent bg-destructive/15 text-destructive ring-1 ring-destructive/30",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
