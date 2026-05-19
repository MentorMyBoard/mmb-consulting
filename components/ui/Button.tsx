import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: never };

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

type Props = ButtonProps | AnchorProps;

const variantClasses = {
  primary:
    'bg-primary text-on-primary hover:bg-secondary hover:text-primary hover:shadow-xl hover:-translate-y-1',
  secondary:
    'bg-secondary text-primary hover:bg-white hover:shadow-xl hover:-translate-y-1',
  ghost:
    'border border-secondary text-secondary hover:bg-secondary/10 backdrop-blur-sm',
};

const sizeClasses = {
  sm: 'px-6 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-sm',
};

const base =
  'inline-flex items-center justify-center uppercase tracking-[0.15em] font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed';

export function Button({ variant = 'primary', size = 'md', children, as, ...rest }: Props) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]}`;

  if (as === 'a') {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <a href={href} className={classes} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
