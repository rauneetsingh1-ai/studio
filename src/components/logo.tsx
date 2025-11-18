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
          d="M22.8218 2.00012C16.8226 2.00012 12 6.82276 12 12.8219V19.1782C12 25.1774 16.8226 30.0001 22.8218 30.0001C28.821 30.0001 33.6437 25.1774 33.6437 19.1782V12.8219C33.6437 6.82276 28.821 2.00012 22.8218 2.00012Z"
          fill="currentColor"
        />
        <path
          d="M9.17822 29.9999C15.1774 29.9999 20 25.1772 20 19.1781V12.8218C20 6.82264 15.1774 1.99991 9.17822 1.99991C3.17904 1.99991 -1.64374 6.82264 -1.64374 12.8218V19.1781C-1.64374 25.1772 3.17904 29.9999 9.17822 29.9999Z"
          fill="hsl(var(--secondary))"
        />
      </svg>
      <span className="font-bold text-lg text-foreground">CollabX</span>
    </div>
  );
}
