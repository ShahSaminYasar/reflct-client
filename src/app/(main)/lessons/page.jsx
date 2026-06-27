"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  Lock,
  ArrowRight,
  Heart,
  Star,
  Calendar,
  FilterX,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { LockIcon } from "@phosphor-icons/react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const EMOTIONAL_TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function PublicLessonsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isPremium = session?.user?.isPremium || false;

  // Read initial states straight from standard URL search parameters
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentTone = searchParams.get("emotionalTone") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Local state holding temporary query input strings before trigger debouncing
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [lessons, setLessons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ====== Synchronize search input if URL changes externally ======
  useEffect(() => {
    const load = () => {
      setSearchInput(currentSearch);
    };

    load();
  }, [currentSearch]);

  // ====== URL Param Push Utility Helper ======
  const updateQueryParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "all" ||
          value === ""
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Always default change back to page 1 unless pagination is explicitly provided
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }
      router.push(`/lessons?${params.toString()}`);
    },
    [searchParams, router],
  );

  // ====== Search Input Debouncer Effect ======
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateQueryParams({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, currentSearch, updateQueryParams]);

  // ====== Main Data Fetch Effect loop handler ======
  useEffect(() => {
    async function fetchLessonsList() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (currentSearch) params.set("search", currentSearch);
        if (currentCategory !== "all") params.set("category", currentCategory);
        if (currentTone !== "all") params.set("emotionalTone", currentTone);
        params.set("sort", currentSort);
        params.set("page", String(currentPage));

        const res = await apiFetch(`/api/lessons?${params.toString()}`);
        if (res?.ok) {
          setLessons(res.data || []);
          setTotalPages(res.totalPages || 1);
          setTotalItems(res.total || 0);
        } else {
          toast.error(res?.message || "Failed to parse public lessons archive");
        }
      } catch (err) {
        toast.error(err.message || "An exception occurred loading resources");
      } finally {
        setIsLoading(false);
      }
    }
    fetchLessonsList();
  }, [currentSearch, currentCategory, currentTone, currentSort, currentPage]);

  const handleClearFilters = () => {
    setSearchInput("");
    router.push("/lessons");
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateQueryParams({ page: newPage });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Public Reflections
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse public growth lessons, community insights, and shared knowledge
          archives.
        </p>
      </div>

      {/* SEARCH / FILTERS / SORT OPTIONS TOOLBAR */}
      <div className="p-4 rounded-xl border bg-card/70 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Keyword Search Input */}
          <div className="relative lg:col-span-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <Select
              value={currentCategory}
              onValueChange={(val) => updateQueryParams({ category: val })}
            >
              <SelectTrigger className="h-10 text-xs">
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
          </div>

          {/* Emotional Tone Dropdown */}
          <div className="lg:col-span-2">
            <Select
              value={currentTone}
              onValueChange={(val) => updateQueryParams({ emotionalTone: val })}
            >
              <SelectTrigger className="h-10 text-xs">
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
          </div>

          {/* Sort Control */}
          <div className="lg:col-span-2">
            <Select
              value={currentSort}
              onValueChange={(val) => updateQueryParams({ sort: val })}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="most-saved">Most Saved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Action Button */}
          <div className="lg:col-span-2 flex">
            {currentSearch ||
            currentCategory !== "all" ||
            currentTone !== "all" ||
            currentSort !== "newest" ? (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full h-10 text-xs"
              >
                <FilterX className="w-3.5 h-3.5 mr-1.5" /> Reset Filters
              </Button>
            ) : (
              <div className="w-full text-xs text-muted-foreground flex items-center justify-center border border-dashed rounded-lg bg-muted/20 select-none px-2 py-1">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Filtering
                Ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEED RESPONSE DATA WORKSPACE GRID */}
      {isLoading ? (
        /* Skeleton loading grid stream blocks placeholder state */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-xl bg-card overflow-hidden h-102.5 flex flex-col space-y-4 animate-pulse"
            >
              <div className="w-full aspect-video bg-muted" />
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : lessons.length === 0 ? (
        /* Complete empty state matches filter configurations definitions object layout */
        <div className="text-center p-16 border border-dashed rounded-2xl bg-card/50 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">No lessons discovered</h3>
            <p className="text-xs text-muted-foreground">
              We couldn&apos;t match any results for your currently selected
              system search query parameters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            Clear Active Filters
          </Button>
        </div>
      ) : (
        /* Standard Lesson Dynamic mapping rendering element workspace view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const isLockedPremium =
              lesson.accessLevel === "premium" && !isPremium;

            return (
              <Card
                key={lesson?._id}
                className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg pt-0"
              >
                {/* Fixed Image Wrapper Box Area */}
                <div className="relative">
                  {lesson.image ? (
                    <Image
                      src={lesson.image}
                      alt={lesson.title}
                      className={`w-full h-full aspect-video object-cover transition-all ${isLockedPremium ? "blur-sm" : ""}`}
                      width={500}
                      height={500}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br from-indigo-100 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center ${isLockedPremium ? "blur-sm" : ""}`}
                    >
                      <span className="text-[11px] tracking-wider text-muted-foreground font-semibold uppercase">
                        Reflct Lesson
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 z-10">
                    {lesson.accessLevel === "premium" ? (
                      <Badge className="bg-purple-600 hover:bg-purple-600 border-none text-white text-[10px] px-2 py-0">
                        Premium
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600 border-none text-white text-[10px] px-2 py-0">
                        Free
                      </Badge>
                    )}
                  </div>

                  {/* Locked Screen Overlay Layer block element representation */}
                  {isLockedPremium && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-20 space-y-1 shadow-none">
                      <div className="p-1.5 bg-background border rounded-full shadow-sm text-primary">
                        <LockIcon size={32} />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Premium Lesson
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Upgrade to access full details
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Information Header Content Section info row block element */}
                <CardHeader className="p-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-normal"
                    >
                      {lesson.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 font-normal bg-secondary text-secondary-foreground"
                    >
                      {lesson.emotionalTone}
                    </Badge>
                  </div>

                  <CardTitle
                    className={`text-base font-bold line-clamp-1 leading-snug pt-0.5 ${isLockedPremium ? "opacity-40 select-none" : ""}`}
                    title={lesson.title}
                  >
                    {lesson.title}
                  </CardTitle>

                  <CardDescription
                    className={`text-xs line-clamp-2 leading-relaxed ${isLockedPremium ? "opacity-30 select-none" : ""}`}
                  >
                    {lesson.description ||
                      "No preview information is cataloged for this public entry block item."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-4 py-3 border-t">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        👍 {lesson.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-0.5">
                        ⭐ {lesson.favoritesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(lesson.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                    <span>By:</span>
                    <span className="text-foreground">Reflct User</span>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto p-4 pt-0">
                  {isLockedPremium ? (
                    <Button
                      className="w-full text-xs h-9 mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                      asChild
                    >
                      <Link href="/pricing">
                        Upgrade to Premium{" "}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-xs h-9 mt-3"
                      asChild
                    >
                      <Link href={`/lessons/${lesson._id}`}>See Details</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* FOOTER STANDARD PAGINATION BLOCK SYSTEM */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className="h-8 w-8 p-0 text-xs"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
