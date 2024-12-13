import { cn } from "@/app/_utils/cn"
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import * as React from 'react'

const linkVariants = cva(
  "inline-flex items-center gap-2 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative",
  {
    variants: {
      variant: {
        default: 'text-foreground !underline',
        primary: 'text-primary hover:text-primary/80 hover:translate-x-0.5 underline',
        destructive: 'text-destructive hover:text-destructive/80 hover:scale-105',
        muted: 'text-muted-foreground hover:text-muted-foreground/80',
        neutral: 'flex items-center gap-2 dark:text-neutral-800 border border-neutral-400 bg-neutral-100 rounded-md px-4 py-2 !no-underline',
        outline: 'border border-current rounded-md px-3 py-1.5 hover:bg-accent/10 dark:hover:bg-neutral-100 dark:hover:text-neutral-900',
        gradient: `bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-no-repeat bg-left-bottom
          hover:bg-[length:100%_2px] transition-all duration-300`,
      },
      size: {
        default: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs',
        lg: 'text-lg',
        article: 'text-[17px]'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface CustomLinkProps
  extends LinkProps,
  VariantProps<typeof linkVariants> {
  href: string
  className?: string
  children: React.ReactNode
  rel?: string
  icon?: boolean
  asChild?: boolean
}

export const LinkCustom = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ href, className, children, variant, size, icon = true, asChild = false, ...props }, ref) => {
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))

    const ExternalIcon = () => (
      <span className="inline-flex items-center">
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          aria-hidden="true"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </span>
    )

    if (!isInternalLink) {
      const Comp = asChild ? Slot : 'a'
      return (
        <Comp
          ref={ref}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className={cn(linkVariants({ variant, size, className }))}
          {...props}
        >
          {children}
          {icon && <ExternalIcon />}
        </Comp>
      )
    }

    const Comp = asChild ? Slot : Link
    const linkProps = asChild ? { className: cn(linkVariants({ variant, size, className })) } : {
      href,
      className: cn(linkVariants({ variant, size, className }))
    }

    return (
      <Comp
        ref={ref}
        {...linkProps}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

LinkCustom.displayName = 'LinkCustom'

export { linkVariants }
