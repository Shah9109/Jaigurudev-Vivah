"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, UserCheck, Heart, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalConnections: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error("Failed to load stats");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users className="h-8 w-8 text-blue-500" />}
            description="Registered users"
        />
        <StatsCard 
            title="Active Profiles" 
            value={stats.activeUsers} 
            icon={<UserCheck className="h-8 w-8 text-green-500" />}
            description="Completed profiles"
        />
        <StatsCard 
            title="Total Connections" 
            value={stats.totalConnections} 
            icon={<Heart className="h-8 w-8 text-pink-500" />}
            description="Successful matches"
        />
        <StatsCard 
            title="Pending Requests" 
            value={stats.pendingRequests} 
            icon={<Clock className="h-8 w-8 text-orange-500" />}
            description="Awaiting response"
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    )
}
