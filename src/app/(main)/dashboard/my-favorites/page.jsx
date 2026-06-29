"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  Loader2,
  Heart,
  Star,
  FilterX,
  SlidersHorizontal,
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
  Select,
  SelectContent,
  SelectItem,
  Trigger,
  SelectValue,
  SelectTrigger,
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
import Image from "next/image";
import { HeartIcon, StarIcon } from "@phosphor-icons/react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const EMOTIONAL_TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [toneFilter, setToneFilter] = useState("all");

  // ====== Fetch Favorites Data ======
  useEffect(() => {
    async function fetchFavorites() {
      try {
        setIsLoading(true);
        const res = await apiFetch("/api/favorites");
        if (res?.ok) {
          setFavorites(res.data || []);
        } else {
          toast.error(res?.message || "Failed to load favorites");
        }
      } catch (err) {
        toast.error(
          err.message || "An error occurred while fetching favorites",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  // ====== Handle Remove Favorite (Toggle Api) ======
  const handleRemoveFavorite = async (lessonId) => {
    try {
      const res = await apiFetch(`/api/lessons/${lessonId}/favorite`, {
        method: "PATCH",
      });

      if (res.ok) {
        toast.success("Removed from favorites");
      }

      setFavorites((prev) => prev.filter((item) => item._id !== lessonId));
    } catch (err) {
      toast.error(err.message || "Failed to remove from favorites");
    }
  };

  // ====== Client-Side Filter Logic ======
  const filteredFavorites = favorites.filter((lesson) => {
    const matchCategory =
      categoryFilter === "all" || lesson.category === categoryFilter;
    const matchTone =
      toneFilter === "all" || lesson.emotionalTone === toneFilter;
    return matchCategory && matchTone;
  });

  const clearFilters = () => {
    setCategoryFilter("all");
    setToneFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Retrieving your collection...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          My Favorites
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your favourites collection.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-42.5 h-9 text-xs">
              <SelectValue placeholder="Category" />
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

          {/* Emotional Tone Filter */}
          <Select value={toneFilter} onValueChange={setToneFilter}>
            <SelectTrigger className="w-40 h-9 text-xs">
              <SelectValue placeholder="Emotional Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tones</SelectItem>
              {EMOTIONAL_TONES.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(categoryFilter !== "all" || toneFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-9 px-2"
            >
              <FilterX className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          Showing {filteredFavorites.length} of {favorites.length} items
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      {filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-xl bg-card/40 space-y-3">
          <div className="p-3 bg-muted rounded-full">
            <Heart className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">No favorite lessons found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {favorites.length > 0
                ? "Try adjusting your custom filter settings to explore more saved records."
                : "Explore and mark lessons as your favorite to track them here."}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs mt-2"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-20">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Emotional Tone</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Saved Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFavorites.map((lesson) => (
                  <TableRow
                    key={lesson._id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    {/* Thumbnail Image Column */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border relative flex items-center justify-center">
                        {lesson.image ? (
                          <Image
                            src={lesson.image}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                            width={300}
                            height={300}
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            None
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Title & Metadata Summary Column */}
                    <TableCell className="font-medium max-w-55">
                      <div className="truncate text-sm" title={lesson.title}>
                        {lesson.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <HeartIcon
                            size={14}
                            weight="duotone"
                            color="#c85c32"
                          />{" "}
                          {lesson.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <StarIcon
                            size={14}
                            weight="duotone"
                            color="#d5971a"
                          />{" "}
                          {lesson.favoritesCount || 0}
                        </span>
                      </div>
                    </TableCell>

                    {/* Category Column */}
                    <TableCell className="text-xs text-muted-foreground">
                      {lesson.category}
                    </TableCell>

                    {/* Emotional Tone Column */}
                    <TableCell className="text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground">
                        {lesson.emotionalTone}
                      </span>
                    </TableCell>

                    {/* Styled Access Level Badge */}
                    <TableCell>
                      {lesson.accessLevel === "premium" ? (
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none text-[11px]">
                          Premium
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none text-[11px]">
                          Free
                        </Badge>
                      )}
                    </TableCell>

                    {/* Date Column */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {lesson.savedAt
                        ? new Date(lesson.savedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </TableCell>

                    {/* Structured Actions Column */}
                    <TableCell className="text-right whitespace-nowrap space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        asChild
                      >
                        <Link href={`/lessons/${lesson._id}`}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> See Details
                        </Link>
                      </Button>

                      {/* Explicit Removal Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove from Favorites?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove &quot;
                              {lesson.title}&quot; from your favorites
                              collection? You can bookmark it again later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveFavorite(lesson._id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Confirm Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
