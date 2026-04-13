import { personalInfo, education } from "@/data/resume";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="about" className="section-padding max-w-7xl mx-auto">
      <div
        ref={ref}
        className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div>
          <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">About Me</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Turning Data Into <span className="text-gradient">Decisions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{personalInfo.bio2}</p>
          <div className="card-gradient glow-border rounded-xl p-5">
            <p className="text-sm text-primary font-medium mb-1">🎓 Education</p>
            <p className="font-display font-semibold text-foreground">{education.institution}</p>
            <p className="text-sm text-muted-foreground">{education.degree}</p>
            <p className="text-xs text-muted-foreground mt-1">{education.period}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "7+ CGPA", label: "BITS Pilani" },
            { num: "1+ Year", label: "Internships (Product & Strategy)"},
            { num: "20%→5%", label: "Churn Reduced" },
            { num: "2+ Years", label: "Forex & Commodities Trading"},
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`card-gradient glow-border rounded-xl p-6 text-center group hover:scale-105 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{stat.num}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
