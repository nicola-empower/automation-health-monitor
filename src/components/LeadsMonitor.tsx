"use client";

import { useEffect, useState } from "react";
import { Mail, Briefcase, Calendar, Search, Filter } from "lucide-react";

export function LeadsMonitor() {
    const [leads, setLeads] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeads() {
            try {
                const response = await fetch('/api/leads');
                if (response.ok) {
                    const data = await response.json();
                    setLeads(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-white">Lead Intelligence</h2>
                    <p className="text-muted-foreground italic text-sm">Real-time prospect tracking & technical audit logs</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-muted-foreground">
                        <Filter size={12} />
                        <span>FILTER_BY: RECENT</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass p-6 rounded-xl border-white/5 h-24 animate-pulse" />
                    ))
                ) : leads && leads.length > 0 ? (
                    leads.map((lead, i) => (
                        <div key={i} className="group glass p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="font-bold">{lead.name?.[0]}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{lead.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Mail size={12} /> {lead.email}</span>
                                        <span className="flex items-center gap-1.5"><Briefcase size={12} /> {lead.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    <Calendar size={10} />
                                    <span>{new Date(lead.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase">
                                    Status: New Lead
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-muted-foreground font-mono text-sm tracking-widest">NO_LEADS_DETECTED_IN_ORBIT</p>
                    </div>
                )}
            </div>
        </div>
    );
}
