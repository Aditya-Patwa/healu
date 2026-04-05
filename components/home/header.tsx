"use client";
import { bricolageGrotesque } from "@/lib/fonts";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="w-full relative z-50 grid px-4 md:px-8 py-4 bg-neutral-50 dark:bg-neutral-900/80 shadow-sm md:shadow-none">
            <div className="max-w-7xl w-full justify-self-center items-center flex justify-between">
                <div>
                    <h2 className={`${bricolageGrotesque.className} text-2xl font-semibold tracking-tighter leading-none`}>
                        MediHelp
                    </h2>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-2 items-center">
                    <Button variant={"secondary"} onClick={() => router.push("/dashboard")}>
                        Dashboard
                    </Button>
                    <Button variant={"secondary"} onClick={() => router.push("/dashboard/hospitals")}>
                        Hospitals
                    </Button>
                    <Link href={"https://medi-healu.streamlit.app/"}>
                        <Button variant={"secondary"}>
                            Diseases
                        </Button>
                    </Link>
                    <Button variant={"secondary"} onClick={() => router.push("/dashboard/chat")}>
                        Chat
                    </Button>
                    <Button variant={"secondary"} onClick={() => router.push("/dashboard/mental-wellness-assistant")}>
                        Mental Wellness Assistant
                    </Button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="lg:hidden flex items-center">
                    <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-neutral-50 dark:bg-neutral-900/95 border-b dark:border-neutral-800 shadow-lg px-4 py-4 flex flex-col gap-2 backdrop-blur-md">
                    <Button variant={"secondary"} className="w-full justify-start" onClick={() => { router.push("/dashboard"); toggleMenu(); }}>
                        Dashboard
                    </Button>
                    <Button variant={"secondary"} className="w-full justify-start" onClick={() => { router.push("/dashboard/hospitals"); toggleMenu(); }}>
                        Hospitals
                    </Button>
                    <Link href={"https://medi-healu.streamlit.app/"} className="w-full" onClick={toggleMenu}>
                        <Button variant={"secondary"} className="w-full justify-start">
                            Diseases
                        </Button>
                    </Link>
                    <Button variant={"secondary"} className="w-full justify-start" onClick={() => { router.push("/dashboard/chat"); toggleMenu(); }}>
                        Chat
                    </Button>
                    <Button variant={"secondary"} className="w-full justify-start" onClick={() => { router.push("/dashboard/mental-wellness-assistant"); toggleMenu(); }}>
                        Mental Wellness Assistant
                    </Button>
                </div>
            )}
        </header>
    );
}