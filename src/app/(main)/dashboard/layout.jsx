"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PlusCircle,
  BookOpen,
  Heart,
  User,
  ShieldCheck,
  Users,
  Flag,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { signOut, useSession } from "@/lib/authClient";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = session?.user?.role === "admin";

  if (isPending) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const userNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/add-lesson", label: "Add Lesson", icon: PlusCircle },
    { href: "/dashboard/my-lessons", label: "My Lessons", icon: BookOpen },
    { href: "/dashboard/my-favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const adminNavLinks = [
    { href: "/dashboard/admin", label: "Admin Overview", icon: ShieldCheck },
    {
      href: "/dashboard/admin/manage-users",
      label: "Manage Users",
      icon: Users,
    },
    {
      href: "/dashboard/admin/manage-lessons",
      label: "Manage Lessons",
      icon: BookOpen,
    },
    {
      href: "/dashboard/admin/reported-lessons",
      label: "Reported Lessons",
      icon: Flag,
    },
    {
      href: "/dashboard/admin/profile",
      label: "Admin Profile",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-200 dark:border-slate-800 bg-card shrink-0 hidden md:flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-3">
            <nav className="space-y-1">
              {userNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-card-foreground ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div>
              <p className="text-xs uppercase font-semibold text-primary block pb-2 mb-1 border-b">
                Admin Panel
              </p>
              <nav className="space-y-1">
                {adminNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-card-foreground ${
                        isActive
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                          : "hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
