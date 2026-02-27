import { generateBriefing } from '@/lib/briefing';

export async function BriefingBlock() {
  let text: string;
  try {
    text = await generateBriefing();
  } catch {
    return null; // silently fail if briefing unavailable
  }

  return (
    <div className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm border-l-4 border-l-defender-red p-5">
      <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-2">
        Defender Impact Briefing
      </div>
      <p className="text-sm text-defender-black leading-relaxed italic">{text}</p>
    </div>
  );
}
