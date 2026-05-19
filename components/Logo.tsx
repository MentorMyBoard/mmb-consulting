type LogoProps = {
  className?: string;
};

export function Logo({ className = '' }: LogoProps) {
  return (
    <a
      href="https://mentormyboard.com"
      className={`flex items-center ${className}`}
      aria-label="MentorMyBoard — home"
    >
      <img
        src="/logo.png"
        alt="MentorMyBoard"
        className="h-10 md:h-12 w-auto object-contain"
        loading="eager"
      />
    </a>
  );
}
