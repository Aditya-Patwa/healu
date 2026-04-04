import Header from "@/components/home/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function HospitalsPage() {
    const supabase = await createClient();

    // Fetch hospitals from Supabase
    const { data: hospitals, error } = await supabase.from("hospitals").select("*");

    return (
        <main className="min-h-screen bg-white text-black">
            <Header />

            <section className="w-full grid px-4 md:px-8 py-6 md:py-8">
                <div className="max-w-7xl w-full justify-self-center space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Hospitals Directory</h1>
                        <p className="text-zinc-400 mt-2">Manage and view all registered healthcare facilities in the network.</p>
                    </div>

                    {error ? (
                        <div className="p-4 border border-red-500/50 bg-red-500/10 rounded-lg text-red-400">
                            Failed to load hospitals: {error.message}
                        </div>
                    ) : !hospitals || hospitals.length === 0 ? (
                        <div className="p-12 text-center border border-zinc-800 rounded-lg text-zinc-400">
                            No hospitals found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hospitals.map((hospital) => (
                                <Card key={hospital.id} className="bg-zinc-50 border-zinc-100 shadow-xl hover:border-zinc-300 transition duration-300">
                                    <CardHeader className="pb-3 border-b border-zinc-100">
                                        <CardTitle className="text-lg text-emerald-400">
                                            {hospital.name || `Hospital #${hospital.id}`}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        {/* Dynamically render properties since we don't strictly know the schema */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            {Object.entries(hospital).map(([key, value]) => {
                                                // Skip id and very long generic fields
                                                if (key === 'id') return null;
                                                // Handle objects nicely if present
                                                const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

                                                return (
                                                    <div key={key} className="flex flex-col">
                                                        <span className="text-zinc-400 text-xs uppercase font-medium">{key.replace(/_/g, ' ')}</span>
                                                        <span className="text-zinc-800 truncate" title={displayValue}>{displayValue || 'N/A'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
