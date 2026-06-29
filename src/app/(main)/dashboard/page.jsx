"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BookOpen,
  Star,
  PlusCircle,
  Compass,
  Crown,
  Eye,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeartIcon, PencilIcon } from "@phosphor-icons/react";
import Image from "next/image";
import moment from "moment/moment";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (!user || firstLoadDone) return;
      try {
        setIsLoading(true);
        const res = await apiFetch("/api/dashboard/stats");
        if (res?.ok) {
          setStats(res.data);
          setFirstLoadDone(true);
        } else {
          toast.error(res?.message || "Failed to load dashboard statistics");
        }
      } catch (err) {
        toast.error(err.message || "An error occurred fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [user, firstLoadDone]);

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>

        {/* Stats Row Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 border rounded-xl bg-card animate-pulse"
            />
          ))}
        </div>

        {/* Chart + Table Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-87.5 border rounded-xl bg-card animate-pulse" />
          <div className="h-87.5 border rounded-xl bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Welcome back, {user.name} 👋
            {user.isPremium ? (
              <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white gap-1 text-xs py-0 px-1.5 h-4">
                <Crown className="w-2.5 h-2.5 fill-current" /> Premium
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs py-0 px-1.5 h-4">
                Free
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Have a look at your insights in one place.
          </p>
        </div>
      </div>

      {/* STATS CARDS ROW (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">
              Total Lessons Created
            </span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lessonsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Shared wisdom modules
            </p>
          </CardContent>
        </Card>

        {/* Total Favorites */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-muted-foreground">
              Total Favorites
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.favoritesCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bookmarked resources
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full text-xs"
            asChild
          >
            <Link href="/lessons">
              <Compass className="w-3.5 h-3.5 mr-1.5" /> Browse Public Lessons
            </Link>
          </Button>
          <Button
            size="lg"
            className="w-full text-xs bg-purple-600 hover:bg-purple-700 text-white"
            asChild
          >
            <Link href="/dashboard/add-lesson">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Add New Lesson
            </Link>
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT BLOCK: GRAPH + RECENT ACTION TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WEEKLY ACTIVITY CHART */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-500" /> Your Activity
              This Week
            </CardTitle>
            <CardDescription className="text-[11px]">
              Number of growth reflections drafted over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-60 pl-0 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weeklyData || []}>
                <XAxis
                  dataKey="day"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(147, 51, 234, 0.05)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Bar
                  dataKey="lessons"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RECENT HIGHLIGHT METRIC SUMMARY SIDE PANEL */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Overview</CardTitle>
            <CardDescription className="text-[11px]">
              Quick analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs space-y-3 flex-1 flex flex-col">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Account Role:</span>
              <span className="font-semibold text-foreground capitalize">
                {user.role || "User"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-semibold text-purple-500">
                {user.isPremium ? "Premium Master" : "Standard Tier"}
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-muted-foreground">Updated at:</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                {moment(user?.updatedAt).format("hh:mma, DD/MM/YYYY")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden gap-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Recently Posted Lessons
              </CardTitle>
              <CardDescription>Your latest 5 posts</CardDescription>
            </div>

            {stats?.recentLessons?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600"
                asChild
              >
                <Link href="/dashboard/my-lessons">
                  See All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>

        {!stats?.recentLessons?.length ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              No lessons yet. Start sharing your wisdom!
            </p>

            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link href="/dashboard/add-lesson">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Lesson
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-20">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Emotional Tone</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stats.recentLessons.map((lesson) => (
                  <TableRow
                    key={lesson._id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                        {lesson.image ? (
                          <Image
                            src={lesson.image}
                            alt={lesson.title}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-medium max-w-85">
                      <div className="truncate text-sm" title={lesson.title}>
                        {lesson.title}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-3.5 h-3.5 text-rose-500" />
                          {lesson.likesCount || 0}
                        </span>

                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          {lesson.favoritesCount || 0}
                        </span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-muted-foreground">
                      {lesson.category}
                    </TableCell>

                    {/* Emotional Tone */}
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                        {lesson.emotionalTone}
                      </span>
                    </TableCell>

                    {/* Access */}
                    <TableCell>
                      {lesson.accessLevel === "premium" ? (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none text-[11px]">
                          Premium
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none text-[11px]">
                          Free
                        </Badge>
                      )}
                    </TableCell>

                    {/* Visibility */}
                    <TableCell>
                      {lesson.visibility === "public" ? (
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none text-[11px]">
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">
                          Private
                        </Badge>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(lesson.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right whitespace-nowrap space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        asChild
                      >
                        <Link href={`/lessons/${lesson._id}`}>
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        asChild
                      >
                        <Link href={`/dashboard/edit-lesson/${lesson?._id}`}>
                          <PencilIcon className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
