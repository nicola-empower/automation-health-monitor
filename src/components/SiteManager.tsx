"use client";

import { useEffect, useState } from "react";
import { Save, Globe, Info, AlertTriangle, RefreshCw } from "lucide-react";

export function SiteManager() {
    const [config, setConfig] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const response = await fetch('/api/config');
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (response.ok) alert("Site Configuration Synchronized!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-white">Site Manager</h2>
                    <p className="text-muted-foreground italic text-sm">Remote control for your main website assets</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-2.5 rounded-xl border border-primary/20 transition-all font-bold text-xs"
                >
                    {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                    {saving ? "SYNCHRONIZING..." : "SAVE_CHANGES"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-xs text-yellow-200/50 italic">
                        <Info size={16} className="shrink-0" />
                        <p>Changes saved here will reflect on the main Astro site upon the next data fetch.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest pl-1">Primary_Contact_Email</label>
                            <input
                                value={config.contact_email || ""}
                                onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 transition-all outline-none"
                                placeholder="hello@empowerautomation.co.uk"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest pl-1">Hero_Marquee_Text</label>
                            <textarea
                                value={config.marquee_text || ""}
                                onChange={(e) => setConfig({ ...config, marquee_text: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 transition-all outline-none h-24 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest pl-1">Hourly_Rate_Placeholder</label>
                            <input
                                value={config.hourly_rate || ""}
                                onChange={(e) => setConfig({ ...config, hourly_rate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <Globe size={18} />
                            <h3 className="font-bold">Astro Uplink Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-xs text-muted-foreground font-mono">Status</span>
                                <span className="text-xs font-bold text-success uppercase">Active</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-xs text-muted-foreground font-mono">API_Key_Security</span>
                                <span className="text-xs font-bold text-warning uppercase">V2_Encrypted</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-error/5 border border-error/20 rounded-xl flex gap-3 text-[10px] text-error">
                        <AlertTriangle size={14} className="shrink-0" />
                        <p>Extreme Caution: Modifying site config affects production assets directly. Double-check all values before synchronizing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
