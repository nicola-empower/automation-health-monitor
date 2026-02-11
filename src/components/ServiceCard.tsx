import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, ShieldCheck, Clock, MessageSquare, Rocket, Power, Loader2 } from 'lucide-react';

export type ServiceStatus = 'nominal' | 'warning' | 'offline';

interface ServiceCardProps {
    id: string;
    name: string;
    status: ServiceStatus;
    lastPing: string;
    notes?: string;
    clientName?: string;
    isActive?: boolean;
    triggerUrl?: string;
    onToggle?: (id: string) => void;
    onTrigger?: (url: string) => void;
    isProcessing?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
    id,
    name,
    status,
    lastPing,
    notes,
    clientName,
    isActive = true,
    triggerUrl,
    onToggle,
    onTrigger,
    isProcessing = false
}) => {
    const statusConfig = {
        nominal: {
            color: 'text-success',
            icon: ShieldCheck,
            borderColor: 'border-success/30',
            glow: 'glow-success',
            label: 'System Nominal',
        },
        warning: {
            color: 'text-warning',
            icon: Clock,
            borderColor: 'border-warning/30',
            glow: 'glow-warning',
            label: 'Silence Detected',
        },
        offline: {
            color: 'text-error',
            icon: AlertTriangle,
            borderColor: 'border-error/30',
            glow: 'glow-error',
            label: 'System Failure',
        },
    };

    const { color, icon: Icon, borderColor, glow, label } = statusConfig[status];

    return (
        <div className={cn(
            "glass p-6 rounded-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden",
            borderColor,
            status === 'offline' && isActive ? 'glow-error-flicker' : (isActive ? glow : "opacity-60 grayscale shadow-none border-white/5"),
            !isActive && "border-white/5 shadow-none"
        )}>
            {status === 'offline' && isActive && (
                <div className="absolute inset-0 bg-error/5 pointer-events-none animate-pulse" />
            )}

            <div className={cn(
                "flex justify-between items-start",
                status === 'offline' && isActive && "animate-glitch"
            )}>
                <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        {clientName || 'Automation Script'}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-white/5", isActive ? color : "text-muted-foreground")}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        !isActive ? "bg-muted-foreground/30" : (status === 'nominal' ? 'bg-success' : status === 'warning' ? 'bg-warning' : 'bg-error'),
                        isActive && "animate-pulse"
                    )} />
                    <span className={cn("text-sm font-medium", isActive ? color : "text-muted-foreground")}>
                        {isActive ? label : "OFFLINE (Disabled)"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Clock size={14} />
                    <span>Last Ping: {lastPing}</span>
                </div>
            </div>

            {notes && isActive && (
                <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                    <MessageSquare size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{notes}</p>
                </div>
            )}

            {/* Interactive Controls */}
            <div className="mt-auto pt-6 flex items-center justify-between gap-3 border-t border-white/5">
                <div className="flex gap-2">
                    {onTrigger && (
                        <button
                            onClick={() => triggerUrl && onTrigger(triggerUrl)}
                            disabled={!isActive || !triggerUrl || isProcessing}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all",
                                !isActive || !triggerUrl
                                    ? "bg-white/2 opacity-30 border-white/5 cursor-not-allowed"
                                    : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:scale-95"
                            )}
                            title={!triggerUrl ? "No trigger URL configured" : "Execute manual trigger"}
                        >
                            <Rocket size={12} className={cn(isProcessing && "animate-bounce")} />
                            MANUAL_VOICE
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onToggle && onToggle(id)}
                    disabled={isProcessing}
                    className={cn(
                        "p-2 rounded-lg border transition-all active:scale-95",
                        isActive
                            ? "bg-white/5 border-white/10 text-muted-foreground hover:bg-error/10 hover:border-error/30 hover:text-error"
                            : "bg-success/10 border-success/20 text-success hover:bg-success/20"
                    )}
                    title={isActive ? "Disable automation" : "Enable automation"}
                >
                    {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Power size={16} />
                    )}
                </button>
            </div>
        </div>
    );
};
