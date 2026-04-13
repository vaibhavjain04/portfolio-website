import { experiences } from "@/data/resume";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function TimelineItem({ exp, i }: { exp: typeof experiences[number]; i: number }) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-8 mb-16 last:mb-0 transition-all duration-700 ${
        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${i * 150}ms` }}
    >
      <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-[7px] md:-translate-x-[8px] top-1 shadow-[0_0_12px_hsl(200_100%_55%/0.5)]" />

      <div className={`md:w-1/2 pl-8 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
        <span className="text-xs text-primary font-medium">{exp.period}</span>
        <h3 className="font-display text-xl font-bold text-foreground mt-1">{exp.role}</h3>
        <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
        <ul className={`mt-4 space-y-2 ${i % 2 === 0 ? "md:text-right" : ""}`}>
          {exp.highlights.map((h, j) => (
            <li key={j} className="text-sm text-secondary-foreground leading-relaxed">{h}</li>
          ))}
        </ul>
        {exp.deckUrl && (
          <a
            href={exp.deckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors"
          >
            View Deck ↗
          </a>
        )}
      </div>
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}

export default function Experience() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="experience" className="section-padding max-w-7xl mx-auto">
      <div ref={ref} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">Experience</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16">
          Where I've <span className="text-gradient">Made Impact</span>
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
        {experiences.map((exp, i) => (
          <TimelineItem key={i} exp={exp} i={i} />
        ))}
      </div>
    </section>
  );
}
