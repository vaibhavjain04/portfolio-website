import { projects } from "@/data/resume";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Projects() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="projects" className="section-padding max-w-7xl mx-auto">
      <div ref={ref} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">Projects</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16">
          Things I've <span className="text-gradient">Built</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project, i) => {
          const { ref: cardRef, visible: cardVisible } = useScrollReveal(0.1);
          return (
            <div
              key={i}
              ref={cardRef}
              className={`card-gradient glow-border rounded-2xl p-6 flex flex-col group hover:scale-[1.02] transition-all duration-500 ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="text-xs text-primary font-medium">{project.period}</span>
              <h3 className="font-display text-lg font-bold text-foreground mt-2">{project.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{project.subtitle}</p>
              <p className="text-sm text-secondary-foreground leading-relaxed flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                ))}
              </div>
              {project.deckUrl && (
                <a
                  href={project.deckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors w-fit"
                >
                  View Deck ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
