"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Send, Clock, AlertTriangle } from "lucide-react";

interface Message {
  sender: {
    _id: string;
    name: string;
  };
  content: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profileImage: string;
  }[];
  messages: Message[];
  chatActive: boolean;
  startTime: string;
  status: string;
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user first
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/chat/${params.id}`);
        if (res.status === 403) {
          toast.error("Access denied");
          router.push("/chat");
          return;
        }
        const data = await res.json();
        if (data.chat) {
          setChat(data.chat);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [params.id, currentUser, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/chat/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessage("");
      // Chat update will happen on next poll or manual update
      // But for responsiveness, we can optimistically update or just wait for poll
      // For now, wait for poll or just fetch immediately
      const chatRes = await fetch(`/api/chat/${params.id}`);
      const chatData = await chatRes.json();
      if (chatData.chat) setChat(chatData.chat);
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading || !currentUser)
    return <div className="p-8 text-center">Loading chat...</div>;
  if (!chat) return <div className="p-8 text-center">Chat not found</div>;

  const otherUser = chat.participants.find((p) => p._id !== currentUser._id);
  const daysRemaining = 7 - Math.floor((Date.now() - new Date(chat.startTime).getTime()) / (1000 * 60 * 60 * 24));
  const messagesRemaining = 20 - chat.messages.length;

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-100px)]">
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-none bg-transparent">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
               {otherUser?.profileImage ? (
                  <img src={otherUser.profileImage} alt="" className="h-full w-full object-cover"/>
               ) : (
                  <span>{otherUser?.name?.charAt(0)}</span>
               )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">{otherUser?.name}</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                Active
              </p>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="bg-pink-50 px-2 py-1 rounded text-xs text-primary font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{Math.max(0, daysRemaining)}d left</span>
             </div>
             <div className="bg-orange-50 px-2 py-1 rounded text-xs text-orange-600 font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{Math.max(0, messagesRemaining)} left</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {chat.messages.map((msg, idx) => {
            const isMe = msg.sender._id === currentUser._id;
            return (
              <div
                key={idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      isMe ? "text-pink-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending || messagesRemaining <= 0 || daysRemaining <= 0}
              className="flex-1"
            />
            <Button
              type="submit"
              size="default"
              disabled={sending || !message.trim() || messagesRemaining <= 0 || daysRemaining <= 0}
              className="rounded-full w-12 h-10 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          {(messagesRemaining <= 0 || daysRemaining <= 0) && (
            <p className="text-center text-xs text-red-500 mt-2">
              Chat limit reached. Please wait for the final decision prompt.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
