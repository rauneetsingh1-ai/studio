export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00AFFF" />
          <stop offset="1" stopColor="#A759FF" />
        </linearGradient>
      </defs>
      <path
        d="M6.34315 6.34315L17.6569 17.6569M6.34315 17.6569L17.6569 6.34315"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="4" r="2.5" fill="url(#logo-gradient)" />
      <circle cx="20" cy="4" r="2.5" fill="url(#logo-gradient)" />
      <circle cx="4" cy="20" r="2.5" fill="url(#logo-gradient)" />
      <circle cx="20" cy="20" r="2.5" fill="url(#logo-gradient)" />
    </svg>
  );
}
