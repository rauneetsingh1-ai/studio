import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image src="/logo.png" alt="CollabX Logo" width={140} height={32} />
    </div>
  );
}
