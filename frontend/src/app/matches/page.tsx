"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { User, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  _id: string; // Profile ID
  userId: string;
  gender: string;
  dob: string;
  height: string;
  education: string;
  occupation: string;
  location: string;
  about: string;
  profileImage: string;
  user: {
    _id: string; // User ID
    name: string;
    profileCompleted: boolean;
  };
}

interface Request {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"match" | "connection">("match");
  const [matches, setMatches] = useState<Match[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: "",
    minAge: "",
    maxAge: "",
    caste: "",
    location: ""
  });

  useEffect(() => {
    if (activeTab === "match") {
      fetchMatches();
    } else {
      fetchRequests();
    }
  }, [activeTab, filters]); // Re-fetch when tab or filters change

  const handleProfileClick = (userId: string) => {
      router.push(`/profile/${userId}`);
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (filters.minAge) queryParams.append("minAge", filters.minAge);
      if (filters.maxAge) queryParams.append("maxAge", filters.maxAge);
      if (filters.caste) queryParams.append("caste", filters.caste);
      if (filters.location) queryParams.append("location", filters.location);
      
      const res = await fetch(`/api/matches?${queryParams.toString()}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403) {
        toast.error("Complete your profile first!");
        router.push("/profile");
        return;
      }
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch both incoming and outgoing for "Connection" tab logic
      // Ideally API should support fetching all relevant requests
      // For now, let's just fetch "incoming" as default for Connection tab main view
      // But user wants "Request Sent" and "Request Received" sub-sections.
      
      const [incomingRes, outgoingRes] = await Promise.all([
        fetch("/api/requests?type=incoming"),
        fetch("/api/requests?type=outgoing")
      ]);

      const incomingData = await incomingRes.json();
      const outgoingData = await outgoingRes.json();

      // Combine them or store separately. Let's combine for now and filter in UI
      const combined = [
        ...(incomingData.requests || []),
        ...(outgoingData.requests || [])
      ];
      // Remove duplicates if any (shouldn't be)
      setRequests(combined);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    setSending(userId);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send request");
      }

      toast.success("Request sent successfully!");
      // Remove from matches list to avoid duplicate sending
      setMatches(prev => prev.filter(m => m.user._id !== userId));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSending(null);
    }
  };

  const handleRequestAction = async (requestId: string, status: "accepted" | "rejected", senderName: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update request");

      if (status === "accepted") {
        toast.success(`Namaste ${senderName}, your marriage interest has been accepted. Please proceed respectfully.`);
        router.push("/chat");
      } else {
        toast.success("Request rejected");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Error updating request");
    }
  };

  // Sub-tabs for Connection
  const incomingRequests = requests.filter(r => r.receiverId._id === requests[0]?.receiverId?._id && r.status === 'pending'); // Need better check for 'my id'
  // Actually, the API returns objects. I don't know my own ID here easily without auth context.
  // But wait, /api/requests?type=incoming returns requests where I am receiver.
  // /api/requests?type=outgoing returns requests where I am sender.
  // I should differentiate them better.
  
  // Let's refactor fetchRequests to separate state variables
  const [incoming, setIncoming] = useState<Request[]>([]);
  const [outgoing, setOutgoing] = useState<Request[]>([]);

  // Override fetchRequests for better separation
  const fetchRequestsSeparated = async () => {
    setLoading(true);
    try {
        const incomingRes = await fetch("/api/requests?type=incoming");
        const outgoingRes = await fetch("/api/requests?type=outgoing");
        
        const inData = await incomingRes.json();
        const outData = await outgoingRes.json();
        
        setIncoming(inData.requests || []);
        setOutgoing(outData.requests || []);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "connection") {
        fetchRequestsSeparated();
    }
  }, [activeTab]);


  return (
    <div className="container mx-auto max-w-4xl">
      {/* Tabs */}
      <div className="flex w-full bg-white rounded-xl shadow-sm mb-6 p-1 sticky top-0 z-30">
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "match"
              ? "bg-pink-50 text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("match")}
        >
          Matches
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "connection"
              ? "bg-pink-50 text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("connection")}
        >
          Connections
        </button>
      </div>

      {activeTab === "match" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Filter Matches
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Card className="mb-6 border-dashed bg-gray-50">
                  <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={filters.gender}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, gender: e.target.value }))
                        }
                      >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Age Range</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Min" 
                                type="number"
                                value={filters.minAge}
                                onChange={(e) => setFilters(prev => ({ ...prev, minAge: e.target.value }))}
                            />
                            <Input 
                                placeholder="Max" 
                                type="number"
                                value={filters.maxAge}
                                onChange={(e) => setFilters(prev => ({ ...prev, maxAge: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Caste</Label>
                        <Input 
                            placeholder="e.g. Brahmin" 
                            value={filters.caste}
                            onChange={(e) => setFilters(prev => ({ ...prev, caste: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input 
                            placeholder="City, District, or State" 
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        />
                    </div>
                    <div className="col-span-full flex justify-end gap-2 mt-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFilters({ gender: "", minAge: "", maxAge: "", caste: "", location: "" })}
                        >
                            Reset
                        </Button>
                        <Button size="sm" onClick={fetchMatches}>
                            Apply Filters
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-center py-10">Loading matches...</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No matches found.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <Card 
                    className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white/50 backdrop-blur-sm cursor-pointer"
                    onClick={() => handleProfileClick(match.user._id)}
                  >
                    <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                      {match.profileImage ? (
                        <img
                          src={match.profileImage}
                          alt={match.user.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg font-bold">{match.user.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                {new Date().getFullYear() - new Date(match.dob).getFullYear()} yrs • {match.location}
                            </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                       <p className="text-sm text-gray-600 line-clamp-2">{match.about}</p>
                       <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-1 rounded-full">
                          {match.education}
                       </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full rounded-xl bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90"
                        onClick={() => handleConnect(match.user._id)}
                        disabled={sending === match.user._id}
                      >
                         {sending === match.user._id ? "Sending..." : "Send Marriage Request"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "connection" && (
        <div className="space-y-8">
            {/* Received Requests */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    Requests Received
                </h3>
                {incoming.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No pending requests.</p>
                ) : (
                    <div className="space-y-4">
                        {incoming.map((req) => (
                            <Card key={req._id} className="border-l-4 border-l-primary shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold">{req.senderId.name}</h4>
                                        <p className="text-xs text-gray-500">Sent on {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                            onClick={() => handleRequestAction(req._id, "rejected", req.senderId.name)}
                                        >
                                            Reject
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleRequestAction(req._id, "accepted", req.senderId.name)}
                                        >
                                            Accept
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Sent Requests */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gray-400 rounded-full"></div>
                    Requests Sent
                </h3>
                {outgoing.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No requests sent.</p>
                ) : (
                    <div className="space-y-4">
                        {outgoing.map((req) => (
                            <Card key={req._id} className="bg-gray-50 border-0 shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{req.receiverId.name}</h4>
                                        <p className="text-xs text-gray-500">Sent on {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
      )}
    </div>
  );
}
