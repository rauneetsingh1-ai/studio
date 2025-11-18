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
        <path
          d="M9.51613 2H2V9.51613L16 23.5323L23.5323 16L9.51613 2Z"
          fill="currentColor"
          className="text-secondary"
        />
        <path
          d="M22.4839 30H30V22.4839L16 8.46774L8.46774 16L22.4839 30Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-bold text-lg text-foreground">CollabX</span>
    </div>
  );
}
