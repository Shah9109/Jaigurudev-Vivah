"use client";

import Link from "next/link";
import { Heart, Users, ShieldCheck, Mail, CheckCircle, Search, UserPlus, MessageCircle, PlayCircle, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { DonationSection } from "@/components/DonationSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <Link className="flex items-center justify-center group" href="/">
          {/* Removed Heart icon */}
          <span className="ml-2 text-2xl font-bold text-primary group-hover:scale-105 transition-transform">
            Jaigurudev Vivah
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-pink-50 font-medium">
              Login
            </Button>
          </Link>
          <Link href="/join">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6">
              Join Now
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-8 md:py-24 lg:py-32 xl:py-48 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50 via-white to-pink-50">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative px-4 md:px-6 mx-auto z-10">
            <div className="flex flex-col items-center space-y-4 md:space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2 md:space-y-4"
              >
                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 mb-1 md:mb-2 text-xs md:text-sm font-semibold tracking-wider text-primary uppercase bg-pink-100 rounded-full">
                    Official Matrimonial Platform
                </div>
                {/* Hero Title removed as per request */}
              </motion.div>
              
              {/* Image and Buttons Container */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 my-4 md:my-8 w-full max-w-6xl">
                 {/* Jaigurudev Image */}
                 <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center space-y-2 md:space-y-4 relative group"
                 >
                     <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img 
                            src="https://imgs.search.brave.com/RoSyR9SJeZ-WRZpd001V97vAp_Zq66sXgSEIv95Z6qU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzI5Lzkw/LzY1LzI5OTA2NWE3/ZGJjYTg1YzZhMzIz/ZjJkZjIwMjBlYTM0/LmpwZw"
                            alt="Param Sant Baba Jaigurudev"
                            className="relative h-56 md:h-80 w-auto rounded-xl shadow-2xl object-cover border-[4px] md:border-[6px] border-white transform transition duration-500 hover:scale-[1.02]"
                        />
                     </div>
                     <div className="text-center space-y-0.5 md:space-y-1">
                        <p className="text-lg md:text-xl font-bold text-gray-800">Param Sant Baba Jaigurudev</p>
                     </div>
                 </motion.div>

                 {/* Buttons and Tagline */}
                 <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col items-center md:items-start space-y-4 md:space-y-8 max-w-lg p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/20 shadow-lg md:shadow-xl w-full"
                 >
                    <div className="space-y-2 md:space-y-4 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Start Your Sacred Journey</h2>
                        <div className="text-gray-600 text-base md:text-lg leading-relaxed space-y-2">
                            <p className="font-hindi text-lg font-medium text-gray-800">
                                &quot;संस्कार, श्रद्धा और मर्यादा सहित जैगुरुदेव सत्संग में वैवाहिक परिचय&quot;
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col w-full gap-4">
                        <Link href="/join" className="w-full">
                            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-pink-500/25 rounded-xl transition-all duration-300 group">
                                <UserPlus className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                                Create Account
                                <ArrowRight className="ml-auto h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                            <Button variant="outline" size="lg" className="w-full h-14 text-lg border-2 border-gray-200 hover:border-primary hover:bg-pink-50 text-gray-700 rounded-xl transition-all duration-300 group">
                                <LogIn className="mr-2 h-5 w-5 text-gray-500 group-hover:text-primary" />
                                Login to Account
                            </Button>
                        </Link>
                    </div>
                 </motion.div>
              </div>

              {/* Divider */}
              <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent my-16 opacity-50"></div>
              
              {/* Spacer */}
              <div className="h-20"></div>

              {/* YouTube Video Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-full max-w-4xl mt-20"
              >
                  <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                      <div className="relative aspect-video w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white bg-black group">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder
                            title="How to use Jaigurudev Vivah" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            className="relative z-10"
                        ></iframe>
                      </div>
                      
                      <div className="text-center md:text-left md:w-1/2 space-y-4">
                          <h3 className="text-2xl font-bold text-gray-800 flex flex-col md:items-start items-center gap-2">
                              <PlayCircle className="w-10 h-10 text-red-500" />
                              How to use Jaigurudev Vivah App
                          </h3>
                          <p className="text-gray-600 text-lg">
                              Watch this short video guide to get started with registration, verification, and finding your perfect match.
                          </p>
                      </div>
                  </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           <div className="container relative px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  How It Works
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Simple 4-step process to find your life partner within the community.
                </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: UserPlus, title: "Register & Verify", desc: "Create your profile and get verified by admin.", color: "bg-blue-100 text-blue-600" },
                { icon: Search, title: "Search Matches", desc: "Find compatible profiles within the community.", color: "bg-purple-100 text-purple-600" },
                { icon: Heart, title: "Send Interest", desc: "Express your interest for marriage.", color: "bg-pink-100 text-pink-600" },
                { icon: Users, title: "Family Introduction", desc: "Involve families and proceed respectfully.", color: "bg-orange-100 text-orange-600" }
              ].map((step, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -10 }}
                    className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`p-5 rounded-2xl ${step.color} mb-2 transform rotate-3 hover:rotate-6 transition-transform`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{index + 1}. {step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Pledge Section */}
        <section className="w-full py-16 md:py-24 bg-pink-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Our Community Pledge
            </h2>
            <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2 text-left">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <ShieldCheck className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="font-medium">Strictly No Dating</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="font-medium">Admin Verified Profiles</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <MessageCircle className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Communication after Acceptance</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <Users className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="font-medium">Family Involvement Encouraged</span>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <DonationSection />
      </main>

      <footer className="w-full py-8 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6 mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Jaigurudev Vivah</h3>
            <p className="text-sm">
              Connecting souls for a sacred journey together.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Jaigurudev Sanstha</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Contact</h4>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>support@jaigurudevvivah.com</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Jaigurudev Matrimonial. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
