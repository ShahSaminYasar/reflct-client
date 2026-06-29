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
import { HeartIcon, LockIcon, StarIcon } from "@phosphor-icons/react";
import moment from "moment";
import LessonCard from "@/components/LessonCard";

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

  useEffect(() => {
    const load = () => {
      setSearchInput(currentSearch);
    };

    load();
  }, [currentSearch]);

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
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }
      router.push(`/lessons?${params.toString()}`);
    },
    [searchParams, router],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateQueryParams({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, currentSearch, updateQueryParams]);

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
        <h1 className="text-3xl font-bold tracking-tight">Public Lessons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse lessons and reflections shared by the community
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-card/70 shadow-sm flex flex-col gap-4">
        <div className="flex flex-row flex-wrap gap-3 items-center">
          <div className="relative lg:col-span-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 w-full max-w-sm"
            />
          </div>

          <div>
            <Select
              value={currentCategory}
              onValueChange={(val) => updateQueryParams({ category: val })}
            >
              <SelectTrigger className={"cursor-pointer min-w-40"}>
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

          <div>
            <Select
              value={currentTone}
              onValueChange={(val) => updateQueryParams({ emotionalTone: val })}
            >
              <SelectTrigger className={"cursor-pointer min-w-40"}>
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

          <div>
            <Select
              value={currentSort}
              onValueChange={(val) => updateQueryParams({ sort: val })}
            >
              <SelectTrigger className={"cursor-pointer min-w-40"}>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="most-saved">Most Saved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Action Button */}
          <div className="ml-auto flex">
            {(currentSearch ||
              currentCategory !== "all" ||
              currentTone !== "all" ||
              currentSort !== "newest") && (
              <Button variant="outline" onClick={handleClearFilters}>
                <FilterX className="w-3.5 h-3.5 mr-1.5" /> Reset Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson?._id} lesson={lesson} />
          ))}
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
