"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  BookOpen,
  Calendar,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const currentAdminId = session?.user?.id;

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // ====== Fetch All Users ======
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const res = await apiFetch("/api/admin/users");
        if (res?.ok) {
          setUsers(res.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch user list");
        }
      } catch (err) {
        toast.error(err.message || "An error occurred while loading users");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // ====== Handle Toggle Admin Role ======
  const handleToggleRole = async (targetUser) => {
    const targetId = targetUser._id;
    const newRole = targetUser.role === "admin" ? "user" : "admin";

    try {
      setUpdatingUserId(targetId);

      const res = await apiFetch(`/api/admin/users/${targetId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      if (res?.ok) {
        toast.success(res.message || `User role updated to ${newRole}`);

        // Optimistic local state update
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === targetId ? { ...u, role: newRole } : u,
          ),
        );
      } else {
        toast.error(res?.message || "Failed to alter authorization role");
      }
    } catch (err) {
      toast.error(err.message || "An exception error occurred modifying role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ====== Client-side Filter Logic ======
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Manage Users
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage all registered users
          </p>
        </div>
        {!isLoading && (
          <Badge
            variant="secondary"
            className="h-6 text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/40 px-2.5"
          >
            Total Users: {users.length}
          </Badge>
        )}
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email account..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs h-9"
        />
      </div>

      {/* DATA WORKSPACE LAYOUT */}
      {isLoading ? (
        /* Loading Skeleton Layer Rows Block View */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 bg-muted/20 h-10 border-b w-full" />
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between animate-pulse py-2"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-9 h-9 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-8 bg-muted rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* Empty State Matching Query Parameters Search Layout Definitions */
        <div className="text-center p-12 border border-dashed rounded-xl bg-card/50 space-y-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <UserX className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">No users found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your search query did not yield any registered system identities.
              Adjust your keyword parameters.
            </p>
          </div>
        </div>
      ) : (
        /* Responsive Grid Data Table Content Configuration Block */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">Premium</TableHead>
                  <TableHead className="text-xs">Lessons Created</TableHead>
                  <TableHead className="text-xs">Joined Date</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userItem) => {
                  const isSelf = currentAdminId === userItem._id;
                  const fallbackAvatar = `/placeholder-avatar.png`;
                  const isRowUpdating = updatingUserId === userItem._id;

                  return (
                    <TableRow
                      key={userItem._id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      {/* USER PROFILE META COLUMN */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border bg-muted shrink-0">
                            <Image
                              src={userItem.image || fallbackAvatar}
                              alt={userItem.name}
                              className="w-full h-full object-cover"
                              width={120}
                              height={120}
                            />
                          </div>
                          <div className="space-y-0.5 max-w-50 truncate">
                            <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                              {userItem.name}
                              {isSelf && (
                                <span className="text-[9px] bg-slate-100 text-slate-700 font-normal px-1 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div
                              className="text-[11px] text-muted-foreground truncate"
                              title={userItem.email}
                            >
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {userItem.role === "admin" ? (
                          <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100 border border-rose-200/50 text-[10px] py-0 px-2 font-medium">
                            Admin
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-2 text-muted-foreground bg-muted/60 font-normal"
                          >
                            User
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {userItem.isPremium ? (
                          <Badge className="bg-purple-600 text-white hover:bg-purple-600 border-none text-[10px] py-0 px-1.5 font-medium gap-0.5">
                            Premium ⭐
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 px-1.5 font-normal text-muted-foreground"
                          >
                            Free
                          </Badge>
                        )}
                      </TableCell>

                      {/* QUANTITY INSIGHT MODULE LESSONS COMPILED COUNT */}
                      <TableCell className="text-xs font-medium text-foreground">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <BookOpen className="w-3 h-3 text-slate-400" />
                          <span>{userItem.lessonsCount || 0}</span>
                        </div>
                      </TableCell>

                      {/* DATE JOINED TIMELINE ROW TIMESTAMP CALENDAR COLUMN */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {userItem.createdAt
                              ? new Date(userItem.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* ACTIONS INTERACTION CONTEXT WORKSPACE COLUMN */}
                      <TableCell className="text-right whitespace-nowrap">
                        {isSelf ? (
                          <span className="text-[10px] text-muted-foreground italic select-none pr-2">
                            -
                          </span>
                        ) : userItem.role === "admin" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleRole(userItem)}
                            disabled={isRowUpdating}
                            className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            {isRowUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            )}
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleRole(userItem)}
                            disabled={isRowUpdating}
                            className="h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950 dark:hover:bg-rose-950/30"
                          >
                            {isRowUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-rose-500" />
                            )}
                            Make Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
