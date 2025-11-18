import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path d="M6 2L20 30H26L12 2H6Z" fill="hsl(var(--primary))" />
        <path d="M26 2L12 30H6L20 2H26Z" fill="hsl(var(--secondary))" />
      </svg>
      <span className="font-bold text-lg text-foreground">CollabX</span>
    </div>
  );
}
