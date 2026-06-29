"use client";
import {
  ArrowRightIcon,
  CalendarIcon,
  HeartIcon,
  LockIcon,
  StarIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useSession } from "@/lib/authClient";
import moment from "moment";

const LessonCard = ({ lesson }) => {
  const { data: session } = useSession();

  const isPremium = session?.user?.isPremium || false;
  const isLockedPremium = lesson.accessLevel === "premium" && !isPremium;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg pt-0 gap-0 w-full max-w-sm mx-auto">
      <div className="relative aspect-video">
        <Image
          src={lesson?.image || "/placeholder-thumbnail.png"}
          alt={lesson?.title}
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
          <Link href={`/lessons/${lesson._id}`}>{lesson.title}</Link>
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
            alt={lesson?.author?.name}
            width={100}
            height={100}
            className={"block aspect-square w-7 rounded-full"}
          />
          <div className="flex flex-col gap-1">
            <span className="text-foreground">{lesson?.author?.name}</span>
            <div className="flex items-center gap-1 text-xs font-normal">
              <CalendarIcon className="w-3 h-3" />
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
              Upgrade to Premium{" "}
              <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full text-xs h-9 mt-3" asChild>
            <Link href={`/lessons/${lesson._id}`}>See Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default LessonCard;
