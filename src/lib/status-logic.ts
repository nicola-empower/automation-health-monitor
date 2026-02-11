import { ServiceStatus } from "@/components/ServiceCard";

export interface ServiceData {
    id: string;
    name: string;
    client: string;
    status: string;
    lastPing: string;
    notes: string;
    scheduleHours: number;
}

export function calculateStatus(lastPing: string, scheduleHours: number, reportedStatus?: string): ServiceStatus {
    if (!lastPing) return 'offline';

    const lastPingDate = new Date(lastPing);
    const now = new Date();
    const diffInHours = (now.getTime() - lastPingDate.getTime()) / (1000 * 60 * 60);

    // 1. Check for explicit error/warning reported by the script
    if (reportedStatus?.toLowerCase() === 'error' || reportedStatus?.toLowerCase() === 'failure') {
        return 'offline';
    }
    if (reportedStatus?.toLowerCase() === 'warning') {
        return 'warning';
    }

    // 2. Fallback to time-based status
    if (diffInHours > scheduleHours * 1.2) { // 20% buffer
        return 'offline';
    }

    if (diffInHours > scheduleHours) {
        return 'warning';
    }

    return 'nominal';
}

export function formatTimeAgo(dateString: string): string {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}
