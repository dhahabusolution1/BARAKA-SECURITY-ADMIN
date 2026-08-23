import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

type Props = {
  url: string;
  durationSeconds?: number | null;
  label?: string;
  uploadedAt?: string;
};

export const AudioPlayer: React.FC<Props> = ({
  url,
  durationSeconds,
  label = 'Message Vocal SOS',
  uploadedAt,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 0);
  const [isMuted, setIsMuted] = useState(false);

  const fullUrl = url.startsWith('http')
    ? url
    : `${import.meta.env.VITE_API_BASE_URL || ''}${url}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error('Audio playback error:', err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const reset = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] p-3 sm:p-3.5 rounded-lg flex flex-col gap-2">
      <audio ref={audioRef} src={fullUrl} preload="metadata" />

      <div className="flex items-center justify-between text-xs text-[var(--color-brand-muted)] gap-2">
        <span className="font-semibold text-[var(--color-brand-cream)] flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        {uploadedAt && (
          <span className="shrink-0 font-mono text-[11px]">
            {new Date(uploadedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={togglePlay}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-bright)] text-black flex items-center justify-center font-bold transition-transform active:scale-95 shadow cursor-pointer shrink-0"
          title={isPlaying ? 'Pause' : 'Écouter'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
        </button>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[var(--color-brand-charcoal)] rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-gold)]"
          />
          <div className="flex justify-between text-[10px] sm:text-[11px] text-[var(--color-brand-muted)] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || durationSeconds || 0)}</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 text-[var(--color-brand-muted)] shrink-0">
          <button
            onClick={reset}
            className="p-1.5 hover:text-white hover:bg-[var(--color-brand-charcoal)] rounded transition cursor-pointer"
            title="Recommencer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 hover:text-white hover:bg-[var(--color-brand-charcoal)] rounded transition cursor-pointer"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
