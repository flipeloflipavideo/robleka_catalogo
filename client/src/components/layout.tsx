import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Palette, Settings } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="gradient-bg shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Palette className="text-deep-blue text-xl" size={24} />
              </div>
              <h1 className="text-white font-poppins font-bold text-2xl">ROBLEKA Diseños</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <span className={`text-white hover:text-lavender transition-colors font-medium ${location === "/" ? "text-lavender" : ""}`}>
                  Catálogo
                </span>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="bg-white text-deep-blue border-white hover:bg-lavender hover:text-white hover:border-lavender transition-all">
                  <Settings className="mr-2" size={16} />
                  Admin
                </Button>
              </Link>
            </nav>

            <button className="md:hidden text-white text-xl">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
