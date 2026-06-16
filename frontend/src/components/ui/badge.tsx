import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        secondary: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
        destructive: "bg-red-500/15 text-red-400 border border-red-500/30",
        success: "bg-green-500/15 text-green-400 border border-green-500/30",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
        outline: "border border-slate-700 text-slate-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
