"use client";

import { useState, useEffect } from "react";
import { Ambulance, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookAmbulanceButton({ ambulances }: { ambulances: any[] }) {
    const [status, setStatus] = useState<"idle" | "locating" | "booking" | "success">("idle");
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    // load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("ambulanceBooking");
        if (saved) {
            try {
                setBookingDetails(JSON.parse(saved));
                setStatus("success");
            } catch (e) { }
        }
    }, []);

    const handleBook = () => {
        setStatus("locating");

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setStatus("idle");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setStatus("booking");

                // Find nearest ambulance
                let nearest: any = null;
                let minDist = Infinity;

                if (ambulances && ambulances.length > 0) {
                    ambulances.forEach(a => {
                        const latDiff = latitude - (a.current_lat || 0);
                        const lngDiff = longitude - (a.current_lng || 0);
                        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

                        if (dist < minDist) {
                            minDist = dist;
                            nearest = a;
                        }
                    });
                }

                // fallback if no ambulances data available or parse failed
                if (!nearest) {
                    nearest = {
                        id: 'AMB-' + Math.floor(Math.random() * 900 + 100),
                        status: 'Dispatched'
                    };
                }

                setTimeout(() => {
                    const details = {
                        ambulance: nearest,
                        time: new Date().toISOString(),
                        eta: Math.floor(Math.random() * 10) + 3 + " mins" // mocked eta
                    };
                    localStorage.setItem("ambulanceBooking", JSON.stringify(details));
                    setBookingDetails(details);
                    setStatus("success");
                }, 2000); // fake network delay
            },
            (error) => {
                console.error("Error getting location", error);
                alert("Please enable location permissions to book an ambulance.");
                setStatus("idle");
            }
        );
    };

    return (
        <div className="w-full flex flex-col gap-3 mb-6 relative">
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.button
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={handleBook}
                        className="w-full relative group overflow-hidden rounded-2xl bg-rose-600 text-white font-bold py-5 px-6 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.8)] hover:shadow-[0_15px_50px_-5px_rgba(225,29,72,0.6)] transition-all duration-300 transform"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                        <div className="relative flex items-center justify-center gap-3">
                            <Ambulance className="w-7 h-7" />
                            <span className="text-xl tracking-wider uppercase font-black">Book Ambulance</span>
                        </div>
                    </motion.button>
                )}

                {status === "locating" && (
                    <motion.button
                        key="locating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        disabled
                        className="w-full relative rounded-2xl bg-neutral-900 border border-neutral-700 text-white font-medium py-5 px-6"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <MapPin className="w-6 h-6 animate-bounce text-emerald-400" />
                            <span className="text-lg">Locating nearby units...</span>
                        </div>
                    </motion.button>
                )}

                {status === "booking" && (
                    <motion.button
                        key="booking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        disabled
                        className="w-full relative rounded-2xl bg-indigo-600 text-white font-medium py-5 px-6 shadow-indigo-600/30 shadow-lg"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Dispatching nearest unit...</span>
                        </div>
                    </motion.button>
                )}

                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-5 shadow-xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 text-emerald-500 mb-4">
                            <CheckCircle2 className="w-7 h-7" />
                            <h3 className="font-black tracking-tight text-xl text-neutral-900">Emergency Unit Dispatched</h3>
                        </div>
                        {bookingDetails && (
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-neutral-500 text-sm">Assigned Unit</span>
                                    <span className="font-bold text-neutral-900 px-2.5 py-1 bg-neutral-100 rounded-md text-sm">
                                        {bookingDetails.ambulance?.id || 'AMB-01'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-neutral-500 text-sm">Est. Arrival Time</span>
                                    <span className="font-black text-rose-600 animate-pulse text-lg">
                                        {bookingDetails.eta}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-neutral-500 text-sm">Status</span>
                                    <div className="flex flex-row items-center gap-1.5">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                        <span className="font-semibold text-emerald-600 text-sm">En Route</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem("ambulanceBooking");
                                setStatus("idle");
                                setBookingDetails(null);
                            }}
                            className="w-full mt-4 py-3 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors bg-white hover:bg-neutral-50 rounded-xl border border-neutral-200 outline-none"
                        >
                            Cancel Request
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
