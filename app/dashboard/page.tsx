import MapView from "@/components/dashboard/map-view";
import Header from "@/components/home/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Building2, Ambulance, Activity, Zap, Clock, ShieldAlert, Map as MapIcon } from "lucide-react";

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: hospitals } = await supabase.from("hospitals").select("*");
    const { data: ambulances } = await supabase.from("ambulances").select("*");
    const { data: reroute_logs } = await supabase.from("reroute_logs").select("*");

    const kpiData = [
        {
            title: "Total Hospitals",
            value: hospitals?.length || 0,
            icon: <Building2 className="w-5 h-5 text-blue-500" />,
            description: "Registered ER centers",
            trend: "+2 this month"
        },
        {
            title: "Active Ambulances",
            value: ambulances?.length || 0,
            icon: <Ambulance className="w-5 h-5 text-emerald-500" />,
            description: "On-duty vehicles",
            trend: "All systems online"
        },
        // {
        //     title: "Grid Stress Level",
        //     value: "78%",
        //     icon: <Activity className="w-5 h-5 text-rose-500" />,
        //     description: "Current network load",
        //     trend: "+12% from avg"
        // },
        {
            title: "AI Reroutes",
            value: reroute_logs?.length || 0,
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            description: "Active trajectory changes",
            trend: "Optimizing 3 routes"
        }
    ];

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-950 font-sans">
            <Header />

            <section className="w-full px-4 md:px-8 py-6 md:py-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    {/* Header Details */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Command Center</h1>
                        <p className="text-neutral-400">Real-time healthcare grid management & emergency load balancing.</p>
                    </div>

                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {kpiData.map((kpi, idx) => (
                            <Card key={idx} className="bg-neutral-50 border-neutral-400 shadow-xl overflow-hidden relative group transition-all duration-300 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="p-3 rounded-xl bg-neutral-50 border shadow-inner">
                                            {kpi.icon}
                                        </div>
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 shadow-sm border border-neutral-700/50">
                                            {kpi.trend}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-3xl font-black tracking-tight drop-shadow-sm">{kpi.value}</h3>
                                        <p className="text-sm text-neutral-900 font-semibold">{kpi.title}</p>
                                        <p className="text-xs text-neutral-500">{kpi.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map View */}
                        <div className="lg:col-span-2 relative min-h-[500px] md:h-[650px] rounded-2xl overflow-hidden shadow-2xl flex flex-col group">
                            <div className="absolute top-4 left-4 z-[999] bg-neutral-100/80 backdrop-blur-md border border-neutral-800 p-3 rounded-xl shadow-lg">
                                <h2 className="text-sm font-semibold flex items-center gap-2 text-black">
                                    <MapIcon className="w-4 h-4 text-emerald-400" />
                                    Live Pulse Map
                                </h2>
                            </div>
                            <MapView hospitals={hospitals || []} ambulances={ambulances || []} />

                            {/* Decorative Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-1000 z-0" />
                        </div>

                        {/* Side Panel */}
                        <div className="flex flex-col gap-6">
                            {/* Anomalies Card */}
                            <Card className="bg-neutral-50 flex-1 shadow-xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-black">
                                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                                        Recent Anomalies
                                    </CardTitle>
                                    <CardDescription className="text-neutral-400">Detected by ArmorIQ</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { time: "2m ago", desc: "Spike in ER wait times at City General", severity: "high" },
                                            { time: "15m ago", desc: "Unusual rerouting pattern detected", severity: "med" },
                                            { time: "1h ago", desc: "Offline ambulance signal re-established", severity: "low" },
                                        ].map((alert, i) => (
                                            <div key={i} className="flex gap-3 items-start p-3 rounded-xl border border-neutral-800/20 bg-neutral-50/10 transition-colors">
                                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : alert.severity === 'med' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} />
                                                <div className="flex flex-col flex-1 gap-1">
                                                    <p className="text-sm leading-snug text-neutral-800">{alert.desc}</p>
                                                    <span className="text-xs text-neutral-500 font-medium">{alert.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-2 py-2 text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-lg border border-transparent hover:border-neutral-700">
                                        View Full Log
                                    </button>
                                </CardContent>
                            </Card>

                            {/* System Status Card */}
                            <Card className="bg-neutral-50 border-neutral-200 shadow-xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-black">
                                        <Clock className="w-5 h-5 text-blue-400" />
                                        System Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-400 font-medium">Avg. Offload Delay</span>
                                            <span className="font-bold text-rose-400">14m 30s</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 w-[65%] rounded-full relative">
                                                <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-400 font-medium">API Latency</span>
                                            <span className="font-bold text-emerald-400">42ms</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[15%] rounded-full relative">
                                                <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                            </div>
                                            <span className="text-sm font-medium text-blue-400">Balancing Engine</span>
                                        </div>
                                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md font-semibold">ONLINE</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}