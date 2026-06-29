"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { apiFetch } from "@/lib/apiFetch";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sprout,
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Award,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeroSlider from "@/components/home/HeroSlider";
import WhyLearningMatters from "@/components/home/WhyLearningMatters";
import Image from "next/image";
import { Calendar, HeartIcon, LockIcon, StarIcon } from "@phosphor-icons/react";
import moment from "moment";

// ====== Static Config for Core Benefits ======
const BENEFITS = [
  {
    icon: Brain,
    title: "Preserve Wisdom",
    desc: "Your lessons won't be forgotten. Record milestones, mistakes, and epiphanies permanently in your personal database.",
  },
  {
    icon: Sprout,
    title: "Grow Mindfully",
    desc: "Reflect intentionally on life experiences, track themes, and observe your mental growth over consecutive cycles.",
  },
  {
    icon: Users,
    title: "Learn From Others",
    desc: "Accelerate your trajectory by tap-routing insights from the collective successes and failures of peers.",
  },
  {
    icon: Sparkles,
    title: "Share Your Story",
    desc: "Your processed unique journey can stand as the precise tactical guidepost for someone else's breakthrough.",
  },
];

export default function HomePage() {
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Async API State
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [mostSavedLessons, setMostSavedLessons] = useState([]);

  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [isContributorsLoading, setIsContributorsLoading] = useState(true);
  const [isMostSavedLoading, setIsMostSavedLoading] = useState(true);

  // ====== Fetch Data Hooks Layer ======
  useEffect(() => {
    async function getFeatured() {
      try {
        const res = await apiFetch("/api/lessons/featured");
        if (res?.ok) setFeaturedLessons(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFeaturedLoading(false);
      }
    }

    async function getContributors() {
      try {
        const res = await apiFetch("/api/contributors/top");
        if (res?.ok) setTopContributors(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsContributorsLoading(false);
      }
    }

    async function getMostSaved() {
      try {
        const res = await apiFetch("/api/lessons/most-saved");
        if (res?.ok) setMostSavedLessons(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsMostSavedLoading(false);
      }
    }

    getFeatured();
    getContributors();
    getMostSaved();
  }, []);

  // ====== Reusable Lesson Card Subcomponent Renderer ======
  const renderLessonCard = (lesson) => {
    const isLockedPremium = lesson?.isPremium || false;

    return (
      <Card
        key={lesson?._id}
        className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg pt-0 gap-0 w-full max-w-sm mx-auto"
      >
        {/* Fixed Image Wrapper Box Area */}
        <div className="relative aspect-video">
          <Image
            src={lesson?.image || "/placeholder-thumbnail.png"}
            alt={lesson?.title || "Lesson title"}
            className={`w-full h-full aspect-video object-cover transition-all ${isLockedPremium ? "blur-sm" : ""}`}
            width={500}
            height={500}
          />

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
        <CardHeader className="p-4 space-y-1">
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
            className={`text-lg font-bold line-clamp-1 leading-snug pt-0.5 ${isLockedPremium ? "opacity-40 select-none" : ""}`}
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

        <CardContent className="px-4 pb-3 justify-center h-full gap-2 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <HeartIcon size={14} weight="duotone" color="#c85c32" />{" "}
              {lesson.likesCount || 0}
            </span>
            <span className="flex items-center gap-0.5">
              <StarIcon size={14} weight="duotone" color="#d5971a" />{" "}
              {lesson.favoritesCount || 0}
            </span>
          </div>

          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Image
              src={lesson?.author?.image || "/placeholder-avatar.png"}
              alt={lesson?.author?.name || "User"}
              width={100}
              height={100}
              className={"block aspect-square w-7 rounded-full"}
            />
            <div className="flex flex-col gap-1">
              <span className="text-foreground">{lesson?.author?.name}</span>
              <div className="flex items-center gap-1 text-xs font-normal">
                <Calendar className="w-3 h-3" />
                <span>
                  {moment(lesson.createdAt).format("DD MMM YYYY [at] hh:mma")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto p-4 pt-0">
          {isLockedPremium ? (
            <Button
              className="w-full text-xs h-9 mt-3 bg-purple-600 hover:bg-purple-700 text-white"
              asChild
            >
              <Link href="/pricing">
                Upgrade to Premium <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
  };

  // ====== Reusable Skeleton Grid Loader Subcomponent ======
  const renderCardSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[400px] rounded-xl border bg-card animate-pulse space-y-4 p-4"
        >
          <div className="w-full aspect-video bg-muted rounded-lg" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <HeroSlider />

      <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto w-full bg-white dark:bg-zinc-950">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Community Picks
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Featured Lessons
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Hand-picked premium wisdom compiled by our specialized editorial
            team.
          </p>
        </div>

        {isFeaturedLoading ? (
          renderCardSkeletons()
        ) : featuredLessons.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground italic border border-dashed rounded-xl max-w-md mx-auto">
            No featured lessons posted yet. Check back shortly!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map(renderLessonCard)}
          </div>
        )}
      </section>

      <WhyLearningMatters />

      <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto w-full bg-white dark:bg-zinc-950">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Top Contributors This Week
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Profiles broadcasting the highest quantum of knowledge frameworks
            lately.
          </p>
        </div>

        {isContributorsLoading ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[180px] h-[140px] rounded-xl border bg-card animate-pulse flex flex-col items-center justify-center space-y-2 p-4"
              />
            ))}
          </div>
        ) : topContributors.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground italic border border-dashed rounded-xl max-w-md mx-auto">
            No contributor activity benchmarks tracked yet this cycle.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {topContributors.map((contrib, idx) => {
              const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(contrib.name || "User")}&background=6366f1&color=fff`;
              return (
                <Card
                  key={contrib.authorId || idx}
                  className="w-[200px] bg-card border shadow-sm hover:scale-[1.01] transition-transform text-center p-5 flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border bg-muted shrink-0">
                    <img
                      src={contrib.image || fallbackAvatar}
                      alt={contrib.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground line-clamp-1">
                      {contrib.name}
                    </div>
                    <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                      {contrib.count} lessons this week
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="py-16 sm:py-20 px-4 w-full bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 fill-current" /> High Resonance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Most Saved Lessons
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Exceptional reflections bookmarked the most across the entire
              ecosystem.
            </p>
          </div>

          {isMostSavedLoading ? (
            renderCardSkeletons()
          ) : mostSavedLessons.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground italic border border-dashed rounded-xl max-w-md mx-auto bg-card">
              No saved metrics compiled yet. Start bookmarking models!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostSavedLessons.map(renderLessonCard)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
