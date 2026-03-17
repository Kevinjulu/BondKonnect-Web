"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Home, Search, Ghost, FileText, BarChart3, HelpCircle } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-black selection:text-white">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-neutral-100 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-neutral-100 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-neutral-100 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        
        {/* Playful 404 Display */}
        <div className="flex justify-center items-center gap-4">
          <span className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-black select-none">
            4
          </span>
          <div className="animate-float relative">
             <Ghost className="h-32 w-32 sm:h-48 sm:w-48 text-black" strokeWidth={1.5} />
             {/* Cute eyes effect (optional, implies character) */}
             <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-black select-none">
            4
          </span>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-black shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            Error 404
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Whoops! This page is a ghost.
          </h2>
          <p className="text-neutral-500 text-lg max-w-md mx-auto leading-relaxed">
            We searched high and low, but the page you’re looking for has vanished into thin air.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 fill-mode-both">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-200 to-neutral-200 rounded-xl opacity-50 group-hover:opacity-100 transition duration-200 blur"></div>
            <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
               <Search className="ml-4 h-5 w-5 text-neutral-400" />
               <Input 
                placeholder="Try searching for it..." 
                className="border-0 bg-transparent h-12 focus-visible:ring-0 placeholder:text-neutral-400 text-black" 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="h-12 px-8 rounded-full border-2 border-neutral-100 bg-white text-black hover:bg-neutral-50 hover:border-black hover:text-black transition-all active:scale-95 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              asChild 
              className="h-12 px-8 rounded-full bg-black text-white hover:bg-neutral-800 shadow-xl shadow-black/10 hover:shadow-black/20 transition-all active:scale-95 font-semibold"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 fill-mode-both">
          {[
            { href: "/apps/bond-stats", icon: BarChart3, label: "Market Stats" },
            { href: "/apps/dms", icon: FileText, label: "Documents" },
            { href: "/apps/help", icon: HelpCircle, label: "Help Center" },
          ].map((item, idx) => (
            <Link 
              key={idx}
              href={item.href} 
              className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50 border border-transparent hover:bg-white hover:border-neutral-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <item.icon className="h-5 w-5 text-black" />
              </div>
              <span className="text-sm font-semibold text-black">{item.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
