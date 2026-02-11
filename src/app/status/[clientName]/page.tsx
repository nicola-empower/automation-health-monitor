"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { Activity, Shield, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ClientStatusPage() {
    const params = useParams();
    const clientName = params.clientName as string;
    const decodedClientName = decodeURIComponent(clientName);

    const [services, setServices] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());

        async function fetchServices() {
            try {
                const response = await fetch(`/api/services?client=${encodeURIComponent(decodedClientName)}`);
                if (response.ok) {
                    const data = await response.json();
                    setServices(data);
                } else {
                    console.error("Uplink Error");
                }
            } catch (error) {
                console.error("Connection Failed");
            } finally {
                setLoading(false);
            }
        }
        fetchServices();

        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, [decodedClientName]);

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
                            <h1 className="text-xl font-bold tracking-tight">System Status</h1>
                            <p className="text-xs font-mono text-muted-foreground uppercase opacity-70">Client Portal: {decodedClientName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
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
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{decodedClientName} Automations</h2>
                        <p className="text-muted-foreground italic truncate max-w-md">
                            {loading ? "Synchronizing secure uplink..." :
                                services && services.length > 0 ? "Real-time telemetry active." :
                                    "No active services found for this node."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-mono text-muted-foreground uppercase">Last Audit</p>
                            <p className="text-sm font-semibold">{currentTime || "--:--:--"}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="glass p-6 rounded-xl border-white/5 flex flex-col gap-4 animate-pulse">
                                <div className="h-6 w-3/4 bg-white/5 rounded" />
                                <div className="h-4 w-1/2 bg-white/5 rounded" />
                                <div className="h-20 w-full bg-white/5 rounded mt-4" />
                            </div>
                        ))
                    ) : services && services.length > 0 ? (
                        services.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))
                    ) : !loading && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <p className="text-muted-foreground font-mono uppercase tracking-widest">Scanning Protocols... 0 Nodes Found</p>
                            <p className="text-xs text-muted-foreground/60 mt-2 italic">Please contact support if you expect active heartbeats here.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-baseline gap-2 text-muted-foreground">
                        <span className="text-sm font-mono tracking-widest uppercase opacity-50">Managed by</span>
                        <a href="https://empowerautomation.co.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground font-bold flex items-center gap-1 transition-colors">
                            Empower Automation
                            <ExternalLink size={12} />
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono opacity-50">
                        &copy; {new Date().getFullYear()} Security Protocol V1.0.
                    </p>
                </div>
            </footer>
        </div>
    );
}
