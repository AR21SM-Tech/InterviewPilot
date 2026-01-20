"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Terminal,
  Cpu,
  Play,
  Sparkles,
  Mic,
  Brain,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const interviewTypes = [
    {
      id: "behavioral",
      title: "Behavioral",
      description: "Master the STAR method. Perfect your soft skills + leadership stories.",
      icon: <Mic className="w-6 h-6 text-blue-400" />,
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "hover:border-blue-500/50",
      stats: "25+ Questions"
    },
    {
      id: "technical",
      title: "Technical (DSA)",
      description: "Solve LeetCode-style problems verbally. Explain space/time complexity.",
      icon: <Code2 className="w-6 h-6 text-green-400" />,
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "hover:border-green-500/50",
      stats: "Blind 75 Covered"
    },
    {
      id: "system_design",
      title: "System Design",
      description: "Architect scalable systems. Discuss trade-offs, DBs, and caching.",
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50",
      stats: "Senior+ Level"
    },
  ];

  return (
    <main className="min-h-screen bg-black text-foreground relative overflow-hidden selection:bg-white/20 font-sans">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="font-semibold tracking-tight text-white group-hover:text-gray-200 transition-colors">
              InterviewPilot
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button size="sm" className="h-9 px-4 bg-white text-black hover:bg-zinc-200 transition-colors font-medium" asChild>
              <Link href="/interview">
                Start Practice
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            LiveKit Agents 1.0 support
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-white"
        >
          Ace Your Next <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            High-Stakes Interview.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          An AI coach that listens, evaluates, and challenges you.
          Practice behavioral stories, system design trade-offs, and algorithms
          with <span className="text-white font-medium">real-time voice feedback</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]" asChild>
            <Link href="#select-mode">
              Start Interview <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white transition-colors" asChild>
            <Link href="https://livekit.io" target="_blank">
              Powered by LiveKit
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Mode Selection Section */}
      <section id="select-mode" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Challenge</h2>
          <p className="text-zinc-400">Select an interview track to generate a specialized AI agent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviewTypes.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <Link href={`/interview?type=${type.id}`}>
                <div className={cn(
                  "group relative h-full rounded-3xl border border-white/5 bg-zinc-900/50 p-8 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden",
                  type.border
                )}>
                  {/* Hover Gradient Background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                    type.gradient
                  )} />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {type.icon}
                      </div>
                      <Badge variant="outline" className="bg-black/20 border-white/5 text-zinc-400">
                        {type.stats}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                      {type.title}
                    </h3>
                    <p className="text-zinc-400 mb-8 flex-grow leading-relaxed">
                      {type.description}
                    </p>

                    {/* Action */}
                    <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                      Begin Session <ChevronRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Grid (Bento) */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Engineering Precision</h2>
            <p className="text-zinc-400">Built for high-performance candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
            {/* Feature 1: Main */}
            <div className="col-span-1 md:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-black p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Real-Time Feedback</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                    Get graded against FAANG standards. Our agent uses RAG to retrieve context-aware rubrics (STAR, System Design) and evaluates your answers instantly.
                  </p>
                </div>

                {/* Mock Code Output */}
                <div className="mt-8 rounded-xl border border-white/10 bg-zinc-900/50 p-4 font-mono text-xs text-zinc-300 overflow-hidden">
                  <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <p className="text-green-400">{">"} Analyzing candidate response...</p>
                  <p className="text-zinc-500">[INFO] STAR method adherence: 85%</p>
                  <p className="text-zinc-500">[INFO] Technical depth: HIGH</p>
                  <p className="text-blue-400">{">"} Generating follow-up question...</p>
                </div>
              </div>
            </div>

            {/* Feature 2: Speed */}
            <div className="col-span-1 md:col-span-1 row-span-1 rounded-3xl border border-white/10 bg-zinc-900/20 p-6 flex flex-col justify-end group hover:border-white/20 transition-colors">
              <div className="mb-auto w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Natural Conversation</h3>
              <p className="text-sm text-zinc-400 py-1">
                Zero-lag voice interaction (300ms) with human-like turn-taking. It handles interruptions seamlessly.
              </p>
            </div>

            {/* Feature 3: Analytics */}
            <div className="col-span-1 md:col-span-1 row-span-1 rounded-3xl border border-white/10 bg-zinc-900/20 p-6 flex flex-col justify-end group hover:border-white/20 transition-colors">
              <div className="mb-auto w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Technical Deep Dives</h3>
              <p className="text-sm text-zinc-400">
                It probes your algorithmic thinking, challenges your Big O analysis, and asks about edge cases.
              </p>
            </div>

            {/* Feature 4 (Wide) */}
            <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl border border-white/10 bg-zinc-900/20 p-8 flex items-center justify-between group hover:border-white/20 transition-colors relative overflow-hidden">
              <div className="relative z-10 max-w-sm">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Deploy?</h3>
                <p className="text-zinc-400">Join thousands of engineers practicing for FAANG interviews.</p>
              </div>
              <div className="relative z-10">
                <Button variant="outline" className="rounded-full border-white/10 hover:bg-white hover:text-black transition-colors">
                  Start Now
                </Button>
              </div>
              {/* Decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-zinc-500">
            &copy; 2026 InterviewPilot. Engineered for excellence.
          </div>
          <div className="flex gap-8 text-sm font-medium text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
