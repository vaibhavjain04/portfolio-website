import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Send, Volume2, VolumeX, MessageCircle, ChevronDown, AudioLines } from "lucide-react";
import { GROQ_API_URL, GROQ_API_KEY, GROQ_MODEL, SYSTEM_PROMPT } from "@/constants/aiAgent";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;
const speechSupported = !!SpeechRecognitionAPI && !isIOS;

type AgentStatus = "idle" | "listening" | "thinking" | "speaking";

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm Vaibhav's AI. Ask me anything about his work, skills, or experience!",
      time: getTime(),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const status: AgentStatus = isListening
    ? "listening"
    : isTyping
    ? "thinking"
    : isSpeaking
    ? "speaking"
    : "idle";

  // Auto-scroll chat
  useEffect(() => {
    if (chatExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory.length, chatExpanded]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang === "en-IN" ||
          v.name.includes("Rishi") ||
          v.name.includes("Veena") ||
          v.name.includes("Google")
      );
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const addMessage = useCallback((msg: Omit<ChatMessage, "time">) => {
    setChatHistory((prev) => [...prev, { ...msg, time: getTime() }]);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      addMessage({ role: "user", content: text.trim() });
      setInputText("");
      setInterimText("");
      setIsTyping(true);

      if (!GROQ_API_KEY) {
        setIsTyping(false);
        addMessage({
          role: "assistant",
          content: "AI is not configured yet. Please add the GROQ API key.",
        });
        return;
      }

      const recentHistory = chatHistory.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const messages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...recentHistory,
        { role: "user" as const, content: text.trim() },
      ];

      try {
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            max_tokens: 120,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        const reply =
          data.choices?.[0]?.message?.content ??
          "Sorry, I couldn't process that. Try again!";

        setIsTyping(false);
        addMessage({ role: "assistant", content: reply });
        speakText(reply);
      } catch {
        setIsTyping(false);
        addMessage({
          role: "assistant",
          content: "Sorry, I couldn't connect right now. Please try again!",
        });
      }
    },
    [chatHistory, addMessage, speakText]
  );

  const toggleListening = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
      setInterimText("");
      return;
    }

    if (!speechSupported) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) {
        setInterimText("");
        handleSendMessage(final);
      } else {
        setInterimText(interim);
      }
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setInterimText("");
      if (event.error !== "aborted") {
        addMessage({ role: "assistant", content: "Could not hear you, try again." });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, handleSendMessage, addMessage]);

  const handleMuteToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted((m) => !m);
  };

  const statusText: Record<AgentStatus, string> = {
    idle: "Tap the mic to ask something",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
  };

  return (
    <>
      {/* Floating trigger — 60×60 circle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Talk to Vaibhav's AI Agent"
        >
          <span
            className={`absolute inset-0 rounded-full opacity-20 ${
              status === "listening"
                ? "bg-destructive animate-ping"
                : status === "speaking"
                ? "animate-ping"
                : "animate-pulse"
            }`}
            style={status !== "listening" ? { background: "var(--gradient-primary)" } : undefined}
          />
          <span
            className="absolute -inset-1 rounded-full opacity-30 blur-md"
            style={{ background: "var(--gradient-primary)" }}
          />
          <span
            className="relative flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full text-primary-foreground font-medium text-sm shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary-foreground/20 animate-pulse" />
              <AudioLines className="h-4 w-4 relative z-10" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs opacity-80">Talk to</span>
              <span className="font-semibold -mt-0.5">Vaibhav's AI</span>
            </span>
          </span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed z-50 bottom-8 right-8 w-[360px] max-sm:w-[92vw] max-sm:right-[4vw] max-sm:bottom-0 max-sm:rounded-t-2xl max-sm:rounded-b-none rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 flex flex-col animate-agent-slide-up" style={{ maxHeight: "85vh" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <MessageCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <p className="font-display font-semibold text-sm text-foreground">
                Ask Vaibhav's AI
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMuteToggle}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Voice visual area */}
          <div className="flex flex-col items-center gap-5 px-5 py-7 shrink-0">
            {/* Animated circle */}
            <div className="relative h-20 w-20">
              {/* Ripple rings for listening */}
              {status === "listening" && [0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping"
                  style={{ animationDelay: `${i * 0.3}s`, animationDuration: "1.8s" }}
                />
              ))}

              <div
                className={`relative h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                  status === "listening"
                    ? "bg-destructive/20 border-2 border-destructive shadow-lg shadow-destructive/20 animate-agent-breathe"
                    : status === "thinking"
                    ? "border-2 border-muted-foreground/30"
                    : status === "speaking"
                    ? "border-2 border-primary/50 shadow-lg shadow-primary/20"
                    : "border-2 border-border animate-agent-soft-pulse"
                }`}
                style={
                  status === "idle" || status === "speaking"
                    ? { background: "var(--gradient-primary)", opacity: status === "idle" ? 0.15 : 0.25 }
                    : undefined
                }
              >
                {status === "idle" && (
                  <Mic className="h-8 w-8 text-muted-foreground" />
                )}
                {status === "listening" && (
                  <Mic className="h-8 w-8 text-destructive animate-pulse" />
                )}
                {status === "thinking" && (
                  <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/40 border-t-primary animate-spin" />
                )}
                {status === "speaking" && (
                  <div className="flex items-end gap-[3px] h-7">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full bg-primary"
                        style={{
                          animation: `soundWave 0.7s ease-in-out ${i * 0.08}s infinite alternate`,
                          height: "30%",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interim text or status */}
            <p className="text-sm text-muted-foreground text-center min-h-[20px]">
              {interimText ? (
                <span className="italic text-foreground/60">"{interimText}"</span>
              ) : (
                statusText[status]
              )}
            </p>

            {/* Big mic button */}
            {speechSupported && (
              <button
                onClick={toggleListening}
                className={`h-14 max-sm:min-h-[56px] px-8 rounded-full flex items-center justify-center gap-2.5 font-medium text-sm transition-all duration-300 ${
                  isListening
                    ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 animate-pulse"
                    : "text-primary-foreground hover:scale-105 shadow-lg shadow-primary/30"
                }`}
                style={!isListening ? { background: "var(--gradient-primary)" } : undefined}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Tap to Speak
                  </>
                )}
              </button>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground">or type</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Text input */}
            {!speechSupported && (
              <p className="text-[10px] text-muted-foreground">
                Voice not supported — type below
              </p>
            )}
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat history — collapsible */}
          <div className="border-t border-border/50 shrink-0">
            <button
              onClick={() => setChatExpanded((v) => !v)}
              className="flex items-center justify-between w-full px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Chat History ({chatHistory.length})</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${chatExpanded ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                chatExpanded ? "max-h-[200px] max-sm:max-h-[160px]" : "max-h-0"
              }`}
            >
              <div
                className="h-[200px] max-sm:h-[160px] overflow-y-auto overflow-x-hidden px-4 pb-3 space-y-2 agent-chat-scroll"
              >
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span
                        className={`text-[10px] block mt-0.5 ${
                          msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3.5 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                          style={{ animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
