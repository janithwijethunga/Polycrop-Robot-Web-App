import React from "react";

function cls(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function StatusBadge({ label, value }) {
  const v = String(value || "").toUpperCase();

  const tone =
    v.includes("ON") || v.includes("MOVING") || v.includes("DONE")
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : v.includes("STOP") || v.includes("ERROR")
      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
      : v.includes("SCAN")
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : "border-slate-700 bg-slate-900/40 text-slate-200";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2">
      <div className="text-sm text-slate-400">{label}</div>
      <div className={cls("text-xs font-semibold px-2 py-1 rounded-md border", tone)}>
        {value ?? "-"}
      </div>
    </div>
  );
}