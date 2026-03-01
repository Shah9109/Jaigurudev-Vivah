"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, Heart, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
          if (res.status === 403) {
              window.location.href = "/";
              throw new Error("Unauthorized");
          }
          return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.totalUsers}</div>
            <p className="text-xs text-blue-600 mt-1">
              M: {stats?.genderRatio?.male} | F: {stats?.genderRatio?.female}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">{stats?.activeChats}</div>
            <p className="text-xs text-pink-600 mt-1">Currently engaging</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Marriages</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats?.marriageSuccessCount}</div>
            <p className="text-xs text-green-600 mt-1">Successful unions</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats?.reportsCount}</div>
            <p className="text-xs text-red-600 mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
