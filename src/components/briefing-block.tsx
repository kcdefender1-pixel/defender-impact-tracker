import { generateBriefing } from '@/lib/briefing';
import { BriefingActions } from '@/components/briefing-actions';

export async function BriefingBlock() {
  let text: string;
  try {
    text = await generateBriefing();
  } catch {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50/60 via-white/80 to-white/80 backdrop-blur-sm border border-red-100/60 rounded-card shadow-sm p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="text-xs font-bold text-defender-red uppercase tracking-widest">
          Defender Impact Briefing
        </div>
        <BriefingActions text={text} />
      </div>
      <div className="w-12 h-[2px] bg-defender-red/30 mb-4" />
      <p className="text-[1.05rem] text-defender-black leading-[1.7] font-medium">
        {text}
      </p>
    </div>
  );
}
