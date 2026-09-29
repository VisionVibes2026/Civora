import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { Mic, X, Loader2 } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onVoiceInputCaptured: (transcript: string) => void;
  nextDemoUserQuery?: string;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onVoiceInputCaptured,
  nextDemoUserQuery,
}) => {
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [processingStage, setProcessingStage] = useState<'processing' | 'understanding'>('processing');
  const [transcriptText, setTranscriptText] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  
  // Real-time Audio-Reactive State
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [shakeOffset, setShakeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingTimersRef = useRef<{ t1?: ReturnType<typeof setTimeout>; t2?: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      clearProcessingTimers();
    };
  }, [isOpen]);

  const clearProcessingTimers = () => {
    if (processingTimersRef.current.t1) clearTimeout(processingTimersRef.current.t1);
    if (processingTimersRef.current.t2) clearTimeout(processingTimersRef.current.t2);
    processingTimersRef.current = {};
  };

  // Web Audio API sampling for real-time volume & outer ring reactivity
  useEffect(() => {
    if (isOpen && voiceState === 'listening') {
      let isSubscribed = true;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            if (!isSubscribed) {
              stream.getTracks().forEach(t => t.stop());
              return;
            }
            streamRef.current = stream;
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateAudioLevel = () => {
              if (!isSubscribed) return;
              analyser.getByteFrequencyData(dataArray);

              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const normalizedVol = Math.min(1.0, avg / 110);

              // Gentle idle sine pulse when quiet
              const idlePulse = (Math.sin(Date.now() / 250) + 1) * 0.05;
              const effectiveVol = Math.max(idlePulse, normalizedVol);

              setAudioVolume(effectiveVol);

              // Smooth mic vibration/shaking ONLY on higher volume
              if (normalizedVol > 0.18) {
                const shakeIntensity = normalizedVol * 4;
                const rx = (Math.random() - 0.5) * shakeIntensity;
                const ry = (Math.random() - 0.5) * shakeIntensity;
                setShakeOffset({ x: rx, y: ry });
              } else {
                setShakeOffset({ x: 0, y: 0 });
              }

              animFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };

            updateAudioLevel();
          })
          .catch(() => {
            // Fallback idle sine pulse loop if mic permission blocked
            const runIdleLoop = () => {
              if (!isSubscribed) return;
              const idlePulse = (Math.sin(Date.now() / 250) + 1) * 0.08;
              setAudioVolume(idlePulse);
              setShakeOffset({ x: 0, y: 0 });
              animFrameRef.current = requestAnimationFrame(runIdleLoop);
            };
            runIdleLoop();
          });
      } else {
        const runIdleLoop = () => {
          if (!isSubscribed) return;
          const idlePulse = (Math.sin(Date.now() / 250) + 1) * 0.08;
          setAudioVolume(idlePulse);
          setShakeOffset({ x: 0, y: 0 });
          animFrameRef.current = requestAnimationFrame(runIdleLoop);
        };
        runIdleLoop();
      }

      return () => {
        isSubscribed = false;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      };
    }
  }, [isOpen, voiceState]);

  const startListening = () => {
    setVoiceState('listening');
    setProcessingStage('processing');
    setTranscriptText('');
    clearProcessingTimers();

    // Check browser Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        const langMap: Record<Language, string> = {
          en: 'en-IN',
          ta: 'ta-IN',
          hi: 'hi-IN',
          te: 'te-IN',
          kn: 'kn-IN'
        };
        recognition.lang = langMap[currentLanguage] || 'en-IN';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          if (currentText.trim()) {
            setTranscriptText(currentText);
          }
        };

        recognition.start();
        setRecognitionInstance(recognition);
      } catch (err) {
        setVoiceState('listening');
      }
    } else {
      setVoiceState('listening');
    }
  };

  const handleDoneRecording = () => {
    if (voiceState === 'processing') return;

    // 1. Stop Speech Recognition & Audio stream sampling
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (e) {}
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }

    // 2. Start 2-4s Realistic Processing Workflow
    setVoiceState('processing');
    setProcessingStage('processing');

    const fallbackText = nextDemoUserQuery || (currentLanguage === 'ta'
      ? "வணக்கம். நான் நாகப்பட்டினத்தைச் சேர்ந்த நெல் விவசாயி. கனமழையால் எனது பயிர் சேதமடைந்துள்ளது. PACS மூலம் விவசாயக் கடன் பெற்றுள்ளேன், ஆனால் என் பயிர் காப்பீடு செய்யப்பட்டுள்ளதா என்று எனக்குத் தெரியவில்லை."
      : "Hello. I am a paddy farmer from Nagapattinam. Heavy rain has damaged my crop. I have an agricultural loan from PACS, but I don't know whether my crop is insured.");

    const textToSend = transcriptText.trim() || fallbackText;

    // Step 1 — "Processing speech…" (0 to 1.5s)
    clearProcessingTimers();
    processingTimersRef.current.t1 = setTimeout(() => {
      // Step 2 — "Understanding your speech…" (1.5s to 3.0s)
      setProcessingStage('understanding');
    }, 1500);

    // Final — Insert transcription into Ask bar automatically (3.0s total)
    processingTimersRef.current.t2 = setTimeout(() => {
      onVoiceInputCaptured(textToSend);
      onClose();
    }, 3000);
  };

  const stopListening = () => {
    clearProcessingTimers();
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (e) {}
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setVoiceState('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-overlay" onClick={handleDoneRecording}>
      <div className="voice-modal-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="voice-close-btn" aria-label="Close voice modal">
          <X size={18} />
        </button>

        {/* Top Language Label */}
        <div className="voice-status-header">
          <span className="language-badge">Native Language → English</span>
          <h2 className="voice-status-title">
            {voiceState === 'listening' && "Recording speech..."}
            {voiceState === 'processing' && processingStage === 'processing' && "Processing speech…"}
            {voiceState === 'processing' && processingStage === 'understanding' && "Understanding your speech…"}
          </h2>
        </div>

        {/* Real-Time Voice-Reactive Microphone & Visualizer */}
        <div className="mic-visualizer-container" onClick={handleDoneRecording} style={{ cursor: 'pointer' }}>
          {voiceState === 'listening' && (
            <div className="pulse-rings">
              <div 
                className="ring ring-3"
                style={{
                  transform: `scale(${1 + audioVolume * 1.15})`,
                  opacity: Math.max(0.15, Math.min(0.7, audioVolume * 0.85)),
                  borderColor: '#0F766E'
                }}
              ></div>
              <div 
                className="ring ring-2"
                style={{
                  transform: `scale(${1 + audioVolume * 0.75})`,
                  opacity: Math.max(0.25, Math.min(0.85, 0.25 + audioVolume * 0.8)),
                  borderColor: '#0F766E'
                }}
              ></div>
              <div 
                className="ring ring-1"
                style={{
                  transform: `scale(${1 + audioVolume * 0.45})`,
                  opacity: Math.max(0.4, Math.min(0.95, 0.4 + audioVolume * 0.7)),
                  borderColor: '#0F766E'
                }}
              ></div>
            </div>
          )}

          <div 
            className={`large-mic-circle ${voiceState}`}
            style={
              voiceState === 'listening' ? {
                transform: `scale(${1 + audioVolume * 0.32}) translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
                boxShadow: `0 0 ${20 + audioVolume * 45}px rgba(15, 118, 110, ${0.45 + audioVolume * 0.5})`,
                transition: 'transform 60ms ease-out, box-shadow 60ms ease-out'
              } : undefined
            }
          >
            {voiceState === 'listening' && <Mic size={36} className="mic-icon" />}
            {voiceState === 'processing' && <Loader2 size={36} className="spinner-icon text-teal-400" />}
          </div>
        </div>

        {/* Live Transcript / Processing Preview Display */}
        <div className="transcript-box">
          {voiceState === 'listening' ? (
            <p className="transcript-text">
              {transcriptText || 'Recording speech... Speak now, then tap Done Recording to process.'}
            </p>
          ) : (
            <div className="processing-status-box">
              <div className="waveform-bar-loader">
                <span className="w-bar b1"></span>
                <span className="w-bar b2"></span>
                <span className="w-bar b3"></span>
                <span className="w-bar b4"></span>
              </div>
              <p className="transcript-text processing-text">
                {processingStage === 'processing' ? 'Processing speech…' : 'Understanding your speech…'}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="voice-footer">
          <button 
            onClick={handleDoneRecording} 
            disabled={voiceState === 'processing'}
            className="send-voice-active-btn"
          >
            {voiceState === 'processing' ? (
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="spinner-icon inline-block" />
                Processing…
              </span>
            ) : (
              "Done Recording"
            )}
          </button>
        </div>
      </div>

      <style>{`
        .voice-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 16px;
        }

        .voice-modal-card {
          width: 100%;
          max-width: 440px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
        }

        .voice-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          color: #737373;
          padding: 6px;
          border-radius: 50%;
          transition: all 150ms ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .voice-close-btn:hover {
          background-color: #2A2A2A;
          color: #F5F5F5;
        }

        .voice-status-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .language-badge {
          background-color: rgba(15, 118, 110, 0.2);
          color: #14B8A6;
          border: 1px solid rgba(15, 118, 110, 0.4);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 9999px;
          letter-spacing: 0.2px;
        }

        .voice-status-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #F5F5F5;
          min-height: 1.5rem;
          text-align: center;
        }

        .mic-visualizer-container {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px 0;
        }

        .large-mic-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          transition: all 200ms ease;
        }

        .large-mic-circle.listening {
          background-color: #0F766E;
          color: #ffffff;
          box-shadow: 0 0 24px rgba(15, 118, 110, 0.5);
        }

        .large-mic-circle.processing {
          background-color: #115E59;
          color: #2DD4BF;
          box-shadow: 0 0 28px rgba(20, 184, 166, 0.4);
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .pulse-rings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid #0F766E;
          pointer-events: none;
          transition: transform 60ms ease-out, opacity 60ms ease-out;
        }

        .ring-1 {
          width: 96px;
          height: 96px;
        }

        .ring-2 {
          width: 118px;
          height: 118px;
        }

        .ring-3 {
          width: 140px;
          height: 140px;
        }

        .transcript-box {
          width: 100%;
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 14px;
          min-height: 64px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .transcript-text {
          font-size: 0.92rem;
          color: #F5F5F5;
          line-height: 1.5;
        }

        .processing-status-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .waveform-bar-loader {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 16px;
        }

        .w-bar {
          width: 3px;
          height: 100%;
          background-color: #14B8A6;
          border-radius: 2px;
          animation: wavePulse 1s ease-in-out infinite alternate;
        }

        .w-bar.b1 { animation-delay: 0s; }
        .w-bar.b2 { animation-delay: 0.25s; }
        .w-bar.b3 { animation-delay: 0.5s; }
        .w-bar.b4 { animation-delay: 0.75s; }

        @keyframes wavePulse {
          0% { transform: scaleY(0.3); opacity: 0.4; }
          100% { transform: scaleY(1.0); opacity: 1; }
        }

        .voice-footer {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .send-voice-active-btn {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          background-color: #0F766E;
          padding: 10px 24px;
          border-radius: 20px;
          border: none;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.4);
          transition: all 150ms ease;
          cursor: pointer;
        }

        .send-voice-active-btn:hover:not(:disabled) {
          background-color: #0D6962;
          transform: translateY(-1px);
        }

        .send-voice-active-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
