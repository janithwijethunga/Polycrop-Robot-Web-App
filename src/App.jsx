import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, ROBOT_ID } from "./firebase";

import Header from "./components/Header.jsx";
import RobotCard from "./components/RobotCard.jsx";
import PlantCard from "./components/PlantCard.jsx";
import EventsTable from "./components/EventsTable.jsx";
import CameraPanel from "./components/CameraPanel.jsx";

const INFER_URL = "http://localhost:5173/infer";

export default function App() {
  const [robot, setRobot] = useState(null);
  const [plant, setPlant] = useState(null);
  const [events, setEvents] = useState([]);
  const [robotErr, setRobotErr] = useState("");
  const [plantErr, setPlantErr] = useState("");
  const [eventsErr, setEventsErr] = useState("");

  const [captured, setCaptured] = useState(null);
  const [inferData, setInferData] = useState(null);
  const [inferErr, setInferErr] = useState("");
  const [inferLoading, setInferLoading] = useState(false);

  async function handleCapture(dataUrl) {
    setCaptured(dataUrl);
    setInferData(null);
    setInferErr("");
    setInferLoading(true);

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch(INFER_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Inference endpoint not found (404): ${INFER_URL}`);
        }
        throw new Error(`Inference request failed (${res.status})`);
      }

      const data = await res.json();
      console.log(data);
      setInferData(data);
    } catch (err) {
      setInferErr(err?.message || "Failed to run inference");
    } finally {
      setInferLoading(false);
    }
  }

  const currentRFID = robot?.rfid && robot?.rfid !== "NONE" ? robot.rfid : null;

  // --- Live Robot doc ---
  useEffect(() => {
    const ref = doc(db, "robots", ROBOT_ID);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        setRobotErr("");
        if (snap.exists()) setRobot(snap.data());
        else setRobot(null);
      },
      (err) => setRobotErr(err?.message || "Failed to read robot doc")
    );

    return () => unsub();
  }, []);

  // --- Live Plant doc (depends on robot RFID) ---
  useEffect(() => {
    setPlant(null);
    setPlantErr("");

    if (!currentRFID) return;

    const ref = doc(db, "plants", currentRFID);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        setPlantErr("");
        if (snap.exists()) setPlant(snap.data());
        else setPlant(null);
      },
      (err) => setPlantErr(err?.message || "Failed to read plant doc")
    );

    return () => unsub();
  }, [currentRFID]);

  // --- Live scan events for this robot ---
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "scanEvents"),
      (snap) => {
        setEventsErr("");
        const rows = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((row) => row.robotId === ROBOT_ID)
          .sort((a, b) => {
            const aTs = a?.ts?.toMillis?.() ?? 0;
            const bTs = b?.ts?.toMillis?.() ?? 0;
            return bTs - aTs;
          })
          .slice(0, 50);

        setEvents(rows);
      },
      (err) => setEventsErr(err?.message || "Failed to read scan events")
    );

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen">
      <Header robotId={ROBOT_ID} />

      <main className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RobotCard robot={robot} error={robotErr} />
          <PlantCard plant={plant} currentRFID={currentRFID} error={plantErr} />
        </div>

        <div className="mt-6">
          <EventsTable events={events} error={eventsErr} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
  <CameraPanel onCapture={handleCapture} />

  <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 shadow-sm">
    <h2 className="text-lg font-semibold">Captured Image</h2>
    {!captured ? (
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
        No image captured yet.
      </div>
    ) : (
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
        <img src={captured} alt="Captured" className="w-full max-h-[420px] object-cover" />
      </div>
    )}

    <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm">
      <div className="font-medium text-slate-200">Inference Result</div>
      {inferLoading ? (
        <div className="mt-2 text-slate-300">Running inference...</div>
      ) : inferErr ? (
        <div className="mt-2 text-rose-300">{inferErr}</div>
      ) : inferData ? (
        <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-slate-200">
          {JSON.stringify(inferData, null, 2)}
        </pre>
      ) : (
        <div className="mt-2 text-slate-300">No inference result yet.</div>
      )}
    </div>
  </section>
</div>
      </main>

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400">
          Firestore live dashboard • robots/{ROBOT_ID} • plants/{currentRFID || "NONE"} • scanEvents (last 50)
        </div>
      </footer>
    </div>
  );
}