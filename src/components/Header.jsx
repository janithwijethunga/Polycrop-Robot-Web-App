import React from "react";

export default function Header({ robotId }) {
  return (
    <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Robot Monitoring Dashboard</h1>
          <p className="text-sm text-slate-400">Live status + plant scan + event history</p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
          <span className="text-slate-400">Robot ID:</span>{" "}
          <span className="font-semibold">{robotId}</span>
        </div>
      </div>
    </header>
  );
}