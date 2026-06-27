"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Flag,
  CalendarDays,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { apiFetch } from "@/lib/apiFetch";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setLoading(true);
        const res = await apiFetch("/api/admin/stats");
        if (res && res.ok) {
          setStats(res.data);
        } else {
          toast.error("Failed to fetch admin statistics.");
        }
      } catch (error) {
        toast.error("An error occurred while loading dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-background text-foreground w-full mx-auto py-6 space-y-4 font-sans text-xs antialiased">
        {/* Header Skeleton */}
        <div className="space-y-1">
          <div className="h-4 w-28 bg-muted animate-pulse rounded-none" />
          <div className="h-3 w-48 bg-muted/60 animate-pulse rounded-none" />
        </div>

        {/* 4 Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <div className="h-3 w-16 bg-muted animate-pulse rounded-none" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded-none" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="h-6 w-12 bg-muted animate-pulse rounded-none" />
                <div className="h-3 w-20 bg-muted/60 animate-pulse rounded-none" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-3 w-24 bg-muted animate-pulse rounded-none" />
                <div className="h-2 w-36 bg-muted/60 animate-pulse rounded-none" />
              </CardHeader>
              <CardContent>
                <div className="h-32 w-full bg-muted/40 animate-pulse rounded-none" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="px-4">
          <Card>
            <CardHeader>
              <div className="h-3 w-32 bg-muted animate-pulse rounded-none" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-muted/40 animate-pulse rounded-none"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalPublicLessons = 0,
    totalReportedLessons = 0,
    todayLessons = 0,
    topContributors = [],
    lessonGrowth = [],
    userGrowth = [],
  } = stats || {};

  return (
    <div className="text-foreground mx-auto space-y-4 font-sans text-xs antialiased">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Admin Dashboard
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Overall platform stats.
        </p>
      </div>

      {/* 4 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalUsers}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        {/* Public Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Public Lessons
            </CardTitle>
            <BookOpen size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalPublicLessons}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Live content items
            </p>
          </CardContent>
        </Card>

        {/* Reported Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Reported
            </CardTitle>
            <Flag size={16} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-destructive">
              {totalReportedLessons}
            </div>
            <p className="text-[11px] text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        {/* Today's Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Today&apos;s Lessons
            </CardTitle>
            <CalendarDays size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {todayLessons}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Created past 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lesson Growth Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" /> Lesson Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lessonGrowth}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="currentColor"
                  className="text-[8px] opacity-50"
                  tickLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[8px] opacity-50"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    fontSize: "10px",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Bar
                  dataKey="lessons"
                  fill="currentColor"
                  className="text-primary"
                  radius={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground flex items-center gap-1">
              <UserRound className="h-3 w-3 text-primary" /> User Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowth}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="currentColor"
                  className="text-[8px] opacity-50"
                  tickLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[8px] opacity-50"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    fontSize: "10px",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Most Active Contributors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t border-muted">
            {topContributors.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-[11px]">
                No contributors found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-muted hover:bg-transparent">
                    <TableHead className="w-8 text-[11px] uppercase font-bold text-muted-foreground h-7 px-3">
                      #
                    </TableHead>
                    <TableHead className="text-[11px] uppercase font-bold text-muted-foreground h-7 px-3">
                      Author ID
                    </TableHead>
                    <TableHead className="text-right text-[11px] uppercase font-bold text-muted-foreground h-7 px-3">
                      Lessons Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topContributors.map((contributor, index) => (
                    <TableRow
                      key={contributor._id || index}
                      className="border-muted hover:bg-muted/30"
                    >
                      <TableCell className="font-medium h-7 px-3 text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono h-7 px-3 truncate max-w-30">
                        {contributor.name}
                      </TableCell>
                      <TableCell className="text-right font-bold h-7 px-3 text-foreground">
                        {contributor.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
