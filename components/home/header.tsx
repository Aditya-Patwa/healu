"use client";
import { bricolageGrotesque } from "@/lib/fonts";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full grid px-4 md:px-8 py-4 bg-neutral-50 dark:bg-neutral-900/80">
            <div className="max-w-7xl w-full justify-self-center items-center flex justify-between">
                <div>
                    <h2 className={`${bricolageGrotesque.className} text-2xl font-semibold tracking-tighter leading-none`}>
                        MediHelp
                    </h2>
                </div>

                <div className="flex gap-2 items-center">
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
            </div>
        </header>
    )
}