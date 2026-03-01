"use strict";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
// I'll use standard input type="checkbox" for now or create one.

export default function JoinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
    twoFactorEnabled: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("You must agree to the terms");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Jaigurudev Vivah</CardTitle>
          <CardDescription>
            Create your account to find your spiritual partner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.agreedToTerms}
                onChange={handleChange}
              />
              <Label htmlFor="agreedToTerms" className="text-xs">
                I agree this platform is strictly for marriage. No dating.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
               <input
                type="checkbox"
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.twoFactorEnabled}
                onChange={handleChange}
              />
              <Label htmlFor="twoFactorEnabled" className="text-xs text-gray-500">
                Enable 2FA (Optional)
              </Label>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Join Now"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
