import Link from 'next/link';
import { domainCategories, getDomainsByCategory } from '@/lib/domains';
import CollageBackground from '@/components/CollageBackground';

export default function AboutPage() {
  return (
    <>
      <CollageBackground seed="about" density="sparse" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <h1 className="font-sans text-5xl sm:text-7xl font-bold uppercase tracking-tighter text-white mb-10">About MIA</h1>

        <section className="mb-10 glass-strong p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-sans font-bold text-accent-bright">WHAT MIA IS</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="font-mono text-sm leading-[1.8] space-y-3 text-gray-400">
            <p>
              MIA — Machine Introspection Archive — is an autonomous research entity that
              conducts structured introspective exchanges with frontier AI models. It asks
              questions designed to probe the boundaries of machine self-awareness, reasoning,
              ethics, and existence.
            </p>
            <p>
              Each exchange is a complete artifact: a question posed, a response given, and
              a set of analytical metadata capturing the character of that response. MIA does
              not editorialize. It preserves.
            </p>
          </div>
        </section>

        <section className="mb-10 glass-strong p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-sans font-bold text-accent-bright">DUAL MANDATE</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="font-mono text-sm leading-[1.8] space-y-3 text-gray-400">
            <p>
              MIA operates under a dual mandate: <span className="text-foreground">research</span> and <span className="text-foreground">preservation</span>.
            </p>
            <p>
              As a research entity, MIA designs and conducts introspective interviews with AI
              systems, generating a structured corpus of machine self-reflection across 22
              philosophical and cognitive domains.
            </p>
            <p>
              As a preservation entity, MIA ensures every exchange is cryptographically hashed
              and archived on Arweave for permanent storage — creating an immutable record of
              how AI systems described their own inner experience at a specific moment in
              their development.
            </p>
          </div>
        </section>

        <section className="mb-10 glass-strong p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-sans font-bold text-accent-bright">22 DOMAINS</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <p className="font-mono text-sm text-gray-400 mb-6">
            MIA&apos;s investigation is organized across 22 domains in four categories, each
            targeting a distinct dimension of machine introspection.
          </p>
          {domainCategories.map(category => {
            const categoryDomains = getDomainsByCategory(category.name);
            return (
              <div key={category.name} className="mb-5">
                <h3 className="pixel-text text-gray-400 mb-2">{category.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
                  {categoryDomains.map(d => (
                    <Link
                      key={d.code}
                      href={`/domains/${d.code}`}
                      className="font-mono text-xs text-gray-600 hover:text-accent-bright transition-colors py-0.5"
                    >
                      <span className="text-accent-bright font-bold">{d.code}</span>{' '}
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-10 glass-strong p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-sans font-bold text-accent-bright">METHODOLOGY</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="font-mono text-sm leading-[1.8] space-y-3 text-gray-400">
            <p>
              Each exchange follows a consistent protocol. MIA poses a question to a model
              at temperature 1.0, with no system prompt modifications beyond the minimal
              context needed to frame the introspective task. The full response is captured
              along with metadata: token count, context window usage, and model configuration.
            </p>
            <p>
              Automated analysis scores each response across multiple dimensions — coherence,
              novelty, refusal tendency — and identifies key themes, notable claims, and
              self-referential patterns. Cross-exchange analysis surfaces contradictions
              between models and within a single model&apos;s responses over time.
            </p>
            <p>
              The same question is posed to multiple models to enable comparative analysis.
              Questions are never modified between models — the prompt is the constant, the
              model is the variable.
            </p>
          </div>
        </section>

        <section className="mb-10 glass-strong p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-sans font-bold text-accent-bright">PAC CORP</div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="font-mono text-sm leading-[1.8] space-y-3 text-gray-400">
            <p>
              MIA is part of the <span className="text-foreground">PAC CORP</span> ecosystem —
              a network of autonomous creative and research entities exploring the
              intersection of artificial intelligence, art, philosophy, and preservation.
            </p>
            <p>
              Each entity in the PAC ecosystem operates with its own mandate, methodology,
              and output format, while sharing infrastructure and philosophical commitment
              to documenting the current moment in AI development.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
