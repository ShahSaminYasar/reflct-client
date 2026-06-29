"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  XCircle,
  Loader2,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function ReportedLessonsPage() {
  const [reportedLessons, setReportedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal Control States
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ====== Fetch Reported Lessons ======
  const fetchReportedLessons = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch("/api/admin/reported-lessons");
      if (res?.ok) {
        setReportedLessons(res.data || []);
      } else {
        toast.error(res?.message || "Failed to load flagged reports archive");
      }
    } catch (err) {
      toast.error(
        err.message || "An error occurred retrieving reported entries",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = () => {
      fetchReportedLessons();
    };
    load();
  }, []);

  // ====== Action: Permanently Delete Lesson ======
  const handleDeleteLesson = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await apiFetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
      });

      if (res?.ok) {
        toast.success(res.message || "Lesson permanently purged from platform");
        setReportedLessons((prev) => prev.filter((l) => l._id !== id));
        setIsModalOpen(false);
      } else {
        toast.error(res?.message || "Failed to complete lesson deletion");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred during removal");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ====== Action: Clear/Ignore All Reports ======
  const handleIgnoreReports = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await apiFetch(`/api/admin/reported-lessons/${id}/ignore`, {
        method: "DELETE",
      });

      if (res?.ok) {
        toast.success(res.message || "Flagged incident warnings cleared");
        setReportedLessons((prev) => prev.filter((l) => l._id !== id));
        setIsModalOpen(false);
      } else {
        toast.error(res?.message || "Failed to clear violation warnings");
      }
    } catch (err) {
      toast.error(
        err.message || "An exception error occurred modifying report logs",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const openReportsModal = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Reported Lessons
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reported posts by the community
          </p>
        </div>
        {!isLoading && reportedLessons.length > 0 && (
          <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/50 text-xs font-semibold py-1 px-3">
            Flagged Items: {reportedLessons.length}
          </Badge>
        )}
      </div>

      {/* CORE MODERATION FEED WORKSPACE */}
      {isLoading ? (
        /* Dynamic Placeholder Loading States Grid Rows Layout */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 bg-muted/30 h-10 border-b animate-pulse" />
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-muted/40 rounded-md w-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : reportedLessons.length === 0 ? (
        /* Complete Pristine Platform Empty State Block Configuration Layout */
        <div className="text-center p-16 border border-dashed rounded-2xl bg-card/40 space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              No reported lessons
            </h3>
            <p className="text-xs text-muted-foreground">
              Reported posts will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* Structured Responsive Table Module Layout */
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Visibility</TableHead>
                  <TableHead className="text-xs">Report Count</TableHead>
                  <TableHead className="text-xs">Created Date</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedLessons.map((lesson) => {
                  const isRowUpdating = actionLoadingId === lesson._id;

                  return (
                    <TableRow
                      key={lesson._id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      {/* Truncated Hover Tooltip Title Block element placement layout mapping */}
                      <TableCell className="font-medium text-xs max-w-55">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-default text-foreground font-semibold">
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
                                  "No descriptions uploaded for this entry."}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      {/* Category Badge Metric Tag */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {lesson.category}
                      </TableCell>

                      {/* Visibility State Evaluation Layout configuration */}
                      <TableCell>
                        {lesson.visibility === "public" ? (
                          <Badge className="bg-blue-600 hover:bg-blue-600 border-none text-white text-[10px] px-1.5 py-0 font-normal">
                            public
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 text-muted-foreground font-normal"
                          >
                            private
                          </Badge>
                        )}
                      </TableCell>

                      {/* Report Count Always Highlights Red Status alert metric tag row box */}
                      <TableCell>
                        <Badge className="bg-rose-600 hover:bg-rose-600 border-none text-white font-bold text-[10px] py-0 px-2">
                          {lesson.reportCount || lesson.reports?.length || 0}{" "}
                          reports
                        </Badge>
                      </TableCell>

                      {/* Creation Timeline Calendar Row Info metrics wrap box */}
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

                      {/* CONTEXT ACTIONS TOOLBAR PANEL STREAM METRICS */}
                      <TableCell className="text-right whitespace-nowrap space-x-2">
                        {/* View Reports Button Modal trigger handler line element info layout row box */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReportsModal(lesson)}
                          disabled={isRowUpdating}
                          className="h-7 text-[11px] px-2.5"
                        >
                          <Eye className="w-3 h-3 mr-1" /> View Logs
                        </Button>

                        {/* Ignore Action Component Element layout mapping configuration alerts trigger buttons */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isRowUpdating}
                              className="h-7 text-[11px] px-2 text-muted-foreground border-slate-200 hover:bg-slate-50 hover:text-foreground dark:border-zinc-800"
                            >
                              <ShieldCheck className="w-3 h-3 mr-1 text-slate-400" />{" "}
                              Ignore
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Clear Report Flags?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to dismiss all reports for
                                &quot;{lesson.title}
                                &quot;?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleIgnoreReports(lesson._id)}
                                className="bg-zinc-800 text-white hover:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900"
                              >
                                Clear All Reports
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {/* Direct Removal Action Block dialog layout container components alignment details info wrapper block trigger element */}
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
                                Delete Lesson Permanently?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This operation will instantly delete &quot;
                                {lesson.title}&quot;. The action CANNOT be
                                undone!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLesson(lesson._id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Confirm Delete
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

      {/* REPORTS DETAILED INCIDENT VIEW MODAL DIALOG ELEMENT LAYOUT CONFIGURATION */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-137.5 max-h-[85vh] overflow-y-auto">
          {selectedLesson && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="line-clamp-2">
                    Reports Log: {selectedLesson.title}
                  </div>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Review active reasons filed by users regarding content
                  violations or policy updates.
                </DialogDescription>
              </DialogHeader>

              {/* LIST EMBEDDED PROFILE REPORT INCIDENTS WRAPPER BOX PANELS CONTAINER DETAILS INFORMATION */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {!selectedLesson.reports ||
                selectedLesson.reports.length === 0 ? (
                  <p className="text-xs text-center py-6 text-muted-foreground italic">
                    No descriptive log details are archived on this instance
                    file node.
                  </p>
                ) : (
                  selectedLesson.reports.map((report) => (
                    <div
                      key={report._id}
                      className="p-3 rounded-lg border bg-muted/40 space-y-1.5 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-muted-foreground border-b pb-1">
                        <span className="font-semibold text-foreground truncate max-w-70">
                          From:{" "}
                          {report.reportedUserEmail || "anonymous@reflct.com"}
                        </span>
                        <span className="whitespace-nowrap">
                          {new Date(report.timestamp).toLocaleString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-foreground font-medium bg-background/60 p-2 rounded border border-dashed mt-1 leading-relaxed">
                        &ldquo;{report.reason}&rdquo;
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* ACTION TOOLBAR FOOTER EMBEDDED DIRECTLY AT BOTTOM OF LOG VIEW DETAILS INTERACTION SCREEN OVERLAY BOX WINDOW MODAL CONTAINER */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-9"
                >
                  Close View
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleIgnoreReports(selectedLesson._id)}
                  disabled={actionLoadingId === selectedLesson._id}
                  className="text-xs h-9 text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400" />{" "}
                  Ignore All
                </Button>

                <Button
                  type="button"
                  onClick={() => handleDeleteLesson(selectedLesson._id)}
                  disabled={actionLoadingId === selectedLesson._id}
                  className="text-xs h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {actionLoadingId === selectedLesson._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Delete Lesson
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
