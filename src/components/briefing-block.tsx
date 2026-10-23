import { generateBriefing } from '@/lib/briefing';
import { BriefingActions } from '@/components/briefing-actions';

export async function BriefingBlock() {
  let text: string;
  try {
    text = await generateBriefing();
  } catch {
    return null;
  }

  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  // The closing line establishes national significance; set it as a pull quote
  const closer = paragraphs.length > 2 ? paragraphs[paragraphs.length - 1] : null;
  const body = closer ? paragraphs.slice(0, -1) : paragraphs;
  const year = new Date().getFullYear();

  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-24">
      <div className="grid md:grid-cols-12 gap-8 md:gap-10">
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-32">
            <p className="kicker text-defender-red mb-3">The Briefing &middot; {year}</p>
            <h2 className="display text-[2.6rem] md:text-[3.1rem] text-ink">
              Year to date
            </h2>
            <p className="mt-4 text-[13px] text-ink-3 leading-relaxed max-w-[16rem]">
              Written from every approved impact this year. Copy it into a funder update, a board
              memo, or a post.
            </p>
            <div className="mt-5">
              <BriefingActions text={text} />
            </div>
          </div>
        </aside>

        <article className="md:col-span-8 md:col-start-5 font-serif text-ink">
          {body.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'dropcap text-[1.45rem] md:text-[1.7rem] leading-[1.42] mb-7 [font-variation-settings:"opsz"_36]'
                  : 'text-[1.15rem] md:text-[1.28rem] leading-[1.65] text-ink-2 mb-6 [font-variation-settings:"opsz"_16]'
              }
            >
              {p}
            </p>
          ))}

          {closer && (
            <blockquote className="mt-12 pt-8 border-t-2 border-ink">
              <p className="italic text-[1.9rem] md:text-[2.6rem] leading-[1.12] tracking-[-0.01em] [font-variation-settings:'opsz'_72]">
                {closer}
              </p>
            </blockquote>
          )}
        </article>
      </div>
    </section>
  );
}
