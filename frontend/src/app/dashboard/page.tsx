"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Heart,
  MessageCircle,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    // Ideally call logout API to clear cookie
    // For now, just delete cookie client side is not enough for httpOnly
    // So I need logout API.
    // I'll create one later or just instruct user to clear cookies manually?
    // Better create /api/auth/logout.
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      router.push("/login");
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">
            Jaigurudev Vivah
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Hello, {user?.name}
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {!user.profileCompleted && (
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-r-md shadow-sm">
            <p className="font-bold">Complete your profile!</p>
            <p>
              You must complete your profile 100% to search matches and send
              requests.
            </p>
            <Link href="/profile">
              <Button size="sm" className="mt-2" variant="secondary">
                Complete Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Jaigurudev Banner */}
        <div className="mb-8 flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="relative">
                <img 
                  src="https://imgs.search.brave.com/RoSyR9SJeZ-WRZpd001V97vAp_Zq66sXgSEIv95Z6qU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzI5Lzkw/LzY1LzI5OTA2NWE3/ZGJjYTg1YzZhMzIz/ZjJkZjIwMjBlYTM0/LmpwZw"
                  alt="Jaigurudev"
                  className="rounded-lg shadow-lg max-w-full h-auto max-h-96 object-cover"
                />
             </div>
             <div className="mt-6 text-center max-w-2xl space-y-4">
                <h2 className="text-2xl font-bold text-primary">Param Sant Baba Jaigurudev</h2>
                <p className="text-gray-600 italic">
                  &quot;Marriage is a sacred bond of two souls.&quot;
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to the official matrimonial platform for the Jaigurudev Sangat. 
                  Find your life partner with the blessings of Param Sant Baba Jaigurudev Ji Maharaj.
                  This platform is dedicated to bringing together devotees in holy matrimony.
                </p>
             </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.profileCompleted ? "100%" : "Incomplete"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Manage your personal details
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/matches">
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer h-full ${
                !user.profileCompleted ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Find</div>
                <p className="text-xs text-muted-foreground">
                  Search for your soulmate
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/requests">
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer h-full ${
                !user.profileCompleted ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requests</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Connect</div>
                <p className="text-xs text-muted-foreground">
                  View sent and received requests
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/chat">
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer h-full ${
                !user.profileCompleted ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chats</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Messages</div>
                <p className="text-xs text-muted-foreground">
                  Chat with connected matches
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
