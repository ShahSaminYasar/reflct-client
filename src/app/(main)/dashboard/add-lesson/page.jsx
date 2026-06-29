"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AddLessonPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];

  const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

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
    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        toast.info("Uploading image...");
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

      const data = await apiFetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (data.insertedId || data.ok) {
        toast.success("Lesson created successfully!");
        router.push("/dashboard/my-lessons");
      } else {
        toast.error(data.message || "Failed to create lesson");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Add New Lesson</CardTitle>
            <p className="text-muted-foreground">
              Share your wisdom with the community
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="What is the core lesson you want to share?"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 w-full">
                <Label htmlFor="description">Full Story / Insight</Label>
                <Textarea
                  id="description"
                  required
                  rows={10}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us the complete story behind this lesson..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2 w-full">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Emotional Tone */}
                <div className="space-y-2">
                  <Label>Emotional Tone</Label>
                  <Select
                    value={formData.emotionalTone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, emotionalTone: value })
                    }
                    required
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <Label>Visibility</Label>
                <RadioGroup
                  value={formData.visibility}
                  onValueChange={(value) =>
                    setFormData({ ...formData, visibility: value })
                  }
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="cursor-pointer">
                        Public - Anyone can find this lesson
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="cursor-pointer">
                        Private - Only I can see this lesson
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Access Level */}
              <div className="space-y-2">
                <Label>Access Level</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Select
                          value={formData.accessLevel}
                          onValueChange={(value) =>
                            setFormData({ ...formData, accessLevel: value })
                          }
                          disabled={!isPremium}
                        >
                          <SelectTrigger
                            className={
                              !isPremium ? "opacity-60 cursor-not-allowed" : ""
                            }
                          >
                            <SelectValue placeholder="Select access level" />
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Featured Image (Optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />

                {imagePreview && (
                  <div className="mt-4 border rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={500}
                      height={300}
                      className="w-full max-h-72 object-cover"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? "Publishing Lesson..." : "Publish Lesson"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
