'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { bricolageGrotesque } from "@/lib/fonts"
import { SendIcon, User, Bot } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"
import { DefaultChatTransport } from 'ai';


function Header() {
    return (
        <header className="w-full grid px-4 md:px-8 py-4 bg-background/80 backdrop-blur sticky top-0 z-10 border-b">
            <div>
                <h2 className={`${bricolageGrotesque.className} text-2xl font-semibold tracking-tighter leading-none flex items-center gap-2`}>
                    MediHelp <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Mental Wellness Assistant</span>
                </h2>
            </div>
        </header>
    )
}

export default function Chat() {
    const { messages, sendMessage } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat'
        }),
    });
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            formRef.current?.requestSubmit()
        }
    }

    return (
        <main className="w-full h-[100dvh] flex flex-col relative bg-muted/20">
            <Header />

            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-36 pt-6 flex flex-col gap-6 max-w-3xl mx-auto w-full">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-center flex-col gap-3 my-auto">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground">Mental Wellness Assistant.</h3>
                        {/* <p className="max-w-md text-sm">Describe your symptoms or ask any healthcare-related questions. I'm here to provide guidance and information.</p> */}
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-background border rounded-tl-sm shadow-sm'}`}>
                            {m.parts.map((part, i) =>
                                <p key={i}>{part.type == "text" ? part.text : ""}</p>
                            )}
                        </div>
                    </div>
                ))}

                {messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-3 max-w-3xl self-start">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-background border rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[46px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="w-full grid fixed bottom-0 z-50 px-4 md:px-8 pb-4">
                <div className="max-w-3xl w-full justify-self-center flex flex-col gap-2">
                    <form
                        ref={formRef}
                        onSubmit={(e) => { e.preventDefault(); sendMessage({ text: input }); setInput(""); }}
                        className="rounded-2xl w-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg relative flex items-end p-2 transition-all focus-within:bg-background focus-within:ring-2 ring-primary/20"
                    >
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Type a message... (Press Enter to send)"
                            className="resize-none min-h-[44px] max-h-32 border-0 focus-visible:ring-0 shadow-none bg-transparent py-3 text-sm flex-1"
                            rows={1}
                        />
                        <div className="flex shrink-0 pb-1 pr-1">
                            <Button
                                type="submit"
                                disabled={!input.trim()}
                                className="rounded-xl w-10 h-10 transition-all hover:scale-105 active:scale-95"
                                size={"icon"}
                            >
                                <SendIcon size={16} />
                            </Button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-muted-foreground w-full">
                        AI can make mistakes. Consider verifying important information.
                    </p>
                </div>
            </div>
        </main>
    )
}