import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  /** Ink pill. The default action on light fields. */
  primary: 'bg-brand-600 text-white hover:bg-brand-500',
  /** Outlined ink pill. */
  secondary: 'bg-transparent text-ink ring-1 ring-inset ring-ink/25 hover:ring-ink hover:bg-surface',
  ghost: 'text-ink-soft hover:bg-brand-100 hover:text-ink',
  danger: 'bg-danger text-white hover:opacity-90',
  /** Haldi pill. The default action on dark (ink) fields only. */
  accent: 'bg-haldi text-ink hover:bg-haldi-deep',
  /** Outlined white pill. Secondary action on dark (ink) fields only. */
  'outline-light': 'bg-transparent text-white ring-1 ring-inset ring-white/40 hover:ring-white hover:bg-white/10',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-caption',
  md: 'h-11 px-6 text-body',
  lg: 'h-14 px-8 text-h3',
}

interface StyleProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
}

function buttonClasses({ variant = 'primary', size = 'md', fullWidth, className }: StyleProps) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-pill font-bold transition-colors duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {}

export function Button({ variant, size, fullWidth, className, type = 'button', ...rest }: Props) {
  return <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...rest} />
}

/** A real link that looks like a Button (use for navigation, not <Link><Button/></Link>). */
export function LinkButton({ variant, size, fullWidth, className, ...rest }: LinkProps & StyleProps) {
  return <Link className={buttonClasses({ variant, size, fullWidth, className })} {...rest} />
}
