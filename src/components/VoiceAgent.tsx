import { useState, useCallback, useEffect } from "react";
import { Mic, MicOff, X, MessageCircle } from "lucide-react";

export default function VoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Periodic attention pulse
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setPulseCount((c) => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleStart = useCallback(async () => {
    // Placeholder: replace with real ElevenLabs agent connection
    // Example:
    // const { data } = await supabase.functions.invoke("elevenlabs-conversation-token");
    // await conversation.startSession({ conversationToken: data.token, connectionType: "webrtc" });
    setIsConnected(true);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  }, []);

  const handleStop = useCallback(() => {
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Talk to Vaibhav's AI Agent"
        >
          {/* Outer glow rings */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--gradient-primary)" }} />
          <span className="absolute -inset-1 rounded-full opacity-30 blur-md" style={{ background: "var(--gradient-primary)" }} />

          {/* Main button */}
          <span
            className="relative flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full text-primary-foreground font-medium text-sm shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary-foreground/20 animate-pulse" />
              <Mic className="h-4 w-4 relative z-10" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs opacity-80">Talk to</span>
              <span className="font-semibold -mt-0.5">Vaibhav's AI</span>
            </span>
          </span>
        </button>
      )}

      {/* Voice agent panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                {isConnected && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">Vaibhav's AI Agent</p>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? (isSpeaking ? "Speaking..." : "Listening...") : "Ready to chat"}
                </p>
              </div>
            </div>
            <button
              onClick={() => { handleStop(); setIsOpen(false); }}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-8 flex flex-col items-center gap-6">
            {/* Visualizer */}
            <div className="relative h-28 w-28">
              {/* Rings */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`absolute inset-0 rounded-full border transition-all duration-700 ${
                    isConnected
                      ? "border-primary/40 animate-ping"
                      : "border-muted-foreground/10"
                  }`}
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: "2s",
                    transform: `scale(${1 + i * 0.15})`,
                  }}
                />
              ))}

              {/* Center mic button */}
              <button
                onClick={isConnected ? handleStop : handleStart}
                className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isConnected
                    ? "bg-red-500/90 hover:bg-red-500 shadow-lg shadow-red-500/30"
                    : "hover:scale-105 shadow-lg shadow-primary/30"
                }`}
                style={!isConnected ? { background: "var(--gradient-primary)" } : undefined}
              >
                {isConnected ? (
                  <MicOff className="h-8 w-8 text-primary-foreground" />
                ) : (
                  <Mic className="h-8 w-8 text-primary-foreground" />
                )}
              </button>
            </div>

            <p className="text-sm text-muted-foreground text-center max-w-[220px]">
              {isConnected
                ? "I'm listening! Ask me anything about Vaibhav's experience and projects."
                : "Tap the mic to start a voice conversation with my AI assistant."}
            </p>

            {/* Sound wave bars when connected */}
            {isConnected && (
              <div className="flex items-end gap-1 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-primary"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animation: `soundWave 0.8s ease-in-out ${i * 0.05}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3 bg-muted/30 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground text-center">
              Powered by AI · Ask about skills, experience & projects
            </p>
          </div>
        </div>
      )}
    </>
  );
}
