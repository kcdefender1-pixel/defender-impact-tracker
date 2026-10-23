import type { Pillar } from '@/content/impact-2026';

// Fill = solid pillar color with readable text; dot = small swatch; text = pillar color as text on paper
export const PILLAR_STYLE: Record<Pillar, { fill: string; dot: string; text: string; border: string }> = {
  narrative: { fill: 'bg-defender-red text-white', dot: 'bg-defender-red', text: 'text-defender-red', border: 'border-defender-red' },
  organizing: { fill: 'bg-defender-gold text-ink', dot: 'bg-defender-gold', text: 'text-[#9A6B00]', border: 'border-defender-gold' },
  material: { fill: 'bg-defender-green text-white', dot: 'bg-defender-green', text: 'text-defender-green', border: 'border-defender-green' },
  cultural: { fill: 'bg-defender-violet text-ink', dot: 'bg-defender-violet', text: 'text-[#6B4EE6]', border: 'border-defender-violet' },
  institutional: { fill: 'bg-defender-blue text-white', dot: 'bg-defender-blue', text: 'text-defender-blue', border: 'border-defender-blue' },
};

export function formatMonthDay(iso: string) {
  // Content dates are calendar days; parse as UTC so they never shift a day
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
