import { cn } from '@/lib/utils';
import LogoIcon from './logo-icon';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoIcon />
      <span className="font-bold text-lg text-foreground">CollabX</span>
    </div>
  );
}
