"use client";

import dynamic from "next/dynamic";
import { LocateFixed } from "lucide-react";

// Dynamically import Map component to disable SSR for react-leaflet since Leaflet requires the \`window\` object
const Map = dynamic(() => import("./map"), {
    ssr: false,
    loading: () => (
        <div className="h-[450px] w-full rounded-lg bg-muted/60 animate-pulse flex flex-col items-center justify-center gap-2 border border-border">
            <LocateFixed className="w-8 h-8 text-muted-foreground animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Initializing Live Map...</span>
        </div>
    )
});

export default function MapView({ hospitals, ambulances }: { hospitals: any[], ambulances: any[] }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LocateFixed className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-semibold tracking-tight">Active Coverage Area</h2>
                    <p className="text-sm text-muted-foreground">Real-time status of associated hospitals and medical units</p>
                </div>
            </div> */}

            <Map hospitals={hospitals} ambulances={ambulances} />
        </div>
    )
}