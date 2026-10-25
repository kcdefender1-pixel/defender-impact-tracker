import type { Metadata } from 'next';
import { NAME_OPTIONS } from '@/content/media-action';
import { Orbit } from '@/components/lab/orbit';
import { LiberationLoop } from '@/components/lab/liberation-loop';
import { Fork } from '@/components/lab/fork';
import { ChooseDoor } from '@/components/lab/choose-door';

// A private sandbox for comparing ways to show the Media-Action Thesis.
// Not linked from the impact page and not indexed.
export const metadata: Metadata = {
  title: 'Lab · The Media-Action Thesis',
  robots: { index: false, follow: false },
};

const OPTIONS = [
  { letter: 'A', name: 'Orbit to Organizer', what: 'Rings that pull people inward, from first touch to organizer. Tap a ring.', Component: Orbit },
  { letter: 'B', name: 'The Liberation Loop', what: 'How journalism, mutual aid, and culture feed each other.', Component: LiberationLoop },
  { letter: 'C', name: 'From Feed to Field', what: 'Many doors, one path, two ways to be organized.', Component: Fork },
  { letter: 'D', name: 'Choose Your Door', what: 'Pick a person and watch their path unfold.', Component: ChooseDoor },
];

export default function LabPage() {
  return (
    <div>
      <section className="bg-ink text-paper border-b-2 border-ink">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <span className="kicker inline-block bg-defender-gold text-ink px-2.5 py-1">Lab · Private draft, not on the impact page</span>
          <h1 className="display text-[clamp(3rem,8vw,6.5rem)] mt-5">
            The Media-Action <span className="text-defender-red">Thesis</span>
          </h1>
          <p className="mt-5 max-w-3xl text-[17px] text-paper/80 leading-relaxed">
            Most media leaves people informed and alone. We publish with a door to the street, and people walk through it. Below
            are name ideas and four ways to show it. Pick what you love and we will build it into the impact page.
          </p>
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Options">
            <a href="#names" className="text-[13px] font-bold border-2 border-paper/40 rounded-full px-3 py-1 hover:bg-paper hover:text-ink transition-colors">
              Names
            </a>
            {OPTIONS.map((o) => (
              <a
                key={o.letter}
                href={`#option-${o.letter}`}
                className="text-[13px] font-bold border-2 border-paper/40 rounded-full px-3 py-1 hover:bg-paper hover:text-ink transition-colors"
              >
                {o.letter} · {o.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* Names */}
        <section id="names" className="py-14 md:py-20">
          <h2 className="slab">Name ideas</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {NAME_OPTIONS.map((g) => (
              <div key={g.group} className="border-2 border-ink bg-card">
                <span className="kicker block bg-ink text-paper px-4 py-2">{g.group}</span>
                <ul className="divide-y-2 divide-ink/10">
                  {g.names.map((n) => (
                    <li key={n.name} className="px-4 py-4">
                      <span className="display block text-[1.7rem] leading-none text-ink">{n.name}</span>
                      <span className="block text-[13.5px] text-ink-2 mt-1.5 leading-snug">{n.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {OPTIONS.map(({ letter, name, what, Component }) => (
          <section key={letter} id={`option-${letter}`} className="py-14 md:py-20 border-t-2 border-ink">
            <div className="flex flex-wrap items-end gap-4 mb-10">
              <span className="display text-[4rem] leading-none text-defender-red">{letter}</span>
              <div>
                <h2 className="display text-[2.4rem] md:text-[3rem] leading-none text-ink">{name}</h2>
                <p className="mt-2 text-[15px] text-ink-2">{what}</p>
              </div>
            </div>
            <Component />
          </section>
        ))}
      </div>
    </div>
  );
}
