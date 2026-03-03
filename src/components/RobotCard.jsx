import React from "react";
import StatusBadge from "./StatusBadge.jsx";

function fmtTs(ts) {
  try {
    if (!ts) return "-";
    // Firestore Timestamp has toDate()
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "-";
  }
}

export default function RobotCard({ robot, error }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Robot Status</h2>
        <div className="text-xs text-slate-400">
          Doc: <span className="font-mono">robots/{robot?.robotId || "..."}</span>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {!robot ? (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
          Waiting for robot data...
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatusBadge label="RFID" value={robot.rfid} />
            <StatusBadge label="Mode" value={robot.mode} />
            <StatusBadge label="Moving" value={robot.moving} />
            <StatusBadge label="Scanning" value={robot.scanning} />
            <StatusBadge label="Pump" value={robot.pump} />
            <StatusBadge label="WiFi RSSI" value={robot.rssi} />
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm">
            <div className="text-slate-400">Updated at</div>
            <div className="font-medium">{fmtTs(robot.updatedAt)}</div>
          </div>
        </>
      )}
    </section>
  );
}