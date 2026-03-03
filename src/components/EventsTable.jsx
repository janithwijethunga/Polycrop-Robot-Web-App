import React from "react";

function fmtTs(ts) {
  try {
    if (!ts) return "-";
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "-";
  }
}

export default function EventsTable({ events, error }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Scan Events (last 50)</h2>
        <div className="text-xs text-slate-400">
          Collection: <span className="font-mono">scanEvents</span>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-800">
        <div className="max-h-[420px] overflow-auto bg-slate-950/40">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur">
              <tr className="text-slate-300">
                <th className="px-3 py-2 font-semibold">Time</th>
                <th className="px-3 py-2 font-semibold">Event</th>
                <th className="px-3 py-2 font-semibold">RFID</th>
                <th className="px-3 py-2 font-semibold">Mode</th>
                <th className="px-3 py-2 font-semibold">Pump</th>
                <th className="px-3 py-2 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {events?.length ? (
                events.map((e) => (
                  <tr key={e.id} className="border-t border-slate-800/70">
                    <td className="px-3 py-2 whitespace-nowrap text-slate-300">{fmtTs(e.ts)}</td>
                    <td className="px-3 py-2 font-semibold">{e.eventType || "-"}</td>
                    <td className="px-3 py-2 font-mono">{e.rfid || "-"}</td>
                    <td className="px-3 py-2">{e.mode || "-"}</td>
                    <td className="px-3 py-2">{e.pump || "-"}</td>
                    <td className="px-3 py-2 text-slate-300">{e.note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-slate-400" colSpan={6}>
                    No events yet. Once ESP32 writes scanEvents, they will show here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}