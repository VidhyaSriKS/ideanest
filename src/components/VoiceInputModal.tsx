import { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

export function VoiceInputModal({ isOpen, onClose, onTranscript }: VoiceInputModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    try {
      // Check if browser supports speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error("Voice input is not supported in your browser. Please use Chrome or Edge.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Voice input error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      toast.success("Listening... Speak your idea!");
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error("Failed to start voice input");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUseTranscript = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      onClose();
      setTranscript("");
    } else {
      toast.error("No transcript available");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-[#38bdf8]/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-[#38bdf8] to-[#a855f7] bg-clip-text text-transparent">
            Voice Input Mode
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Describe your startup idea verbally and we'll transcribe it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Recording Button */}
          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-32 w-32 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'neon-button'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-12 w-12" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center">
            {isRecording ? (
              <p className="text-[#38bdf8] flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Recording... Click to stop
              </p>
            ) : (
              <p className="text-slate-400">Click the microphone to start recording</p>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="glass-card p-4 border-slate-700">
              <h4 className="text-sm text-slate-400 mb-2">Transcript:</h4>
              <p className="text-slate-200">{transcript}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setTranscript("");
                toast.info("Transcript cleared");
              }}
              variant="outline"
              className="flex-1 border-slate-700"
              disabled={!transcript || isRecording}
            >
              Clear
            </Button>
            <Button
              onClick={handleUseTranscript}
              className="neon-button flex-1"
              disabled={!transcript || isRecording}
            >
              Use This Transcript
            </Button>
          </div>

          <p className="text-sm text-slate-500 text-center">
            Note: Voice recognition works best in Chrome and Edge browsers
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}