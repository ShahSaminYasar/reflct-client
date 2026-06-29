"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/authClient";
import { clearToken } from "@/lib/token";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    clearToken();
    toast.success("Logged out successfully");
    router.push("/");
    setIsSidebarOpen(false);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-14 left-4 z-999 p-1.5 bg-card border border-border rounded-sm shadow-xs text-foreground"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-998 w-72 border-r border-gray-200 dark:border-slate-800 
          bg-card transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col shrink-0
        `}
      >
        <div className="flex-1 overflow-auto p-4 pt-16 md:pt-4">
          <nav className="space-y-1">
            {userNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeSidebar}
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

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-8">
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
                      onClick={closeSidebar}
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

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 pt-16 md:pt-6">{children}</div>
      </div>
    </div>
  );
}
