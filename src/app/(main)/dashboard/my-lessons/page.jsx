"use client";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import Link from "next/link";
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
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function MyLessonsPage() {
  const {
    data: lessons,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-lessons"],
    queryFn: async () => {
      const res = await apiFetch("/api/lessons/my-lessons");
      return res?.data || [];
    },
  });

  const handleDelete = async (lessonId) => {
    try {
      const res = await apiFetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (!res?.ok) {
        toast.error(res?.message || "Failed to delete lesson");
        return;
      }
      toast.success("Lesson deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const toggleVisibility = async (lessonId, currentVisibility) => {
    try {
      const newVisibility =
        currentVisibility === "public" ? "private" : "public";
      await apiFetch(`/api/lessons/${lessonId}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ visibility: newVisibility }),
      });
      toast.success("Visibility updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            My Lessons
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/add-lesson">+ Add New Lesson</Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tone</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Favorites</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-muted-foreground"
                >
                  You haven&apos;t created any lessons yet.
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow key={lesson._id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.category}</TableCell>
                  <TableCell>{lesson.emotionalTone}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        lesson.visibility === "public"
                          ? "default"
                          : "destructive"
                      }
                      className="cursor-pointer capitalize"
                      onClick={() =>
                        toggleVisibility(lesson._id, lesson.visibility)
                      }
                    >
                      {lesson.visibility}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        lesson.accessLevel === "premium"
                          ? "destructive"
                          : "outline"
                      }
                      className={"capitalize"}
                    >
                      {lesson.accessLevel}
                    </Badge>
                  </TableCell>

                  <TableCell>{lesson.likesCount || 0}</TableCell>
                  <TableCell>{lesson.favoritesCount || 0}</TableCell>
                  <TableCell>
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/lessons/${lesson._id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/edit-lesson/${lesson._id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This lesson will be
                            permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(lesson._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
