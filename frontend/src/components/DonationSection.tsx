"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import { Copy, Check, Heart, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export function DonationSection() {
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings/donation");
        if (res.ok) {
          const data = await res.json();
          setUpiId(data.upiId || "");
          setQrCodeUrl(data.qrCodeUrl || "");
        }
      } catch (error) {
        console.error("Failed to load donation settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const copyToClipboard = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || (!upiId && !qrCodeUrl)) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-primary text-sm font-medium"
          >
            <Heart className="w-4 h-4 fill-primary" />
            <span>Support the Platform</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Website Maintenance & Developer Support
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Your contribution helps us maintain this platform and serve the Jaigurudev community better. 
            Donations are optional and go directly towards server costs and development.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 bg-white shadow-xl rounded-2xl border-t-4 border-t-primary relative overflow-hidden">
             {/* Decorative background circle */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-100 rounded-full opacity-50 blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col items-center space-y-6">
                {qrCodeUrl && (
                  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <img 
                      src={qrCodeUrl} 
                      alt="Donation QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                )}
                
                {upiId && (
                  <div className="w-full space-y-3 text-center">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">UPI ID</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-primary/50 transition-colors">
                      <div className="flex-1 font-mono text-lg text-gray-800 truncate">
                        {upiId}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyToClipboard}
                        className={copied ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-primary hover:bg-pink-50"}
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500 italic">
                    "No confirmation required. Simply scan or copy to donate."
                  </p>
                </div>
             </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
