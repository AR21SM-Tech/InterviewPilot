"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useConnectionState,
    useParticipants,
    useLocalParticipant,
    ControlBar,
    useTracks
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Mic,
    MicOff,
    PhoneOff,
    Settings,
    ChevronLeft,
    Sparkles,
    Timer,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function InterviewSession() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get("type") || "Behavioral";
    const roomState = useConnectionState();
    const isConnected = roomState === ConnectionState.Connected;

    // Timer calculation
    const [elapsedTime, setElapsedTime] = useState(0);
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Agent Listening State Logic
    const { participants } = useParticipants();
    const { localParticipant } = useLocalParticipant();
    const agent = participants.find(p => !p.isLocal); // Assume the other person is the agent

    // We visualize "Speaking" when the AGENT is speaking
    const isAgentSpeaking = agent?.isSpeaking || false;

    // We visualize "Listening" (ripples) when WE are speaking
    const isUserSpeaking = localParticipant.isSpeaking;

    // Control Local Mic
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    useEffect(() => {
        if (localParticipant) {
            localParticipant.setMicrophoneEnabled(isMicEnabled);
        }
    }, [localParticipant, isMicEnabled]);

    const toggleMic = () => setIsMicEnabled(!isMicEnabled);

    // Mock Transcript (LiveKit transcription is advanced, we'll keep the mock/placeholder or implement later)
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: `Hello! I'm your AI coach for this ${type} interview. I'm connecting to the neural core. Ready?` }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans">
            <RoomAudioRenderer />

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full opacity-30" />
            </div>

            {/* Header */}
            <header className="absolute top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-sm h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-white hover:bg-white/5">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-white">Interview Session</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-[10px]">{type.toUpperCase()} INTERVIEW</Badge>
                            <span className={cn("text-[10px] font-mono", isConnected ? "text-green-500" : "text-yellow-500")}>
                                • {roomState}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-black/40 border-white/10 px-3 py-1 font-mono text-zinc-400">
                        {formatTime(elapsedTime)}
                    </Badge>
                </div>
            </header>

            {/* Main Grid */}
            <main className="relative z-10 pt-24 pb-32 px-6 h-screen flex flex-col md:grid md:grid-cols-12 gap-6 overflow-hidden">
                {/* Left Panel */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
                    <Card className="bg-zinc-900/80 border-white/10 shrink-0">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                Performance Score
                                <span className={cn("text-xs px-2 py-0.5 rounded-full bg-white/5", isConnected ? "text-green-400" : "text-zinc-500")}>
                                    LIVE
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">8.5</span>
                                <span className="text-xl text-muted-foreground mb-1">/ 10</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: "85%" }} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 border-white/10 flex-1 flex flex-col min-h-0">
                        <CardHeader className="py-3 border-b border-white/5 shrink-0">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                                <Sparkles className="w-4 h-4 text-zinc-400" /> Live Transcript
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-4">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={cn("flex gap-3 text-sm leading-relaxed", msg.role === 'ai' ? "text-zinc-400" : "text-white font-medium")}>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Center - Visualizer */}
                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-center relative h-full min-h-0">
                    <div className="relative flex items-center justify-center w-full h-full max-h-[600px] perspective-1000">

                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full opacity-20" />

                        {/* Outer Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[400px] h-[400px] border border-white/5 rounded-full border-dashed opacity-30"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[350px] h-[350px] border border-white/5 rounded-full opacity-30"
                        />

                        {/* Ripples when User is Speaking (Listening Mode) */}
                        <AnimatePresence>
                            {isUserSpeaking && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                            className="absolute w-[200px] h-[200px] rounded-full border border-green-500/30"
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Core Orb */}
                        <div className="relative z-20">
                            {/* Glow */}
                            <motion.div
                                animate={{
                                    scale: isAgentSpeaking ? [1, 1.1, 1] : 1,
                                    filter: isAgentSpeaking ? "blur(30px)" : "blur(10px)",
                                }}
                                className={cn(
                                    "absolute inset-0 rounded-full bg-gradient-to-r blur-xl transition-colors duration-500",
                                    isAgentSpeaking ? "from-purple-500/60 to-indigo-500/60" : "from-green-500/30 to-emerald-500/30"
                                )}
                            />
                            {/* Sphere */}
                            <motion.div
                                animate={{
                                    scale: isAgentSpeaking ? [0.95, 1.05, 0.95] : 1,
                                }}
                                className={cn(
                                    "w-48 h-48 rounded-full bg-black border flex items-center justify-center relative overflow-hidden backdrop-blur-3xl shadow-2xl transition-all duration-500",
                                    isAgentSpeaking ? "border-purple-500/50" : "border-green-500/30"
                                )}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20" />
                                <div className="relative z-10 text-center">
                                    <div className={cn("w-3 h-3 rounded-full mx-auto mb-2 transition-colors", isConnected ? "bg-green-500" : "bg-red-500")} />
                                    <span className="text-xs font-mono text-white/50 uppercase tracking-widest">{isConnected ? "ONLINE" : "CONNECTING"}</span>
                                </div>
                            </motion.div>
                        </div>

                        <div className="absolute bottom-12 text-center z-20">
                            <h3 className="text-2xl font-bold tracking-tight mb-1 text-white">
                                {isAgentSpeaking ? "Alex is speaking..." : (isUserSpeaking ? "Listening..." : "Alex is ready")}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="col-span-12 lg:col-span-3">
                    <Tabs defaultValue="tips" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/10">
                            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
                            <TabsTrigger value="context">Context</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tips" className="mt-4">
                            <Card className="bg-zinc-900/60 border-white/5"><CardContent className="p-4"><p className="text-sm text-zinc-400">Speak clearly and use the STAR method.</p></CardContent></Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Controls */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center z-50">
                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-4 flex items-center gap-4 shadow-2xl">
                    <div className="flex items-center gap-2 mr-2">
                        <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                        <span className="text-xs text-zinc-400 hidden sm:block">Voice Connected</span>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <Button
                        variant={isMicEnabled ? "secondary" : "destructive"}
                        size="icon"
                        className="rounded-full w-10 h-10"
                        onClick={toggleMic}
                    >
                        {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="destructive" className="rounded-full" onClick={() => router.push('/')}>
                        End Session
                    </Button>
                </div>
            </div>
        </div>
    );
}

function InterviewPageContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "Behavioral";
    const [token, setToken] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/api/token?interviewType=${type}&roomName=room-${Math.random().toString(36).substring(7)}`);
                if (!resp.ok) {
                    const txt = await resp.text();
                    throw new Error(`Token Server Error: ${resp.status} - ${txt}`);
                }
                const data = await resp.json();
                setToken(data.token);
                setUrl(data.url);
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Connection Failed");
            }
        })();
    }, [type]);

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-4 font-mono p-4 text-center">
                <AlertCircle className="w-12 h-12 mb-2" />
                <h2 className="text-lg font-bold text-white">Connection Error</h2>
                <p className="text-sm border border-red-500/20 bg-red-500/10 p-4 rounded">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Retry Secure Handshake</Button>
            </div>
        );
    }

    if (!token) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-sm animate-pulse">Initializing Secure Handshake...</div>;
    }

    return (
        <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
            video={false}
            data-lk-theme="default"
        >
            <InterviewSession />
        </LiveKitRoom>
    );
}

export default function InterviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
                Loading Interface...
            </div>
        }>
            <InterviewPageContent />
        </Suspense>
    );
}
