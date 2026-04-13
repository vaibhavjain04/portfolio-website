import { skills } from "@/data/resume";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Skills() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="skills" className="section-padding max-w-7xl mx-auto">
      <div ref={ref} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">Skills</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16">
          My <span className="text-gradient">Toolkit</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className={`card-gradient glow-border rounded-2xl p-8 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
          <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Technical Skills
          </h3>
          <div className="space-y-4">
            {skills.technical.map((skill, i) => (
              <div key={skill} className="group">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-secondary-foreground">{skill}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 group-hover:opacity-100 opacity-80"
                    style={{
                      width: visible ? `${45 + i * 5}%` : "0%",
                      background: "var(--gradient-primary)",
                      transitionDelay: `${i * 150 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`card-gradient glow-border rounded-2xl p-8 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
          <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Tools & Platforms
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.tools.map((tool, i) => (
              <span
                key={tool}
                className={`px-4 py-2.5 text-sm rounded-xl bg-secondary text-secondary-foreground border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-500 cursor-default ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                style={{ transitionDelay: `${i * 80 + 500}ms` }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
