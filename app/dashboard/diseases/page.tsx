'use client'

import { useState, useRef, useEffect } from "react";
import Header from "@/components/home/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, SendIcon, User, Bot, Activity, Thermometer, HeartPulse } from "lucide-react";
import { useChat } from "@ai-sdk/react";

const DUMMY_DISEASES = [
    {
        id: "d1",
        name: "COVID-19",
        description: "An infectious disease caused by the SARS-CoV-2 virus.",
        symptoms: ["Fever", "Cough", "Fatigue", "Loss of taste or smell"],
        severity: "High (Can be severe)",
        causes: "Exposure to infected respiratory droplets",
        icon: <Activity className="w-5 h-5 text-red-500" />
    },
    {
        id: "d2",
        name: "Type 2 Diabetes",
        description: "A chronic condition that affects the way the body processes blood sugar (glucose).",
        symptoms: ["Increased thirst", "Frequent urination", "Increased hunger", "Fatigue"],
        severity: "Medium (Requires ongoing management)",
        causes: "Insulin resistance, obesity, genetics",
        icon: <Activity className="w-5 h-5 text-orange-500" />
    },
    {
        id: "d3",
        name: "Hypertension",
        description: "A condition in which the blood pressure in the arteries is persistently elevated.",
        symptoms: ["Headaches", "Shortness of breath", "Nosebleeds (Rarely, mostly asymptomatic)"],
        severity: "Medium (Risk factor for heart disease)",
        causes: "Genetics, poor diet, lack of exercise",
        icon: <HeartPulse className="w-5 h-5 text-rose-500" />
    },
    {
        id: "d4",
        name: "Asthma",
        description: "A condition in which your airways narrow and swell and may produce extra mucus.",
        symptoms: ["Shortness of breath", "Chest tightness or pain", "Wheezing when exhaling"],
        severity: "Medium to High (Depends on flare-ups)",
        causes: "Allergies, respiratory infections, environmental factors",
        icon: <Activity className="w-5 h-5 text-blue-500" />
    },
    {
        id: "d5",
        name: "Influenza (Flu)",
        description: "A viral infection that attacks your respiratory system — your nose, throat and lungs.",
        symptoms: ["Fever", "Muscle aches", "Chills and sweats", "Dry, persistent cough"],
        severity: "Low to Medium",
        causes: "Influenza viruses spread via droplets",
        icon: <Thermometer className="w-5 h-5 text-yellow-500" />
    }
];

export default function DiseasesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDisease, setSelectedDisease] = useState(DUMMY_DISEASES[0]);

    // Chatbot state
    const { messages, sendMessage } = useChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    const filteredDiseases = DUMMY_DISEASES.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-zinc-50/50 text-black flex flex-col">
            <Header />

            <section className="flex-1 w-full flex flex-col lg:flex-row px-4 md:px-8 py-6 md:py-8 gap-6 max-w-[1400px] mx-auto">
                {/* Left Side - Diseases Info (60%) */}
                <div className="w-full lg:w-3/5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Disease Directory</h1>
                        <p className="text-zinc-500 mt-2">Comprehensive health information and symptom details.</p>
                    </div>

                    {/* Search & List */}
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search diseases or symptoms..."
                                className="pl-10 bg-white border-zinc-200 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Selected Disease Details View */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-5 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zinc-100 rounded-lg">
                                    {selectedDisease.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900">{selectedDisease.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                            {selectedDisease.severity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-zinc-600 leading-relaxed text-sm">
                                {selectedDisease.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-2">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-emerald-500" /> Common Symptoms
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedDisease.symptoms.map((sym, idx) => (
                                            <li key={idx} className="text-sm text-zinc-600 flex items-start gap-2">
                                                <span className="min-w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5"></span>
                                                {sym}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-blue-500" /> Primary Causes
                                    </h3>
                                    <p className="text-sm text-zinc-600 leading-relaxed">
                                        {selectedDisease.causes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Scrollable Disease Selector */}
                        <h3 className="text-sm font-medium text-zinc-500 mt-4 uppercase tracking-wider">Other Conditions</h3>
                        <div className="flex overflow-x-auto pb-4 pt-4 px-2 gap-4 snap-x no-scrollbar">
                            {filteredDiseases.map((disease) => (
                                <Card
                                    key={disease.id}
                                    className={`snap-center shrink-0 w-64 cursor-pointer transition-all hover:shadow-md ${selectedDisease.id === disease.id ? 'border-primary ring-1 ring-primary shadow-md' : 'border-zinc-200'}`}
                                    onClick={() => setSelectedDisease(disease)}
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base flex items-center justify-between">
                                            {disease.name}
                                            {disease.id === selectedDisease.id && <span className="w-2 h-2 rounded-full bg-primary" />}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-xs text-zinc-500 line-clamp-2">{disease.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredDiseases.length === 0 && (
                                <div className="p-4 text-sm text-zinc-400">No diseases found matching "{searchQuery}"</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side - Chatbot (40%) */}
                <div className="w-full lg:w-2/5 flex flex-col h-[calc(100vh-8rem)] min-h-[600px] border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden relative">
                    <div className="p-4 border-b border-zinc-100 bg-white/50 backdrop-blur-md flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900 leading-none">Medical AI Assistant</h3>
                            <p className="text-xs text-zinc-500 mt-1">Ask me about {selectedDisease.name} or general symptoms</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {messages.length === 0 && (
                            <div className="h-full flex items-center justify-center text-zinc-400 text-center flex-col gap-2 my-auto p-4">
                                <Bot className="w-10 h-10 text-zinc-300 mb-2" />
                                <h4 className="font-medium text-zinc-700">Need Guidance?</h4>
                                <p className="text-xs text-zinc-500 max-w-[250px]">
                                    I can provide general advice on {selectedDisease.name} symptoms. Type below to start consulting.
                                </p>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div key={m.id} className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-white'}`}>
                                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-zinc-100 text-zinc-800 rounded-tl-sm shadow-sm'}`}>
                                    {m.parts.map((part, i) =>
                                        <span key={i}>{part.type === "text" ? part.text : ""}</span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex gap-3 max-w-[90%] self-start">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="px-3 py-2 rounded-2xl bg-zinc-100 text-zinc-800 rounded-tl-sm shadow-sm flex items-center gap-1 h-[34px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-zinc-100">
                        <form
                            ref={formRef}
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!input.trim()) return;
                                sendMessage({ text: input });
                                setInput("");
                            }}
                            className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 focus-within:border-zinc-300 focus-within:ring-2 focus-within:ring-zinc-100/50 transition-all"
                        >
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder={`Ask about ${selectedDisease.name}...`}
                                className="resize-none min-h-[40px] max-h-24 border-0 focus-visible:ring-0 shadow-none bg-transparent py-2.5 px-3 text-sm flex-1"
                                rows={1}
                            />
                            <Button
                                type="submit"
                                disabled={!input.trim()}
                                className="rounded-lg w-9 h-9 shrink-0"
                                size="icon"
                            >
                                <SendIcon size={14} />
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Custom scrollbar hiding CSS for the horizontal list */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </main>
    );
}
