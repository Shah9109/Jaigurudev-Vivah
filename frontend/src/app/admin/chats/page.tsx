"use client";

import { useEffect, useState } from "react";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Chat {
    _id: string;
    participants: { name: string; email: string }[];
    messages: { content: string; timestamp: string; sender: string }[];
    updatedAt: string;
}

export default function AdminChatsPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/moderation")
            .then(res => res.json())
            .then(data => {
                if(data.chats) setChats(data.chats);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if(loading) return <div>Loading active chats...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Live Chat Monitoring</h1>
            <div className="grid gap-6 md:grid-cols-2">
                {chats.map(chat => (
                    <Card key={chat._id} className="h-96 flex flex-col">
                        <CardHeader className="bg-gray-50 py-3 border-b">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-500"/>
                                {chat.participants.map(p => p.name).join(" & ")}
                            </CardTitle>
                            <div className="text-xs text-gray-500">
                                Last active: {new Date(chat.updatedAt).toLocaleString()}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                            {chat.messages.slice(-5).map((msg, i) => (
                                <div key={i} className="text-sm border-b pb-2 mb-2 last:border-0">
                                    <p className="text-gray-800">{msg.content}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                            {chat.messages.length === 0 && <p className="text-gray-400 text-sm italic">No messages yet.</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
