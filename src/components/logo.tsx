import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Swords className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl font-headline">TeamUp Forge</span>
    </div>
  );
}
