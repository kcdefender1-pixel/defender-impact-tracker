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

  return (
    <div className="bg-surface-card border border-white/[0.07] rounded-card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-black text-defender-red uppercase tracking-[0.15em] mb-1">
            Impact Briefing &middot; {new Date().getFullYear()}
          </p>
          <h2 className="text-xl font-black text-white leading-tight tracking-tight">
            Kansas City Defender
          </h2>
          <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mt-0.5">
            Reporting to the Movement. Building the Conditions for Victory.
          </p>
        </div>
        <BriefingActions text={text} />
      </div>
      <div className="w-12 h-[2px] bg-defender-red/50 mb-5" />
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[1.02rem] text-white/75 leading-[1.75] font-medium">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
