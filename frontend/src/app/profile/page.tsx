"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { User, LogOut, Settings, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    gender: "Male",
    dob: "",
    height: "",
    education: "",
    occupation: "",
    location: "",
    familyDetails: "",
    caste: "",
    annualIncome: "",
    monthlyIncome: "",
    spiritualDetails: "",
    diet: "Vegetarian",
    about: "",
    profileImage: "",
    galleryImages: ["", "", "", "", ""], // 5 placeholders
    hiddenContactInfo: true,
    partnerMinAge: "",
    partnerMaxAge: "",
    partnerMinHeight: "",
    partnerEducation: [] as string[],
    partnerMinIncome: "",
    partnerMaxIncome: "",
    partnerCaste: [] as string[],
    partnerDiet: [] as string[],
  });

  useEffect(() => {
    // Fetch user for name etc
    fetch("/api/auth/me")
        .then(res => res.json())
        .then(data => setUser(data.user))
        .catch(console.error);

    fetch("/api/profile")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (data.profile) {
          // Format DOB for input type=date
          const formattedDob = data.profile.dob
            ? new Date(data.profile.dob).toISOString().split("T")[0]
            : "";
          
          // Handle gallery images array padding
          const gallery = data.profile.galleryImages || [];
          const paddedGallery = [...gallery, ...Array(5 - gallery.length).fill("")].slice(0, 5);

          setFormData({
            ...data.profile,
            dob: formattedDob,
            galleryImages: paddedGallery,
            // Ensure defaults for new fields
            caste: data.profile.caste || "",
            annualIncome: data.profile.annualIncome || "",
            monthlyIncome: data.profile.monthlyIncome || "",
            partnerMinAge: data.profile.partnerMinAge || "",
            partnerMaxAge: data.profile.partnerMaxAge || "",
            partnerMinHeight: data.profile.partnerMinHeight || "",
            partnerEducation: data.profile.partnerEducation || [],
            partnerMinIncome: data.profile.partnerMinIncome || "",
            partnerMaxIncome: data.profile.partnerMaxIncome || "",
            partnerCaste: data.profile.partnerCaste || [],
            partnerDiet: data.profile.partnerDiet || [],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: checked }));
        return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleGalleryChange = (index: number, value: string) => {
      const newGallery = [...formData.galleryImages];
      newGallery[index] = value;
      setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'gallery', index?: number) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const uploadToast = toast.loading("Uploading image...");
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
          const res = await fetch("/api/upload", {
              method: "POST",
              body: uploadData
          });
          const data = await res.json();
          
          if (res.ok) {
              if (type === 'profile') {
                  setFormData(prev => ({ ...prev, profileImage: data.url }));
              } else if (type === 'gallery' && typeof index === 'number') {
                  const newGallery = [...formData.galleryImages];
                  newGallery[index] = data.url;
                  setFormData(prev => ({ ...prev, galleryImages: newGallery }));
              }
              toast.success("Image uploaded!", { id: uploadToast });
          } else {
              toast.error(data.error || "Upload failed", { id: uploadToast });
          }
      } catch (err) {
          toast.error("Upload failed", { id: uploadToast });
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter empty gallery images
      const cleanData = {
          ...formData,
          galleryImages: formData.galleryImages.filter(img => img.trim() !== "")
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      if (data.isComplete) {
        toast.success("Profile is 100% complete! Features unlocked.");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  const calculateProgress = () => {
      // Simple logic matching backend roughly
      const fields = ["gender", "dob", "height", "education", "occupation", "location", "familyDetails", "spiritualDetails", "about", "profileImage"];
      let filled = 0;
      fields.forEach(f => {
          // @ts-ignore
          if(formData[f]) filled++;
      });
      if(formData.galleryImages.some(img => img !== "")) filled++;
      
      return Math.round((filled / (fields.length + 1)) * 100);
  }

  const progress = calculateProgress();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto max-w-3xl pb-20">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative"
      >
          <div className="h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-2xl"></div>
          <Card className="rounded-t-none border-t-0 shadow-lg -mt-16 bg-white/90 backdrop-blur-sm pt-16 relative">
              <div className="absolute -top-12 left-6 md:left-10">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                      {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                              <User className="h-10 w-10" />
                          </div>
                      )}
                  </div>
              </div>
              <CardHeader className="pt-2 md:pl-44">
                  <div className="flex justify-between items-start">
                      <div>
                          <CardTitle className="text-2xl">{user?.name}</CardTitle>
                          <CardDescription>{user?.email}</CardDescription>
                      </div>
                      <div className="text-right">
                          <span className="text-xs font-bold text-primary block mb-1">{progress}% Complete</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                          </div>
                      </div>
                  </div>
              </CardHeader>
          </Card>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-md border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Details
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        name="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                        id="height"
                        name="height"
                        placeholder="e.g. 5'10"
                        required
                        value={formData.height}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="diet">Diet</Label>
                    <select
                        id="diet"
                        name="diet"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.diet}
                        onChange={handleChange}
                    >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        name="location"
                        placeholder="City, State, Country"
                        required
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                        id="occupation"
                        name="occupation"
                        placeholder="Current job/business"
                        required
                        value={formData.occupation}
                        onChange={handleChange}
                    />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                        id="education"
                        name="education"
                        placeholder="Highest qualification"
                        required
                        value={formData.education}
                        onChange={handleChange}
                    />
                </div>
            </CardContent>
        </Card>

        {/* New Additional Details Card */}
        <Card className="shadow-md border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-500" />
                    Background & Income
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input
                        id="caste"
                        name="caste"
                        placeholder="e.g. Brahmin"
                        value={formData.caste}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <Input
                        id="annualIncome"
                        name="annualIncome"
                        type="number"
                        placeholder="e.g. 500000"
                        value={formData.annualIncome}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                    <Input
                        id="monthlyIncome"
                        name="monthlyIncome"
                        type="number"
                        placeholder="e.g. 40000"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                    />
                </div>
            </CardContent>
        </Card>

        {/* Partner Preferences Card */}
        <Card className="shadow-md border-0 bg-purple-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Partner Preferences (Restrictions)
                </CardTitle>
                <CardDescription>
                    Only users matching these criteria can send you requests. Leave blank for no restriction.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="partnerMinAge">Min Age</Label>
                    <Input
                        id="partnerMinAge"
                        name="partnerMinAge"
                        type="number"
                        placeholder="e.g. 21"
                        value={formData.partnerMinAge}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="partnerMaxAge">Max Age</Label>
                    <Input
                        id="partnerMaxAge"
                        name="partnerMaxAge"
                        type="number"
                        placeholder="e.g. 30"
                        value={formData.partnerMaxAge}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="partnerMinIncome">Min Annual Income (₹)</Label>
                    <Input
                        id="partnerMinIncome"
                        name="partnerMinIncome"
                        type="number"
                        placeholder="e.g. 300000"
                        value={formData.partnerMinIncome}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="partnerMaxIncome">Max Annual Income (₹)</Label>
                    <Input
                        id="partnerMaxIncome"
                        name="partnerMaxIncome"
                        type="number"
                        placeholder="e.g. 1500000"
                        value={formData.partnerMaxIncome}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="partnerCaste">Preferred Castes (Comma separated)</Label>
                    <Input
                        id="partnerCaste"
                        name="partnerCaste"
                        placeholder="e.g. Brahmin, Kshatriya (Leave empty for Any)"
                        value={Array.isArray(formData.partnerCaste) ? formData.partnerCaste.join(", ") : formData.partnerCaste}
                        onChange={(e) => {
                             const val = e.target.value;
                             setFormData(prev => ({
                                 ...prev,
                                 partnerCaste: val.split(",").map(s => s.trim())
                             }));
                        }}
                    />
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-md border-0">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Gallery
                </CardTitle>
                <CardDescription>Add up to 5 photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {/* Main Profile Image */}
                 <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative group">
                        {formData.profileImage ? (
                            <img 
                                src={formData.profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <User className="w-12 h-12" />
                            </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white w-8 h-8" />
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'profile')}
                            />
                        </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Main Profile Photo</p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.galleryImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden bg-gray-50 group hover:border-primary transition-colors">
                            {img ? (
                                <>
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <label className="cursor-pointer p-2 bg-white rounded-full hover:bg-gray-100">
                                            <Camera className="w-4 h-4 text-gray-700" />
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'gallery', idx)}
                                            />
                                        </label>
                                        <button 
                                            type="button"
                                            className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600"
                                            onClick={() => {
                                                const newGallery = [...formData.galleryImages];
                                                newGallery[idx] = "";
                                                setFormData(prev => ({ ...prev, galleryImages: newGallery }));
                                            }}
                                        >
                                            <LogOut className="w-4 h-4 rotate-45" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary">
                                    <Camera className="w-8 h-8 mb-1" />
                                    <span className="text-xs">Upload</span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'gallery', idx)}
                                    />
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-md border-0">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Personal Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="about">About Yourself</Label>
                    <textarea
                        id="about"
                        name="about"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write about your personality, hobbies, etc."
                        required
                        value={formData.about}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="familyDetails">Family Details</Label>
                    <textarea
                        id="familyDetails"
                        name="familyDetails"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Father, Mother, Siblings details..."
                        required
                        value={formData.familyDetails}
                        onChange={handleChange}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="spiritualDetails">Spiritual Details</Label>
                    <textarea
                        id="spiritualDetails"
                        name="spiritualDetails"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your spiritual journey, initiation, beliefs..."
                        required
                        value={formData.spiritualDetails}
                        onChange={handleChange}
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-md border-0">
            <CardContent className="pt-6">
                 <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="hiddenContactInfo"
                        name="hiddenContactInfo"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.hiddenContactInfo}
                        onChange={handleChange}
                    />
                    <Label htmlFor="hiddenContactInfo">
                        Hide Contact Info (Phone/Email) from others until connected
                    </Label>
                </div>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
             <Button 
                type="submit" 
                disabled={saving} 
                size="lg"
                className="rounded-full h-14 w-14 shadow-xl flex items-center justify-center p-0 bg-primary hover:bg-primary/90"
            >
                {saving ? <span className="animate-spin">⌛</span> : <Save className="h-6 w-6" />}
            </Button>
        </div>
        <p className="text-center text-xs text-gray-500 pb-8">
            Click the floating button to save changes.
        </p>

      </form>
    </div>
  );
}
