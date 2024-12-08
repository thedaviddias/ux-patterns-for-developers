import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import React from 'react'

type CustomLinkProps = LinkProps & {
  href: string
  className?: string
  children: React.ReactNode
  rel?: string
  icon?: boolean
}

export const LinkCustom: React.FC<CustomLinkProps> = ({
  href,
  className,
  children,
  icon = true,
  ...rest
}) => {
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))

  if (!isInternalLink) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={clsx(
          'cursor-pointer inline-flex',
          className
        )}
        {...rest}
      >
        {children}
        {icon && (
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
        )}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={clsx('cursor-pointer', className)}
      {...rest}
    >
      {children}
    </Link>
  )
}
