import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatNow(date: Date) {
  return {
    date: date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };
}

export function LiveClock() {
  const [now, setNow] = useState(() => formatNow(new Date()));

  useEffect(() => {
    const tick = () => setNow(formatNow(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="hidden items-center gap-2 rounded-xl border bg-muted/40 px-3 py-1.5 text-xs sm:flex"
      title="Local time"
    >
      <Clock className="h-3.5 w-3.5 text-primary" />
      <div className="leading-tight">
        <p className="font-medium tabular-nums text-foreground">{now.time}</p>
        <p className="text-[10px] text-muted-foreground">{now.date}</p>
      </div>
    </div>
  );
}
