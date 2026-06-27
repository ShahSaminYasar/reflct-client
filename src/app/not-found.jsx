// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-[120px] font-bold text-transparent bg-clip-text bg-primary leading-none">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            Oops! The lesson you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/lessons">
              <ArrowLeft className="w-5 h-5" />
              Browse Lessons
            </Link>
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
          Reflct - Digital Life Lessons
        </p>
      </div>
    </div>
  );
}
