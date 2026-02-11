"use client";

import { BarChart3, TrendingUp, DollarSign, Clock, MessageSquare, Target } from "lucide-react";

export function MarketingROI() {
    const stats = [
        { label: "Total Reach", value: "12,402", icon: Target, color: "text-primary" },
        { label: "Lead Conversion", value: "4.2%", icon: TrendingUp, color: "text-success" },
        { label: "Time Saved", value: "142h", icon: Clock, color: "text-warning" },
        { label: "Revenue Impact", value: "£8,450", icon: DollarSign, color: "text-brand-magenta" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-white">Marketing ROI</h2>
                    <p className="text-muted-foreground italic text-sm">Tracking social performance against business impact</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="text-primary" size={18} />
                        Template Performance
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: "The Zapier Trap", usage: 85, leads: 12 },
                            { name: "Bank Bot Autopsy", usage: 64, leads: 8 },
                            { name: "500 Invoices Hook", usage: 42, leads: 15 },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-white">{item.name}</span>
                                    <span className="text-muted-foreground">{item.leads} Leads</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${item.usage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center">
                    <MessageSquare className="text-brand-magenta mb-4 opacity-50" size={32} />
                    <h3 className="text-lg font-bold mb-2">Social Master Access</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mb-6 italic">
                        All templates from your SOCIAL_MASTER_COPY.md are synchronized here for one-click deployment.
                    </p>
                    <button
                        onClick={() => window.open('https://empowerautomation.co.uk/social-kit', '_blank')}
                        className="px-6 py-2 bg-brand-magenta/10 hover:bg-brand-magenta/20 text-brand-magenta rounded-xl text-xs font-bold border border-brand-magenta/20 transition-all"
                    >
                        OPEN_MASTER_LIBRARY
                    </button>
                </div>
            </div>
        </div>
    );
}
