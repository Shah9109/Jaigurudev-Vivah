"use client";

import { useEffect, useState } from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]); // Re-fetch when page or search changes

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search
      });
      const res = await fetch(`/api/admin/users?${query}`);
      const data = await res.json();
      if (res.ok) {
          setUsers(data.users);
          setPages(data.pagination.pages);
      }
    } catch (error) {
        toast.error("Failed to fetch users");
    } finally {
        setLoading(false);
    }
  };

  const toggleBlockStatus = async (userId: string, currentStatus: string) => {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      try {
          const res = await fetch("/api/admin/users", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, status: newStatus })
          });
          if (res.ok) {
              toast.success(`User ${newStatus === "active" ? "unblocked" : "blocked"} successfully`);
              fetchUsers(); // Refresh list
          } else {
              toast.error("Action failed");
          }
      } catch (err) {
          toast.error("Something went wrong");
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search by name, email, phone..." 
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white rounded-md border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">No users found</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        variant={user.status === 'active' ? "destructive" : "outline"}
                                        onClick={() => toggleBlockStatus(user._id, user.status)}
                                        className="flex items-center gap-2 ml-auto"
                                    >
                                        {user.status === 'active' ? (
                                            <><Ban className="w-4 h-4" /> Block</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4" /> Unblock</>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-2">
            <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
            >
                Previous
            </Button>
            <Button 
                variant="outline" 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
            >
                Next
            </Button>
        </div>
    </div>
  );
}
