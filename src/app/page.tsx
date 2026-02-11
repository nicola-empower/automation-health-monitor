"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { calculateStatus, formatTimeAgo } from "@/lib/status-logic";
import { Activity, Shield, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Home() {
  const [services, setServices] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());

    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          const errorText = await response.text();
          console.error("Uplink Error:", errorText);
        }
      } catch (error) {
        console.error("Connection Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Mock data as fallback
  const mockServices = [
    {
      name: "Shopify Sync Engine",
      status: "nominal" as const,
      lastPing: "12 mins ago",
      clientName: "Oak & Chisel",
      notes: "All synchronization processes are running optimally."
    },
    {
      name: "Email Follow-up Bot",
      status: "warning" as const,
      lastPing: "26 hours ago",
      clientName: "Empower Admin",
      notes: "No heartbeat detected in over 24 hours. Verification required."
    },
    {
      name: "Lead Scraper Pro",
      status: "offline" as const,
      lastPing: "3 days ago",
      clientName: "Global Tech",
      notes: "API quota exceeded. Script halted."
    }
  ];

  const displayServices = services || (loading ? null : mockServices);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/20">
              <Activity className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Automation Health</h1>
              <p className="text-xs font-mono text-muted-foreground uppercase opacity-70">Monitor Center v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-mono border-r border-white/10 pr-6 mr-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-muted-foreground">Nominal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-muted-foreground">Silence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                <span className="text-muted-foreground">Failure</span>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="group flex items-center gap-2 bg-white/5 hover:bg-error/10 px-4 py-2 rounded-lg text-xs font-mono border border-white/10 hover:border-error/30 transition-all text-muted-foreground hover:text-error"
            >
              <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
              TERMINATE_SESSION
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Systems Status</h2>
            <p className="text-muted-foreground italic">
              {services ? "Live telemetry synchronized" : loading ? "Synchronizing uplink..." : "Interface Preview (Demo Mode)"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-mono text-muted-foreground uppercase">Current Audit Time</p>
              <p className="text-sm font-semibold">{currentTime || "--:--:--"}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices ? (
            displayServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass p-6 rounded-xl border-white/5 flex flex-col gap-4 animate-pulse">
                <div className="h-6 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="h-20 w-full bg-white/5 rounded mt-4" />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground grayscale opacity-50">
            <Shield size={18} />
            <span className="text-sm font-mono tracking-widest uppercase">Empower Security Protocol</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} Automation Health Dashboard.
          </p>
        </div>
      </footer>
    </div>
  );
}
