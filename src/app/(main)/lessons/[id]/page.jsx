"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  Star,
  Flag,
  MessageSquare,
  Trash2,
  Edit,
  ArrowLeft,
  Send,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import moment from "moment";

export default function LessonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const currentUserId = session?.user?.id;

  // ====== Fetch Lesson Query ======
  const {
    data: lessonData,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await apiFetch(`/api/lessons/${id}`);
      if (!res?.ok) throw new Error(res?.message || "Failed to load lesson");
      return res.data;
    },
  });

  // ====== Fetch Comments Query ======
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await apiFetch(`/api/lessons/${id}/comments`);
      return res?.data || [];
    },
  });

  // ====== Like Mutation ======
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/lessons/${id}/like`, {
        method: "PATCH",
      });
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Updated like status");
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
    },
    onError: () => toast.error("Failed to toggle like"),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/lessons/${id}/favorite`, {
        method: "PATCH",
      });
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Updated favorites");
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
    },
    onError: () => toast.error("Failed to toggle favorite"),
  });

  const reportMutation = useMutation({
    mutationFn: async (reason) => {
      const res = await apiFetch(`/api/lessons/${id}/report`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      if (!res?.ok) throw new Error(res?.message || "Failed to report");
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Report submitted");
      setReportReason("");
      setIsReportOpen(false);
    },
    onError: (err) => toast.error(err.message || "Failed to submit report"),
  });

  const postCommentMutation = useMutation({
    mutationFn: async (text) => {
      const res = await apiFetch(`/api/lessons/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      if (!res?.ok) throw new Error(res?.message || "Failed to post comment");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
    onError: (err) => toast.error(err.message || "Failed to post comment"),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/lessons/${id}`, { method: "DELETE" });
      if (!res?.ok) throw new Error(res?.message || "Failed to delete lesson");
      return res;
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully");
      router.push("/dashboard/my-lessons");
    },
    onError: (err) => toast.error(err.message || "Failed to delete lesson"),
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    postCommentMutation.mutate(commentText);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    reportMutation.mutate(reportReason);
  };

  const isAuthor = lessonData?.authorId === currentUserId;

  useEffect(() => {
    if (
      !isAuthor &&
      lessonData?.accessLevel === "premium" &&
      !session?.user?.isPremium
    ) {
      toast.warning("You need to be a premium user to access this content");
      router.push("/pricing");
    }
  }, [isAuthor, lessonData, session, router]);

  if (isLessonLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading lesson data...
        </p>
      </div>
    );

  if (isLessonError || !lessonData)
    return (
      <p className="text-center py-20 text-destructive">
        Failed to fetch this lesson.
      </p>
    );

  const isLikedByMe = lessonData?.likes?.includes(currentUserId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/dashboard/my-lessons"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>
        </Button>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/edit-lesson/${lessonData._id}`}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove
                    the lesson and all associated metadata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteLessonMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {lessonData?.image && (
        <div className="relative rounded-xl overflow-hidden border bg-muted aspect-video max-h-95 w-full">
          <Image
            src={lessonData.image}
            alt={lessonData.title}
            className="w-full h-full object-cover"
            width={1280}
            height={720}
            loading="eager"
          />
        </div>
      )}

      {/* Metadata & Title */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {lessonData.title}
        </h1>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="capitalize">
            {lessonData.category}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {lessonData.emotionalTone}
          </Badge>
          <Badge
            variant={
              lessonData.accessLevel === "premium" ? "destructive" : "default"
            }
            className="capitalize"
          >
            {lessonData.accessLevel}
          </Badge>
          <Badge
            variant="zinc"
            className="capitalize bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            {lessonData.visibility}
          </Badge>
        </div>

        {/* Creator Info */}
        {lessonData.author && (
          <div className="flex items-center gap-3 py-2 border-y">
            <Image
              src={lessonData.author.image || "/placeholder-avatar.png"}
              alt={lessonData.author.name}
              className="w-10 h-10 rounded-full object-cover border"
              width={120}
              height={120}
            />
            <div>
              <Link
                href={`/author/${lessonData?.authorId}`}
                className="flex items-center gap-1.5 font-medium text-sm"
              >
                {lessonData.author.name}{" "}
                <span className="italic font-normal">
                  ({lessonData?.author?.totalPosts} posts)
                </span>
                {lessonData.author.isPremium && (
                  <Badge
                    variant="premium"
                    className="bg-amber-500 text-white text-[10px] px-1 py-0 scale-90"
                  >
                    PRO
                  </Badge>
                )}
              </Link>
              <div className="flex gap-1">
                <p className="text-xs text-muted-foreground">
                  Published:{" "}
                  {moment(lessonData?.createdAt).format("DD MMM YYYY")} |
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated: {moment(lessonData?.updatedAt).format("DD MMM YYYY")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Content Body */}
      <article className="prose dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
        {lessonData.description}
      </article>

      {/* Action Footnotes (Likes, Favorites, Reports) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
        <div className="flex items-center gap-3">
          <Button
            variant={isLikedByMe ? "default" : "outline"}
            size="sm"
            onClick={() => toggleLikeMutation.mutate()}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isLikedByMe ? "fill-current" : ""}`} />
            <span>Like ({lessonData.likesCount || 0})</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavoriteMutation.mutate()}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Favorite ({lessonData.favoritesCount || 0})</span>
          </Button>
        </div>

        {!isAuthor && (
          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <Flag className="w-4 h-4" /> Report Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleReportSubmit}>
                <DialogHeader>
                  <DialogTitle>Report Lesson</DialogTitle>
                  <DialogDescription>
                    Please give a clean detail why this lesson violates safety
                    policies or system guidelines.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Provide precise reason..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsReportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={reportMutation.isPending}
                  >
                    Submit Report
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Comments Section */}
      <div className="border-t pt-6 space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-xl font-bold">
            Comments ({comments?.length || 0})
          </h3>
        </div>

        {/* Comment input field */}
        <form onSubmit={handlePostComment} className="flex gap-2">
          <Input
            placeholder={
              session
                ? "Write an insightful comment..."
                : "Log in to post your response..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!session || postCommentMutation.isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!session || postCommentMutation.isPending}
            size="sm"
          >
            <Send className="w-4 h-4 mr-1" /> Post
          </Button>
        </form>

        {/* Comments Feed UI */}
        <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
          {isCommentsLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading comments feed...
            </p>
          ) : comments?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No thoughts logged yet. Start the conversation!
            </p>
          ) : (
            comments?.map((comment, index) => (
              <div
                key={comment._id || index}
                className="p-4 rounded-lg bg-card border space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={comment.userImage || "/placeholder-avatar.png"}
                    alt={comment.userName}
                    className="w-6 h-6 rounded-full object-cover"
                    width={120}
                    height={120}
                  />
                  <span className="text-sm font-semibold">
                    {comment.userName}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
