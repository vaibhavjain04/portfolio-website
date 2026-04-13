import { leadership, extraCurricular } from "@/data/resume";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Leadership() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div ref={ref} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-primary font-display font-medium text-sm tracking-widest uppercase mb-3">Leadership</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16">
          Beyond <span className="text-gradient">Work</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {leadership.map((item, i) => {
          const { ref: cardRef, visible: cardVisible } = useScrollReveal(0.1);
          return (
            <div
              key={i}
              ref={cardRef}
              className={`card-gradient glow-border rounded-2xl p-6 transition-all duration-500 ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="text-xs text-primary font-medium">{item.period}</span>
              <h3 className="font-display text-lg font-bold text-foreground mt-1">{item.role}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.org}</p>
              <p className="text-sm text-secondary-foreground leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className={`card-gradient glow-border rounded-2xl p-6 w-full text-center transition-all duration-700 delay-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <p className="text-sm text-primary font-medium mb-2">📈 Extra-Curricular</p>
        <p className="text-sm text-secondary-foreground leading-relaxed">{extraCurricular}</p>
      </div>
    </section>
  );
}
