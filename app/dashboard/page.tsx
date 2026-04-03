import MapView from "@/components/dashboard/map-view";
import Header from "@/components/home/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

const kpis = [1, 2, 3, 4];

function KPIsCards() {
    return (
        kpis.map((i) =>
            <Card key={i} size="sm">
                <CardHeader>
                    <CardTitle>No. Of Hospitals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-semibold">123</p>
                </CardContent>
            </Card>
        )
    )
}

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: hospitals } = await supabase.from("hospitals").select("*");
    const { data: ambulances } = await supabase.from("ambulances").select("*");


    return (
        <main>
            <Header />

            <section className="w-full grid px-4 md:px-8 py-6 md:py-8">
                <div className="max-w-7xl w-full justify-self-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPIsCards />
                        <div className="md:col-span-2 lg:col-span-3">
                            <MapView hospitals={hospitals || []} ambulances={ambulances || []} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}