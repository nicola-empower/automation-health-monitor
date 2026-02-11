"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { LeadsMonitor } from "@/components/LeadsMonitor";
import { MarketingROI } from "@/components/MarketingROI";
import { SiteManager } from "@/components/SiteManager";
import { Activity, Shield, LogOut, Users, BarChart3, Settings2, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

type Tab = 'health' | 'leads' | 'marketing' | 'config';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('health');
  const [services, setServices] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  async function fetchServices() {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(Array.isArray(data) ? data : data.services);
      }
    } catch (error) {
      console.error("Connection Failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    if (activeTab === 'health') fetchServices();
  }, [activeTab]);

  const handleToggle = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch('/api/services/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: id, action: 'toggle' })
      });
      if (response.ok) await fetchServices();
    } finally {
      setProcessingId(null);
    }
  };

  const handleTrigger = async (url: string) => {
    try {
      await fetch(url, { mode: 'no-cors' });
      alert("Trigger Sent");
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all border ${activeTab === id
          ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
          : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5"
        }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/20">
              <Activity className="text-primary" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Business OS</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase opacity-70 tracking-tighter">Unified Command Center</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <NavItem id="health" label="HEALTH" icon={Activity} />
            <NavItem id="leads" label="LEADS" icon={Users} />
            <NavItem id="marketing" label="MARKETING" icon={BarChart3} />
            <NavItem id="config" label="SITE_MGR" icon={Settings2} />
          </nav>

          <button
            onClick={() => signOut()}
            className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-error/10 px-4 py-3 rounded-lg text-xs font-mono border border-white/10 hover:border-error/30 transition-all text-muted-foreground hover:text-error"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'health' && (
          <>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Systems Status</h2>
                <p className="text-muted-foreground italic text-sm">Live telemetry synchronized from distributed nodes</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-mono text-muted-foreground uppercase">Last Audit</p>
                <p className="text-sm font-semibold">{currentTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services ? (
                services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    {...service}
                    lastPing={service.lastPingFormatted || service.lastPing}
                    onToggle={handleToggle}
                    onTrigger={handleTrigger}
                    isProcessing={processingId === service.id}
                  />
                ))
              ) : (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass p-6 rounded-xl border-white/5 flex flex-col gap-4 animate-pulse">
                    <div className="h-6 w-3/4 bg-white/5 rounded" />
                    <div className="h-20 w-full bg-white/5 rounded mt-4" />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'leads' && <LeadsMonitor />}
        {activeTab === 'marketing' && <MarketingROI />}
        {activeTab === 'config' && <SiteManager />}
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground grayscale opacity-30">
            <Globe size={16} />
            <span className="text-xs font-mono tracking-widest uppercase">Empower Unified Network</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono opacity-50">
            &copy; {new Date().getFullYear()} EMPOWER AUTOMATION | COMMAND CENTER V2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
