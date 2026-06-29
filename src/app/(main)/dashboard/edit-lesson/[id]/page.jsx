"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import Image from "next/image";
import { apiFetch } from "@/lib/apiFetch";
import { useSession } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditLessonPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const isPremium = session?.user?.isPremium || false;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    visibility: "public",
    accessLevel: "free",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await apiFetch(`/api/lessons/${id}`);

        const lesson = res?.data;

        setFormData({
          title: lesson.title,
          description: lesson.description,
          category: lesson.category,
          emotionalTone: lesson.emotionalTone,
          visibility: lesson.visibility,
          accessLevel: lesson.accessLevel,
        });

        if (lesson.image) {
          setImagePreview(lesson.image);
        }
      } catch (error) {
        toast.error("Failed to load lesson");
        router.push("/dashboard/my-lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, router]);

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        toast.info("Uploading new image...");
        imageUrl = await uploadToImgbb(imageFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        emotionalTone: formData.emotionalTone,
        visibility: formData.visibility,
        accessLevel: formData.accessLevel,
        image: imageUrl,
      };

      const data = await apiFetch(`/api/lessons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (data.ok) {
        toast.success("Lesson updated successfully!");
        router.push("/dashboard/my-lessons");
      } else {
        toast.error(data.message || "Failed to update lesson");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading lesson data...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Lesson</CardTitle>
            <p className="text-muted-foreground">Update your lesson details</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label>Lesson Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Full Story / Insight</Label>
                <Textarea
                  required
                  rows={10}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Emotional Tone</Label>
                  <Select
                    value={formData.emotionalTone}
                    onValueChange={(v) =>
                      setFormData({ ...formData, emotionalTone: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Visibility & Access Level */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label>Visibility</Label>
                  <RadioGroup
                    value={formData.visibility}
                    onValueChange={(v) =>
                      setFormData({ ...formData, visibility: v })
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="public" id="pub" />
                        <Label htmlFor="pub">Public</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="private" id="priv" />
                        <Label htmlFor="priv">Private</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Select
                            value={formData.accessLevel}
                            onValueChange={(v) =>
                              setFormData({ ...formData, accessLevel: v })
                            }
                            disabled={!isPremium}
                          >
                            <SelectTrigger
                              className={
                                !isPremium
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">
                                Free - Visible to everyone
                              </SelectItem>
                              <SelectItem value="premium" disabled={!isPremium}>
                                Premium - Visible only to Premium users
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      {!isPremium && (
                        <TooltipContent>
                          <p>Upgrade to Premium to create paid lessons.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Featured Image (Optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={500}
                      height={300}
                      className="rounded-xl max-h-72 object-cover"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {submitting ? "Updating Lesson..." : "Update Lesson"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
