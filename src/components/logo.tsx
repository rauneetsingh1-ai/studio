import { cn } from '@/lib/utils';
import LogoIcon from './logo-icon';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoIcon className="h-6 w-6" />
      <span className="font-bold text-xl font-headline">CollabX</span>
    </div>
  );
}
