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
           <path d="M11.9999 2L2 16L11.9999 30L15.9999 26L9.99994 16L15.9999 6L11.9999 2Z" fill="hsl(var(--primary))"/>
           <path d="M20 2L24 6L18 16L24 26L20 30L10 16L20 2Z" fill="hsl(var(--secondary))"/>
        </svg>
    );
}
