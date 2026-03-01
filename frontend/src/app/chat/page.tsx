"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MessageCircle } from "lucide-react";

interface Chat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profileImage: string;
  }[];
  updatedAt: string;
}

export default function ChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (data.chats) {
          setChats(data.chats);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading chats...</div>;

  return (
    <div className="container mx-auto max-w-2xl">
      {/* Tabs or List View */}
      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="p-4 bg-pink-50 rounded-full">
                <MessageCircle className="h-12 w-12 text-pink-300" />
            </div>
            <p className="text-gray-500">No active chats. Start connecting with matches!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <Link key={chat._id} href={`/chat/${chat._id}`}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-pink-100 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                     {chat.participants[0] && chat.participants[0].profileImage ? (
                        <img 
                            src={chat.participants[0].profileImage} 
                            alt="" 
                            className="h-full w-full object-cover cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push(`/profile/${chat.participants[0]._id}`);
                            }}
                        />
                     ) : (
                        <span className="text-primary font-bold text-lg">{chat.participants[0]?.name?.charAt(0) || "U"}</span>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900 truncate">
                        {chat.participants.map((p) => p.name).join(", ")}
                        </h3>
                        <span className="text-xs text-gray-400">
                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      Tap to view messages
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
