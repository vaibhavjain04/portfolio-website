import { personalInfo } from "@/data/resume";
import { Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="section-padding max-w-4xl mx-auto text-center">
      <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">Get In Touch</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
        Let's <span className="text-gradient">Connect</span>
      </h2>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        I'm open to opportunities in product management, strategy, operations, and data analytics. Let's build something great together.
      </p>

      <a
        href={`tel:${personalInfo.phone}`}
        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-10"
      >
        <Phone className="w-4 h-4" />
        <span className="font-medium">{personalInfo.phone}</span>
      </a>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={`mailto:${personalInfo.email}`}
          className="px-8 py-3.5 rounded-xl font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-105"
          style={{ background: "var(--gradient-primary)" }}
        >
          Say Hello →
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-xl font-medium text-secondary-foreground bg-secondary border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105"
        >
          LinkedIn
        </a>
        <a
          href="https://drive.google.com/file/d/1XGpNvdqiayoNxawGvIRgfnDxpb_mEL-_/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-xl font-medium text-secondary-foreground bg-secondary border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105"
        >
          Resume
        </a>
      </div>
    </section>
  );
}
