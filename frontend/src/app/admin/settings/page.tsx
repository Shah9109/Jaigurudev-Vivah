"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import { Upload, Save, Loader2, Settings } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/donation");
      if (res.ok) {
        const data = await res.json();
        setUpiId(data.upiId || "");
        setQrCodeUrl(data.qrCodeUrl || "");
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setQrCodeUrl(data.url);
        toast.success("QR Code uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId, qrCodeUrl }),
      });

      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
      </div>

      <Card className="p-6 shadow-md border-t-4 border-t-primary">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Donation Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="upiId" className="text-base">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="e.g. jaigurudev@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="h-11"
            />
            <p className="text-sm text-gray-500">
              This UPI ID will be displayed on the home page for donations.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base">QR Code Image</Label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="w-full sm:w-auto"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {qrCodeUrl ? "Change QR Code" : "Upload QR Code"}
                </Button>
                <p className="text-sm text-gray-500">
                  Upload a QR code image that users can scan to make donations.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button type="submit" disabled={saving || uploading} className="w-full sm:w-auto min-w-[150px]">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
