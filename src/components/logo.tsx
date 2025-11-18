import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neon-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4DDFFF" />
            <stop offset="50%" stopColor="#9A4DFF" />
            <stop offset="100%" stopColor="#3BF0E0" />
          </linearGradient>
        </defs>
        
        {/* Glow Effect */}
        <path d="M6 6L26 26" stroke="url(#neon-gradient)" strokeWidth="3" strokeLinecap="round" style={{ filter: "blur(4px)", opacity: 0.7 }} />
        <path d="M26 6L6 26" stroke="url(#neon-gradient)" strokeWidth="3" strokeLinecap="round" style={{ filter: "blur(4px)", opacity: 0.7 }} />

        {/* Main Icon */}
        <path d="M6 6L26 26" stroke="url(#neon-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M26 6L6 26" stroke="url(#neon-gradient)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Nodes */}
        <circle cx="6" cy="6" r="3" fill="#3BF0E0" />
        <circle cx="26" cy="26" r="3" fill="#3BF0E0" />
        <circle cx="26" cy="6" r="3" fill="#4DDFFF" />
        <circle cx="6" cy="26" r="3" fill="#4DDFFF" />
        <circle cx="16" cy="16" r="3" fill="#9A4DFF" />
      </svg>
      <span className="font-bold text-lg text-foreground">CollabX</span>
    </div>
  );
}
