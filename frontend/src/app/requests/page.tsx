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
import { User } from "lucide-react";

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

export default function RequestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/requests?type=${activeTab}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update request");

      toast.success(`Request ${status}`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error("Error updating request");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Connection Requests</h1>

      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === "incoming"
              ? "border-b-2 border-primary font-bold text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === "outgoing"
              ? "border-b-2 border-primary font-bold text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <Card key={req._id}>
              <CardHeader>
                <CardTitle>
                  {activeTab === "incoming"
                    ? req.senderId.name
                    : req.receiverId.name}
                </CardTitle>
                <CardDescription>
                  {new Date(req.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Status: <span className="capitalize font-medium">{req.status}</span>
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {activeTab === "incoming" && req.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(req._id, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(req._id, "accepted")}
                    >
                      Accept
                    </Button>
                  </>
                )}
                 {activeTab === "outgoing" && (
                    <span className="text-sm text-gray-500 italic">
                        {req.status === "pending" ? "Waiting for response" : `Request ${req.status}`}
                    </span>
                 )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
