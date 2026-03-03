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

export default function PlantCard({ plant, currentRFID, error }) {
  const hasRFID = Boolean(currentRFID);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plant</h2>
        <div className="text-xs text-slate-400">
          Doc:{" "}
          <span className="font-mono">
            plants/{hasRFID ? currentRFID : "NONE"}
          </span>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {!hasRFID ? (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
          No plant selected (RFID = NONE). Move robot to a plant tag.
        </div>
      ) : !plant ? (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
          Waiting for plant document for RFID <span className="font-mono">{currentRFID}</span>...
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">RFID</div>
              <div className="font-semibold">{plant.rfid || currentRFID}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">Last Seen Robot</div>
              <div className="font-semibold">{plant.lastSeenRobotId || "-"}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">Scan Status</div>
              <div className="font-semibold">{plant.scanStatus || "-"}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">Disease Detected</div>
              <div className="font-semibold">
                {typeof plant.diseaseDetected === "boolean"
                  ? plant.diseaseDetected
                    ? "YES"
                    : "NO"
                  : "-"}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm">
              <div className="text-slate-400">Last Scan At</div>
              <div className="font-medium">{fmtTs(plant.lastScanAt)}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm">
              <div className="text-slate-400">Last Pump At</div>
              <div className="font-medium">{fmtTs(plant.lastPumpAt)}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">Notes</div>
              <div className="mt-1 whitespace-pre-wrap text-sm">
                {plant.notes?.trim() ? plant.notes : <span className="text-slate-500">No notes yet</span>}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-sm text-slate-400">Image</div>
              <div className="mt-2">
                {plant.imageUrl?.trim() ? (
                  <a
                    href={plant.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sky-300 underline underline-offset-4"
                  >
                    Open image URL
                  </a>
                ) : (
                  <div className="text-sm text-slate-500">No imageUrl yet</div>
                )}
              </div>

              {plant.imageUrl?.trim() ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                  <img
                    src={plant.imageUrl}
                    alt="Plant capture"
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="px-3 py-2 text-xs text-slate-500">
                    If image doesn’t show, check CORS/public access on your hosting (Firebase Storage is best).
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
}