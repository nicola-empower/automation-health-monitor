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
    theme?: 'light' | 'dark';
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
    isProcessing = false,
    theme = 'dark'
}) => {
    const isLight = theme === 'light';

    const statusConfig = {
        nominal: {
            color: isLight ? 'text-[#003366]' : 'text-success',
            icon: ShieldCheck,
            borderColor: isLight ? 'border-[#003366]/20' : 'border-success/30',
            glow: isLight ? 'shadow-sm' : 'glow-success',
            label: 'System Nominal',
        },
        warning: {
            color: isLight ? 'text-warning' : 'text-warning',
            icon: Clock,
            borderColor: isLight ? 'border-warning/20' : 'border-warning/30',
            glow: isLight ? 'shadow-sm' : 'glow-warning',
            label: 'Silence Detected',
        },
        offline: {
            color: isLight ? 'text-error' : 'text-error',
            icon: AlertTriangle,
            borderColor: isLight ? 'border-error/20' : 'border-error/30',
            glow: isLight ? 'shadow-sm' : 'glow-error',
            label: 'System Failure',
        },
    };

    const { color, icon: Icon, borderColor, glow, label } = statusConfig[status];

    const cardBaseClasses = isLight
        ? "bg-white border shadow-sm p-6 rounded-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
        : "glass p-6 rounded-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden";

    const accentColor = isLight ? "text-[#003366]" : "text-primary";

    return (
        <div className={cn(
            cardBaseClasses,
            borderColor,
            status === 'offline' && isActive ? (isLight ? 'border-error/50' : 'glow-error-flicker') : (isActive ? glow : "opacity-60 grayscale shadow-none border-gray-100"),
            !isActive && "opacity-60 grayscale border-gray-100 shadow-none"
        )}>
            {status === 'offline' && isActive && !isLight && (
                <div className="absolute inset-0 bg-error/5 pointer-events-none animate-pulse" />
            )}

            <div className={cn(
                "flex justify-between items-start",
                status === 'offline' && isActive && !isLight && "animate-glitch"
            )}>
                <div className="space-y-1">
                    <p className={cn("text-[10px] font-mono uppercase tracking-wider", isLight ? "text-gray-400" : "text-muted-foreground")}>
                        {clientName || 'Automation Script'}
                    </p>
                    <h3 className={cn("text-xl font-semibold tracking-tight", isLight ? "text-gray-900" : "text-white")}>{name}</h3>
                </div>
                <div className={cn("p-2 rounded-lg", isLight ? "bg-gray-50" : "bg-white/5", isActive ? color : "text-gray-400")}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        !isActive ? "bg-gray-300" : (status === 'nominal' ? (isLight ? 'bg-[#003366]' : 'bg-success') : status === 'warning' ? 'bg-warning' : 'bg-error'),
                        isActive && "animate-pulse"
                    )} />
                    <span className={cn("text-sm font-medium", isActive ? color : "text-gray-400")}>
                        {isActive ? label : "OFFLINE (Disabled)"}
                    </span>
                </div>

                <div className={cn("flex items-center gap-2 text-sm font-mono", isLight ? "text-gray-500" : "text-muted-foreground")}>
                    <Clock size={14} />
                    <span>Last Ping: {lastPing}</span>
                </div>
            </div>

            {notes && isActive && (
                <div className={cn("mt-4 p-3 rounded-lg flex gap-3 items-start border", isLight ? "bg-gray-50 border-gray-100" : "bg-black/40 border-white/5")}>
                    <MessageSquare size={16} className={cn("mt-0.5 shrink-0", isLight ? "text-gray-400" : "text-muted-foreground")} />
                    <p className={cn("text-xs leading-relaxed", isLight ? "text-gray-600" : "text-muted-foreground")}>{notes}</p>
                </div>
            )}

            {/* Interactive Controls */}
            <div className={cn("mt-auto pt-6 flex items-center justify-between gap-3 border-t", isLight ? "border-gray-100" : "border-white/5")}>
                <div className="flex gap-2">
                    {onTrigger && (
                        <button
                            onClick={() => triggerUrl && onTrigger(triggerUrl)}
                            disabled={!isActive || !triggerUrl || isProcessing}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all",
                                !isActive || !triggerUrl
                                    ? (isLight ? "bg-gray-50 opacity-30 border-gray-100 cursor-not-allowed" : "bg-white/2 opacity-30 border-white/5 cursor-not-allowed")
                                    : (isLight
                                        ? "bg-blue-50 border-blue-100 text-[#003366] hover:bg-blue-100 hover:border-blue-200 active:scale-95"
                                        : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:scale-95")
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
                            ? (isLight
                                ? "bg-gray-50 border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-error"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-error/10 hover:border-error/30 hover:text-error")
                            : (isLight
                                ? "bg-green-50 border-green-200 text-success hover:bg-green-100"
                                : "bg-success/10 border-success/20 text-success hover:bg-success/20")
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
