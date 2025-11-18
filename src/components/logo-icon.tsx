import { cn } from '@/lib/utils';

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="neon-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
      </defs>
      <g filter="url(#neon-glow)">
        {/* Top-left to Bottom-right stroke */}
        <path
          d="M6 6L16 16L26 26"
          stroke="url(#neon-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Bottom-left to Top-right stroke */}
        <path
          d="M6 26L16 16L26 6"
          stroke="url(#neon-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Center Node */}
        <circle cx="16" cy="16" r="3" fill="hsl(var(--background))" stroke="hsl(var(--secondary))" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="1.5" fill="url(#neon-gradient)" />

        {/* Endpoint Nodes */}
        <circle cx="6" cy="6" r="2" fill="hsl(var(--primary))" />
        <circle cx="26" cy="26" r="2" fill="hsl(var(--accent))" />
        <circle cx="6" cy="26" r="2" fill="hsl(var(--primary))" />
        <circle cx="26" cy="6" r="2" fill="hsl(var(--accent))" />
      </g>
    </svg>
  );
}
