import React, { useEffect, useRef, useState } from "react";

export default function CameraPanel({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState("");

  async function openCamera() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // back camera on phones
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsOpen(true);
    } catch (e) {
      setErr(e?.message || "Camera permission denied / not available");
      setIsOpen(false);
    }
  }

  function closeCamera() {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsOpen(false);
  }

  function capture() {
    setErr("");
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // JPEG base64
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onCapture?.(dataUrl);
  }

  useEffect(() => {
    return () => closeCamera(); // cleanup when component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Camera</h2>

        <div className="flex gap-2">
          {!isOpen ? (
            <button
              onClick={openCamera}
              className="rounded-lg bg-sky-500/20 px-3 py-2 text-sm font-semibold text-sky-200 border border-sky-500/30 hover:bg-sky-500/25"
            >
              Open Camera
            </button>
          ) : (
            <>
              <button
                onClick={capture}
                className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/25"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200 border border-rose-500/30 hover:bg-rose-500/25"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>

      {err ? (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {err}
        </div>
      ) : null}

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
        <video ref={videoRef} className="w-full max-h-[420px] object-cover" playsInline />
      </div>

      <div className="mt-2 text-xs text-slate-400">
        Tip: Use HTTPS (or localhost) or the camera will not open.
      </div>
    </section>
  );
}