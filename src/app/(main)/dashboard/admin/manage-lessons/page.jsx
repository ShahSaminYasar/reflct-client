"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  EyeOff,
  AlertTriangle,
  Star,
  CheckCircle,
  Trash2,
  FilterX,
  Loader2,
  Calendar,
  ThumbsUp,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [flaggedFilter, setFlaggedFilter] = useState(false);

  // Stats Counters
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    private: 0,
    flagged: 0,
  });

  // ====== Fetch Lessons List with Active Query Filters ======
  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (visibilityFilter !== "all")
        params.set("visibility", visibilityFilter);
      if (flaggedFilter) params.set("flagged", "true");

      const res = await apiFetch(`/api/admin/lessons?${params.toString()}`);
      if (res?.ok) {
        setLessons(res.data || []);

        // Calculate global summary stats metric aggregations from the loaded payload
        const rawData = res.data || [];
        setStats({
          total: rawData.length,
          public: rawData.filter((l) => l.visibility === "public").length,
          private: rawData.filter((l) => l.visibility === "private").length,
          flagged: rawData.filter((l) => (l.reportCount || 0) > 0).length,
        });
      } else {
        toast.error(res?.message || "Failed to load lessons database");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred fetching lessons archive");
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, flaggedFilter, visibilityFilter]);

  useEffect(() => {
    const load = () => {
      fetchLessons();
    };
    load();
  }, [categoryFilter, visibilityFilter, flaggedFilter, fetchLessons]);

  // ====== Toggle Featured State ======
  const handleToggleFeatured = async (id, currentVal) => {
    try {
      setActionLoadingId(id);
      // Optimistic local state update
      setLessons((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isFeatured: !currentVal } : l)),
      );

      const res = await apiFetch(`/api/admin/lessons/${id}/featured`, {
        method: "PATCH",
      });

      if (res?.ok) {
        toast.success(`Lesson featured status updated`);
      } else {
        throw new Error("Action failed on server redirection");
      }
    } catch (err) {
      // Revert state change on error
      setLessons((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isFeatured: currentVal } : l)),
      );
      toast.error(err.message || "Failed to modify featured setting");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ====== Toggle Reviewed State ======
  const handleToggleReviewed = async (id, currentVal) => {
    try {
      setActionLoadingId(id);
      // Optimistic local state update
      setLessons((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isReviewed: !currentVal } : l)),
      );

      const res = await apiFetch(`/api/admin/lessons/${id}/reviewed`, {
        method: "PATCH",
      });

      if (res?.ok) {
        toast.success(
          currentVal
            ? `Lesson marked as not reviewed`
            : `Lesson marked as reviewed`,
        );
      } else {
        throw new Error("Action failed on database update");
      }
    } catch (err) {
      // Revert state change on error
      setLessons((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isReviewed: currentVal } : l)),
      );
      toast.error(err.message || "Failed to modify reviewed status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ====== Delete Lesson Integration Flow ======
  const handleDeleteLesson = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await apiFetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
      });

      if (res?.ok) {
        toast.success(
          res.message || "Lesson deleted successfully from database",
        );
        setLessons((prev) => prev.filter((l) => l._id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      } else {
        toast.error(res?.message || "Failed to complete archival deletion");
      }
    } catch (err) {
      toast.error(
        err.message || "An exception error prevented removal execution",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setVisibilityFilter("all");
    setFlaggedFilter(false);
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manage Lessons
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Oversee, verify review logs, feature outstanding content, and moderate
          shared community lessons.
        </p>
      </div>

      {/* STATS COUNT OVERVIEW ROW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Lessons
              </p>
              <h3 className="text-xl font-bold">{stats.total}</h3>
            </div>
            <BookOpen className="w-5 h-5 text-indigo-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Public Lessons
              </p>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {stats.public}
              </h3>
            </div>
            <Eye className="w-5 h-5 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Private Lessons
              </p>
              <h3 className="text-xl font-bold text-muted-foreground">
                {stats.private}
              </h3>
            </div>
            <EyeOff className="w-5 h-5 text-slate-400 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Reported Lessons
              </p>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {stats.flagged}
              </h3>
            </div>
            <AlertTriangle className="w-5 h-5 text-rose-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* ADMIN CONTROL MODERATION FILTER TOOLBAR BAR */}
      <div className="p-4 border rounded-xl bg-card/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </div>

          {/* Category Configuration Dropdown Selector */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-42.5 h-9 text-xs">
              <SelectValue placeholder="Category Selection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Visibility Controller State Dropdown Menu Selector */}
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-35 h-9 text-xs">
              <SelectValue placeholder="Visibility Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          {/* Flagged Item Moderation Toggle Layout Input */}
          <div className="flex items-center space-x-2 border rounded-md px-3 h-9 bg-background/50 hover:bg-background transition-colors">
            <Checkbox
              id="flagged-toggle"
              checked={flaggedFilter}
              onCheckedChange={(checked) => setFlaggedFilter(!!checked)}
            />
            <Label
              htmlFor="flagged-toggle"
              className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
            >
              Flagged Content Only
            </Label>
          </div>

          {(categoryFilter !== "all" ||
            visibilityFilter !== "all" ||
            flaggedFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs h-9 px-2 hover:bg-muted"
            >
              <FilterX className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
          )}
        </div>

        <div className="text-[11px] font-medium text-muted-foreground">
          Query Match: {lessons.length} items
        </div>
      </div>

      {/* CORE MODERATION WORKSPACE GRID TABLE CONFIGURATION */}
      {isLoading ? (
        /* Structural Skeleton Buffer Grid Rows Placeholder elements mapping */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 bg-muted/30 h-10 border-b animate-pulse" />
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-muted/40 rounded-md w-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : lessons.length === 0 ? (
        /* Empty Filter Bounds Layout representation wrapper box context */
        <div className="text-center p-14 border border-dashed rounded-xl bg-card/40 space-y-3">
          <p className="text-xs text-muted-foreground">
            No platform lessons found matching chosen configuration bounds
            parameters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs h-8"
          >
            Reset Active Filters
          </Button>
        </div>
      ) : (
        /* Horizontally Scrollable Content Table Interface */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Tone</TableHead>
                  <TableHead className="text-xs">Access</TableHead>
                  <TableHead className="text-xs">Visibility</TableHead>
                  <TableHead className="text-xs text-center">
                    Featured
                  </TableHead>
                  <TableHead className="text-xs text-center">
                    Reviewed
                  </TableHead>
                  <TableHead className="text-xs text-center">Flags</TableHead>
                  <TableHead className="text-xs">Likes</TableHead>
                  <TableHead className="text-xs">Created Date</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => {
                  const isRowUpdating = actionLoadingId === lesson._id;

                  return (
                    <TableRow
                      key={lesson._id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      {/* Truncated Hover Tooltip Title Block wrapper */}
                      <TableCell className="font-medium text-xs max-w-42.5">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-default text-foreground">
                                {lesson.title}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-xs p-2"
                            >
                              <p className="font-semibold mb-1">
                                {lesson.title}
                              </p>
                              <p className="text-muted-foreground font-normal line-clamp-3">
                                {lesson.description ||
                                  "No item summary data description drafted."}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      {/* Category Badge Column */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {lesson.category}
                      </TableCell>

                      {/* Emotional Tone Badge Column */}
                      <TableCell>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground whitespace-nowrap">
                          {lesson.emotionalTone}
                        </span>
                      </TableCell>

                      {/* Access Level Badge Column */}
                      <TableCell>
                        {lesson.accessLevel === "premium" ? (
                          <Badge className="bg-purple-600 hover:bg-purple-600 border-none text-white text-[10px] px-1.5 py-0">
                            Premium
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600 border-none text-white text-[10px] px-1.5 py-0">
                            Free
                          </Badge>
                        )}
                      </TableCell>

                      {/* Visibility State Badge Column */}
                      <TableCell>
                        {lesson.visibility === "public" ? (
                          <Badge className="bg-blue-600 hover:bg-blue-600 border-none text-white text-[10px] px-1.5 py-0">
                            public
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 text-muted-foreground"
                          >
                            private
                          </Badge>
                        )}
                      </TableCell>

                      {/* Featured Icon Toggle Button Indicator Action column row interaction component */}
                      <TableCell className="text-center">
                        <button
                          type="button"
                          disabled={isRowUpdating}
                          onClick={() =>
                            handleToggleFeatured(lesson._id, lesson.isFeatured)
                          }
                          className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 p-1 mx-auto block"
                          title="Toggle system featured node designation status metrics tag"
                        >
                          {lesson.isFeatured ? (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Star className="w-4 h-4 text-muted-foreground opacity-40 hover:opacity-100" />
                          )}
                        </button>
                      </TableCell>

                      {/* Reviewed Checklist Status Toggle Button indicator action cell wrapper container element row alignment box block */}
                      <TableCell className="text-center">
                        <button
                          type="button"
                          disabled={isRowUpdating}
                          onClick={() =>
                            handleToggleReviewed(lesson._id, lesson.isReviewed)
                          }
                          className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 p-1 mx-auto block"
                          title="Toggle administrative checklist verification metric log notation"
                        >
                          {lesson.isReviewed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-none" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 hover:text-emerald-400" />
                          )}
                        </button>
                      </TableCell>

                      {/* Flagged Report Count Warning Badge Counter element evaluation rendering layout */}
                      <TableCell className="text-center">
                        {(lesson.reportCount || 0) > 0 ? (
                          <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 font-bold border border-rose-200/50 text-[10px] py-0 px-1.5">
                            {lesson.reportCount}
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50">
                            0
                          </span>
                        )}
                      </TableCell>

                      {/* Likes Metric Counter Information column data box item alignment */}
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 opacity-60" />
                          <span>{lesson.likesCount || 0}</span>
                        </div>
                      </TableCell>

                      {/* Creation Timestamp Calendar configuration layout row alignment wrapper container element block metrics data */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 opacity-60" />
                          <span>
                            {lesson.createdAt
                              ? new Date(lesson.createdAt).toLocaleDateString(
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

                      {/* ACTIONS COLUMNS ARCHIVAL DELETION SYSTEM INTERACTIVE ALERTS FLOW PANEL */}
                      <TableCell className="text-right whitespace-nowrap">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isRowUpdating}
                              className="h-7 text-[11px] px-2 text-destructive border-slate-200 hover:bg-destructive/10 hover:text-destructive dark:border-zinc-800"
                            >
                              {isRowUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <Trash2 className="w-3 h-3 mr-1" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Execute Lesson Purge?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete
                                &quot;{lesson.title}&quot;?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLesson(lesson._id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Confirm Permanent Deletion
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
