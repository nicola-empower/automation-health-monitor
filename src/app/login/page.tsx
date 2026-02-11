"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity, Shield, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Access Denied: Invalid Security Code");
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Activity className="text-primary" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Automation Health</h1>
                    <p className="text-sm text-muted-foreground font-mono mt-1 uppercase tracking-widest">Secure Terminal Access</p>
                </div>

                <div className="glass p-8 rounded-2xl border-white/5 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Shield size={16} />
                            <span className="text-xs font-mono uppercase font-bold tracking-tighter">Identity Verification Required</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This dashboard contains sensitive client data. Please enter your security protocol code to proceed.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="SECURITY CODE"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-[10px] text-error font-mono uppercase tracking-tight">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                                loading && "animate-pulse"
                            )}
                        >
                            {loading ? "AUTHENTICATING..." : "VERIFY ACCESS"}
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] opacity-50">
                        System monitored by Empower Security Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}
