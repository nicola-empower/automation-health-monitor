import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, ShieldCheck, Clock, MessageSquare } from 'lucide-react';

export type ServiceStatus = 'nominal' | 'warning' | 'offline';

interface ServiceCardProps {
    name: string;
    status: ServiceStatus;
    lastPing: string;
    notes?: string;
    clientName?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
    name,
    status,
    lastPing,
    notes,
    clientName
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
            "glass glass-hover p-6 rounded-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden",
            borderColor,
            status === 'offline' ? 'glow-error-flicker' : glow
        )}>
            {status === 'offline' && (
                <div className="absolute inset-0 bg-error/5 pointer-events-none animate-pulse" />
            )}
            <div className={cn(
                "flex justify-between items-start",
                status === 'offline' && "animate-glitch"
            )}>
                <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        {clientName || 'Automation Script'}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-white/5", color)}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", status === 'nominal' ? 'bg-success' : status === 'warning' ? 'bg-warning' : 'bg-error')} />
                    <span className={cn("text-sm font-medium", color)}>{label}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Clock size={14} />
                    <span>Last Ping: {lastPing}</span>
                </div>
            </div>

            {notes && (
                <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                    <MessageSquare size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{notes}</p>
                </div>
            )}
        </div>
    );
};
