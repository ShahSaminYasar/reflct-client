"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";
import {
  User,
  Mail,
  BookOpen,
  Star,
  Crown,
  Edit3,
  Upload,
  Loader2,
  Eye,
  Calendar,
  X,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Edit Form States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoadingProfile(true);
      const res = await apiFetch(`/api/profile/${user.id}`);
      if (res?.ok) {
        setProfileData(res.data);
        setEditName(res.data.user?.name || "");
        setPreviewUrl(res.data.user?.image || "");
      } else {
        toast.error(res?.message || "Failed to load profile details");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred fetching profile");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user.id]);

  useEffect(() => {
    const load = () => {
      fetchProfile();
    };
    load();
  }, [user?.id, fetchProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Name field cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      let finalImageUrl = profileData?.user?.image || "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!imgbbRes.ok) {
          throw new Error("Failed to upload image asset to ImgBB");
        }

        const imgbbData = await imgbbRes.json();
        finalImageUrl = imgbbData?.data?.url || finalImageUrl;
      }

      const patchRes = await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: editName.trim(),
          image: finalImageUrl,
        }),
      });

      if (patchRes.ok) {
        toast.success(patchRes?.message || "Profile updated successfully");
        setIsEditOpen(false);
        setSelectedFile(null);
        window.location.reload();
      } else {
        toast.error(patchRes.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save profile alterations");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading profile details...
        </p>
      </div>
    );
  }

  const profileUser = profileData?.user || {};
  const publicLessons = profileData?.lessons || [];
  const fallbackAvatar = `/placeholder-avatar.png`;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* PROFILE HEAD INFO BLOCK */}
      <div className="relative border rounded-2xl p-6 md:p-8 bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar Container */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-background bg-muted overflow-hidden shrink-0 shadow-sm">
            <Image
              src={profileUser.image || fallbackAvatar}
              alt={profileUser.name}
              className="w-full h-full object-cover"
              width={120}
              height={120}
            />
          </div>

          {/* User Meta Data Details */}
          <div className="flex-1 text-center md:text-left space-y-3 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold tracking-tight">
                {profileUser.name}
              </h1>
              <div className="flex justify-center md:justify-start">
                {profileUser.isPremium ? (
                  <Badge className="bg-purple-600 text-white hover:bg-purple-600 gap-1 text-xs">
                    <Crown className="w-3 h-3 fill-current" /> Premium
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 text-xs"
                  >
                    Free
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-4 h-4" />
              <span>{profileUser.email}</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto md:mx-0 pt-2">
              <div className="border rounded-xl p-2.5 text-center bg-muted/30">
                <div className="text-xl font-bold text-foreground">
                  {profileUser.lessonsCount || 0}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <BookOpen className="w-3 h-3" /> Total Lessons
                </div>
              </div>
              <div className="border rounded-xl p-2.5 text-center bg-muted/30">
                <div className="text-xl font-bold text-foreground">
                  {profileUser.favoritesCount || 0}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{" "}
                  Favorites
                </div>
              </div>
            </div>
          </div>

          {/* Dialog Action Modal Trigger */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto text-xs mt-2 md:mt-0"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>Edit Profile Info</DialogTitle>
                  <DialogDescription>
                    Make changes and hit save.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Photo Workspace View */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden border relative bg-muted">
                      <Image
                        src={previewUrl || fallbackAvatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        width={120}
                        height={120}
                      />
                    </div>
                    <Label
                      htmlFor="avatar-file"
                      className="cursor-pointer text-xs inline-flex items-center gap-1.5 border px-2.5 py-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </Label>
                    <input
                      type="file"
                      id="avatar-file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Input Name Block */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">Display Name</Label>
                    <Input
                      id="profile-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Input display name"
                      required
                    />
                  </div>

                  {/* Read-Only Email Display */}
                  <div className="space-y-1.5 opacity-70">
                    <Label>Registered Email</Label>
                    <Input
                      value={profileUser.email}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1.5" /> Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* PUBLIC LESSONS GRID SUBSECTION */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            My Public Lessons
          </h2>
        </div>

        {publicLessons.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-xl bg-card/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">No public documents found</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Any public visibility configurations created will appear
                dynamically inside this dashboard stream.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicLessons.map((lesson) => (
              <Card
                key={lesson._id}
                className="flex flex-col h-full bg-card hover:shadow-md transition-shadow overflow-hidden pt-0 max-w-sm mx-auto gap-0"
              >
                <div className="relative aspect-video w-full bg-muted border-b overflow-hidden flex items-center justify-center">
                  {lesson.image ? (
                    <Image
                      src={lesson.image}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No Media Provided
                    </span>
                  )}
                </div>

                <CardHeader className="p-4 space-y-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {lesson.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-muted/70"
                    >
                      {lesson.emotionalTone}
                    </Badge>
                  </div>

                  <CardTitle
                    className="text-base line-clamp-1 leading-snug pt-1"
                    title={lesson.title}
                  >
                    {lesson.title}
                  </CardTitle>

                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {lesson.description ||
                      "No descriptions available for this item."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-4 pb-3 pt-0 flex items-center justify-between border-t border-dashed mt-auto">
                  {/* Access Tag Dynamic Evaluation Layout colors */}
                  <div className="pt-2">
                    {lesson.accessLevel === "premium" ? (
                      <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none text-[10px] py-0 px-2">
                        Premium
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none text-[10px] py-0 px-2">
                        Free
                      </Badge>
                    )}
                  </div>

                  {/* Calendar Timestamp Date creation layout info row block wrapper */}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 pt-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 border-t bg-muted/20">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-9 mt-3"
                    asChild
                  >
                    <Link href={`/lessons/${lesson._id}`}>
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> See Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
