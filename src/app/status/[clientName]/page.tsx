"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { Activity, Shield, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ClientStatusPage() {
    const params = useParams();
    const clientName = params.clientName as string;
    const decodedClientName = decodeURIComponent(clientName);

    const [services, setServices] = useState<any[] | null>(null);
    const [branding, setBranding] = useState<{ logo: string | null; theme: 'light' | 'dark' } | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());

        async function fetchServices() {
            try {
                const response = await fetch(`/api/services?client=${encodeURIComponent(decodedClientName)}`);
                if (response.ok) {
                    const data = await response.json();
                    setServices(data.services || []);
                    setBranding(data.branding || { logo: null, theme: 'dark' });
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

    const isLight = branding?.theme === 'light';

    return (
        <div className={cn(
            "min-h-screen selection:bg-primary/30 transition-all duration-700",
            isLight ? "bg-[#ffffff] text-slate-900" : "bg-background text-foreground"
        )}>
            {/* Header */}
            <header className={cn(
                "sticky top-0 z-50 border-b backdrop-blur-md transition-all",
                isLight ? "bg-white/80 border-gray-100" : "bg-black/50 border-white/5"
            )}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {branding?.logo ? (
                            <img src={branding.logo} alt={decodedClientName} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className={cn("p-2 rounded-lg border", isLight ? "bg-blue-50 border-blue-100" : "bg-primary/20 border-primary/20")}>
                                <Activity className={isLight ? "text-[#003366]" : "text-primary"} size={24} />
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">System Status</h1>
                            <p className={cn("text-[10px] font-mono uppercase opacity-70", isLight ? "text-gray-500" : "text-muted-foreground")}>
                                {decodedClientName} Portal
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase">
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", isLight ? "bg-[#003366]" : "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]")} />
                                <span className={isLight ? "text-gray-500" : "text-muted-foreground"}>Nominal</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full bg-warning", !isLight && "shadow-[0_0_8px_rgba(234,179,8,0.4)]")} />
                                <span className={isLight ? "text-gray-500" : "text-muted-foreground"}>Silence</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full bg-error", !isLight && "shadow-[0_0_8px_rgba(239,68,68,0.4)]")} />
                                <span className={isLight ? "text-gray-500" : "text-muted-foreground"}>Failure</span>
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
                        <p className={cn("italic truncate max-w-md", isLight ? "text-gray-500" : "text-muted-foreground")}>
                            {loading ? "Synchronizing secure uplink..." :
                                services && services.length > 0 ? "Real-time telemetry active." :
                                    "No active services found for this node."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className={cn("text-[10px] font-mono uppercase", isLight ? "text-gray-400" : "text-muted-foreground")}>Last Audit</p>
                            <p className="text-sm font-semibold">{currentTime || "--:--:--"}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className={cn("p-6 rounded-xl border flex flex-col gap-4 animate-pulse", isLight ? "bg-gray-50 border-gray-100" : "glass border-white/5")}>
                                <div className={cn("h-6 w-3/4 rounded", isLight ? "bg-gray-200" : "bg-white/5")} />
                                <div className={cn("h-4 w-1/2 rounded", isLight ? "bg-gray-200" : "bg-white/5")} />
                                <div className={cn("h-20 w-full rounded mt-4", isLight ? "bg-gray-200" : "bg-white/5")} />
                            </div>
                        ))
                    ) : services && services.length > 0 ? (
                        services.map((service, index) => (
                            <ServiceCard key={index} {...service} theme={branding?.theme || 'dark'} />
                        ))
                    ) : !loading && (
                        <div className={cn("col-span-full py-20 text-center border border-dashed rounded-2xl transition-colors", isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10")}>
                            <p className={cn("font-mono uppercase tracking-widest", isLight ? "text-gray-400" : "text-muted-foreground")}>Scanning Protocols... 0 Nodes Found</p>
                            <p className={cn("text-xs mt-2 italic", isLight ? "text-gray-400/60" : "text-muted-foreground/60")}>Please contact support if you expect active heartbeats here.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className={cn("border-t py-12 mt-20 transition-colors", isLight ? "bg-gray-50 border-gray-100" : "border-white/5")}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-baseline gap-2">
                        <span className={cn("text-[10px] font-mono tracking-widest uppercase opacity-50", isLight ? "text-gray-500" : "text-muted-foreground")}>Managed by</span>
                        <a href="https://empowerautomation.co.uk" target="_blank" rel="noopener noreferrer" className={cn("font-bold flex items-center gap-1 transition-colors", isLight ? "text-[#003366] hover:text-[#004e9c]" : "text-primary hover:text-primary-foreground")}>
                            Empower Automation
                            <ExternalLink size={12} />
                        </a>
                    </div>
                    <p className={cn("text-[10px] font-mono opacity-50 uppercase tracking-tighter", isLight ? "text-gray-500" : "text-muted-foreground")}>
                        &copy; {new Date().getFullYear()} Security Protocol V1.0.
                    </p>
                </div>
            </footer>
        </div>
    );
}
