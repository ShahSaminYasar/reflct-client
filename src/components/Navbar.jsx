"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/authClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { clearToken } from "@/lib/token";
import { Spinner } from "./ui/spinner";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    clearToken();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/lessons", label: "Public Lessons", protected: false },
    { href: "/dashboard/add-lesson", label: "Add Lesson", protected: true },
    { href: "/dashboard/my-lessons", label: "My Lessons", protected: true },
    ...(!session?.user?.isPremium
      ? [{ href: "/pricing", label: "Pricing", protected: true }]
      : []),
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between md:grid md:grid-cols-5 gap-5 h-18">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight text-gray-900"
        >
          Refl<span className="text-indigo-500">ct</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex md:col-span-3 justify-center items-center gap-7 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-indigo-500 transition-colors">
            Home
          </Link>
          {navLinks.map((link) => {
            if (link.protected && !session?.user) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-indigo-500 transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end gap-3">
          {isPending ? (
            <Spinner />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Image
                  src={session?.user?.image || `/placeholder-avatar.png`}
                  alt={session?.user?.name || "User DP"}
                  width={100}
                  height={100}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
                />
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                      {session?.user?.isPremium && (
                        <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                          Premium ⭐
                        </span>
                      )}
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium text-gray-600">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-500"
          >
            Home
          </Link>
          {navLinks.map((link) => {
            if (link.protected && !session?.user) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-500"
              >
                {link.label}
              </Link>
            );
          })}
          {!session?.user && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-indigo-500 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
