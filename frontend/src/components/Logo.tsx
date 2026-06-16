import { Wrench, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { wrap: "w-7 h-7", icon: "w-3.5 h-3.5", badge: "w-3 h-3 -bottom-0.5 -right-0.5", text: "text-sm", cal: "w-1.5 h-1.5" },
  md: { wrap: "w-9 h-9", icon: "w-4.5 h-4.5", badge: "w-3.5 h-3.5 -bottom-1 -right-1", text: "text-base", cal: "w-2 h-2" },
  lg: { wrap: "w-12 h-12", icon: "w-6 h-6", badge: "w-5 h-5 -bottom-1 -right-1", text: "text-xl", cal: "w-2.5 h-2.5" },
  xl: { wrap: "w-16 h-16", icon: "w-8 h-8", badge: "w-7 h-7 -bottom-1.5 -right-1.5", text: "text-3xl", cal: "w-3.5 h-3.5" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0">
        <div
          className={cn(
            s.wrap,
            "rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500",
            "flex items-center justify-center shadow-lg shadow-blue-500/30"
          )}
        >
          <Wrench className={cn(s.icon, "text-white")} strokeWidth={2.5} />
        </div>
        <div
          className={cn(
            s.badge,
            "absolute rounded-md bg-cyan-400 flex items-center justify-center shadow-md shadow-cyan-400/40"
          )}
        >
          <CalendarCheck className={cn(s.cal, "text-slate-900")} strokeWidth={2.5} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn(s.text, "font-black text-white tracking-tight")}>Auto</span>
          <span className={cn(s.text, "font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent")}>
            Agenda
          </span>
        </div>
      )}
    </div>
  );
}
