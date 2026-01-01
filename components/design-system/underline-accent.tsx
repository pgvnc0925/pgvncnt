import { cn } from "@/lib/utils"

interface UnderlineAccentProps {
  className?: string
  width?: "short" | "medium" | "long"
  sketched?: boolean
}

export function UnderlineAccent({ className, width = "short", sketched = false }: UnderlineAccentProps) {
  const widthStyles = {
    short: "w-12",
    medium: "w-20",
    long: "w-28",
  }

  if (sketched) {
    const widthPixels = {
      short: 180,
      medium: 320,
      long: 480,
    }

    return (
      <svg
        width={widthPixels[width]}
        height="28"
        viewBox={`0 0 ${widthPixels[width]} 28`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d={`M4,22 Q${widthPixels[width] * 0.15},20 ${widthPixels[width] * 0.3},16 Q${widthPixels[width] * 0.45},12 ${widthPixels[width] * 0.65},8 Q${widthPixels[width] * 0.82},5 ${widthPixels[width] - 6},4`}
          stroke="#D4AF37"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.5))',
          }}
        />
        <path
          d={`M5,23 Q${widthPixels[width] * 0.16},21 ${widthPixels[width] * 0.31},17 Q${widthPixels[width] * 0.46},13 ${widthPixels[width] * 0.66},9 Q${widthPixels[width] * 0.83},6 ${widthPixels[width] - 5},5`}
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
          style={{
            filter: 'blur(0.5px)',
          }}
        />
      </svg>
    )
  }

  return (
    <div
      className={cn(
        "h-1.5 bg-secondary rounded-full",
        widthStyles[width],
        className
      )}
    />
  )
}
