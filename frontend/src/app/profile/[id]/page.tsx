"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { User, MapPin, Briefcase, GraduationCap, Heart, Calendar, Phone, Mail, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/user/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setIsConnected(data.isConnected);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
      // Implementation for sending request from this page if needed
      // Currently requests are sent from Matches page, but could be added here
      try {
        const res = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receiverId: params.id }),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success("Request sent successfully!");
        } else {
            toast.error(data.error || "Failed to send request");
        }
      } catch (err) {
          toast.error("Something went wrong");
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-center">Profile not found</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl pb-20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative"
      >
          {/* Cover Photo Placeholder */}
          <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-500 rounded-t-2xl"></div>
          
          <Card className="rounded-t-none border-t-0 shadow-lg -mt-20 bg-white/95 backdrop-blur-sm pt-20 relative">
              <div className="absolute -top-16 left-6 md:left-10">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                      {profile.profileImage ? (
                          <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
                      ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                              <User className="h-12 w-12" />
                          </div>
                      )}
                  </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                  {!isConnected && (
                      <Button onClick={handleSendRequest} className="shadow-md">
                          Connect
                      </Button>
                  )}
                  {isConnected && (
                      <Button variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Connected
                      </Button>
                  )}
              </div>

              <CardHeader className="pt-4 md:pl-56">
                  <div>
                      <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                      <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                          <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {profile.location}
                          </span>
                          <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" /> {profile.occupation}
                          </span>
                          <span className="flex items-center gap-1">
                              <User className="w-4 h-4" /> {getAge(profile.dob)} yrs, {profile.height}
                          </span>
                      </div>
                  </div>
              </CardHeader>
              
              <CardContent className="md:pl-56 pb-8">
                  <p className="text-gray-700 leading-relaxed">{profile.about}</p>
              </CardContent>
          </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Basic Info */}
          <div className="md:col-span-1 space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" /> Personal Info
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <InfoItem label="Gender" value={profile.gender} />
                      <InfoItem label="Diet" value={profile.diet} />
                      <InfoItem label="Caste" value={profile.caste || "Not specified"} />
                      <InfoItem label="Spiritual Path" value={profile.spiritualDetails} />
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-primary" /> Education
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-700">{profile.education}</p>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Detailed Info (Restricted) */}
          <div className="md:col-span-2 space-y-6">
              {isConnected ? (
                  <>
                      <Card className="border-l-4 border-l-green-500">
                          <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                                  <Users className="w-5 h-5" /> Family & Contact (Visible to Connections)
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={profile.phone} />
                                  <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={profile.email} />
                              </div>
                              <div className="space-y-4">
                                   <InfoItem icon={<DollarSign className="w-4 h-4" />} label="Annual Income" value={profile.annualIncome ? `₹${profile.annualIncome}` : "N/A"} />
                                   <InfoItem icon={<DollarSign className="w-4 h-4" />} label="Monthly Income" value={profile.monthlyIncome ? `₹${profile.monthlyIncome}` : "N/A"} />
                              </div>
                              <div className="col-span-full mt-4">
                                  <h4 className="font-semibold text-gray-900 mb-1">Family Details</h4>
                                  <p className="text-gray-700">{profile.familyDetails}</p>
                              </div>
                          </CardContent>
                      </Card>

                      {/* Gallery - Always visible, not just for connections */}
                  </>
              ) : null}

              {/* Public Gallery Section - Visible to everyone */}
              {profile.galleryImages && profile.galleryImages.length > 0 && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="w-5 h-5 flex items-center justify-center text-primary">📷</span> Photo Gallery
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {profile.galleryImages.map((img: string, idx: number) => (
                                  img && (
                                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer shadow-sm">
                                          <img 
                                            src={img} 
                                            alt={`Gallery ${idx}`} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onClick={() => window.open(img, '_blank')}
                                          />
                                      </div>
                                  )
                              ))}
                          </div>
                      </CardContent>
                  </Card>
              )}

              {!isConnected && (
                  <Card className="bg-gray-50 border-dashed mt-6">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                              <Heart className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Connect to view full details</h3>
                          <p className="text-gray-500 max-w-sm mt-2 mb-6">
                              Contact information, family details, and income are only visible to mutually connected members.
                          </p>
                          <Button onClick={handleSendRequest}>
                              Send Connection Request
                          </Button>
                      </CardContent>
                  </Card>
              )}
          </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="mt-1 text-gray-400">{icon}</div>}
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    )
}

function getAge(dob: string) {
    if (!dob) return "";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}
