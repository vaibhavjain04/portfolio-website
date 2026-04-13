import { Suspense } from "react";
import { personalInfo } from "@/data/resume";
import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AIAgent from "@/components/AIAgent/AIAgent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <Hero3D />
        </Suspense>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-4 animate-slide-up">
            {personalInfo.tagline}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Hi, I'm{" "}
            <span className="text-gradient">{personalInfo.name.split(" ")[0]}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {personalInfo.bio}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <a
              href="#experience"
              className="px-8 py-3.5 rounded-xl font-medium text-primary-foreground transition-all duration-300 hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              View My Work
            </a>
            <a
              href="https://drive.google.com/file/d/1k_5z-Vxw--MRRUFhr93Y6J_MThtmbeV9/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl font-medium text-secondary-foreground bg-secondary border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-primary animate-pulse-glow" />
          </div>
        </div>
      </section>

      <About />
      <Experience />
      <Projects />
      <Skills />
      <Leadership />
      <Contact />
      <Footer />
      <AIAgent />
    </div>
  );
};

export default Index;
