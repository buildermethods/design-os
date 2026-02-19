import * as React from 'react'
import { cn } from '@/lib/utils'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Google Material Symbols icon name (e.g. "search", "arrow_back") */
  name?: string
  /** Custom SVG element — used instead of Material Symbols when provided */
  svg?: React.ReactNode
  /** Icon size in pixels (default: 20). Sets both font-size and SVG dimensions */
  size?: number
  /** Material Symbols FILL axis: true = 1, false = 0 (default: false) */
  fill?: boolean
  /** Material Symbols weight axis (default: 400) */
  weight?: number
  /** Material Symbols grade axis (default: 0) */
  grade?: number
  /** Material Symbols optical size axis (default: matches size prop) */
  opticalSize?: number
}

/**
 * Unified Icon component supporting Google Material Symbols and custom SVGs.
 *
 * Usage:
 *   <Icon name="search" />                             // Material Symbol
 *   <Icon name="check_circle" fill />                  // Filled variant
 *   <Icon name="edit" size={16} className="text-blue-500" />
 *   <Icon svg={<MyCustomSvg />} size={24} />           // Custom SVG
 */
const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      svg,
      size = 20,
      fill = false,
      weight = 400,
      grade = 0,
      opticalSize,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const resolvedOpticalSize = opticalSize ?? size

    // Custom SVG path
    if (svg) {
      return (
        <span
          ref={ref}
          role="img"
          aria-hidden="true"
          className={cn('inline-flex items-center justify-center shrink-0', className)}
          style={{
            width: size,
            height: size,
            ...style,
          }}
          {...props}
        >
          {svg}
        </span>
      )
    }

    // Material Symbols path
    if (!name) return null

    return (
      <span
        ref={ref}
        role="img"
        aria-hidden="true"
        className={cn(
          'material-symbols-outlined inline-flex items-center justify-center shrink-0 select-none',
          className
        )}
        style={{
          fontSize: size,
          width: size,
          height: size,
          lineHeight: 1,
          fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${resolvedOpticalSize}`,
          ...style,
        }}
        {...props}
      >
        {name}
      </span>
    )
  }
)

Icon.displayName = 'Icon'

export { Icon }
