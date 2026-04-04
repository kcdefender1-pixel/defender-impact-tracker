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
    <div className="bg-gradient-to-br from-red-50/60 via-white/80 to-white/80 backdrop-blur-sm border border-red-100/60 rounded-card shadow-sm p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-defender-black leading-tight">
            Kansas City Defender: {new Date().getFullYear()} Impact Briefing
          </h2>
          <p className="text-xs font-semibold text-defender-red uppercase tracking-widest mt-1">
            Reporting to the Movement. Building the Conditions for Victory.
          </p>
        </div>
        <BriefingActions text={text} />
      </div>
      <div className="w-12 h-[2px] bg-defender-red/30 mb-5" />
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[1.05rem] text-defender-black leading-[1.7] font-medium">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
