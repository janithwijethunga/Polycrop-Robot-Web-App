import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, ROBOT_ID } from "./firebase";

import Header from "./components/Header.jsx";
import RobotCard from "./components/RobotCard.jsx";
import PlantCard from "./components/PlantCard.jsx";
import EventsTable from "./components/EventsTable.jsx";

export default function App() {
  const [robot, setRobot] = useState(null);
  const [plant, setPlant] = useState(null);
  const [events, setEvents] = useState([]);
  const [robotErr, setRobotErr] = useState("");
  const [plantErr, setPlantErr] = useState("");
  const [eventsErr, setEventsErr] = useState("");

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
      </main>

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400">
          Firestore live dashboard • robots/{ROBOT_ID} • plants/{currentRFID || "NONE"} • scanEvents (last 50)
        </div>
      </footer>
    </div>
  );
}