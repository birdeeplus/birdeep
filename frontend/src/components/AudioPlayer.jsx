"use client";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaRedoAlt, FaUndoAlt, FaForward, FaBackward } from "react-icons/fa";
import Image from "next/image";

export default function AudioPlayer({ src, filename = "grabación", recorderId = "", onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  
  // Función para descargar la grabación
  const downloadRecording = (audioUrl, filename) => {
    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "audio.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error al descargar el archivo:", error));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl w-full max-w-6xl px-6 py-3 text-[#375B38] shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-semibold">{filename}</p>
          <p className="text-xs text-gray-500">grabadora #{recorderId}</p>
        </div>

        <button onClick={() => {
          
          const url_modificada = src.replace("http://10.4.117.10:8081", "http://localhost:8080/static")
          const url_transformada = url_modificada.replace("static/datos_audios_bd/audio_data", "proxy-audio")
          downloadRecording(url_transformada, filename)
        }
        } className="w-5 h-5">
        {/* </button><button onClick={() => downloadRecording(src, filename)} className="w-5 h-5"> */}

          <Image src="/iconos/download.png" alt="download" width={18} height={18} />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-[#375B38] h-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        ></div>
      </div>

      {/* Tiempos + Controles */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
        <div className="flex items-center gap-3 text-base">
          <FaUndoAlt onClick={() => skipTime(-10)} className="cursor-pointer" />
          <FaBackward onClick={() => skipTime(-5)} className="cursor-pointer" />
          {isPlaying ? (
            <FaPause onClick={togglePlay} className="cursor-pointer" />
          ) : (
            <FaPlay onClick={togglePlay} className="cursor-pointer" />
          )}
          <FaForward onClick={() => skipTime(5)} className="cursor-pointer" />
          <FaRedoAlt onClick={() => skipTime(10)} className="cursor-pointer" />
        </div>
        <span className="text-xs text-gray-500">{formatTime(duration)}</span>
      </div>

      <audio ref={audioRef} src={src} autoPlay />
    </div>
  );
}
