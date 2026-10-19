import * as React from "react"

export default function EllipesePoolFormat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={88} height={52} viewBox="0 0 88 52" {...props}>
      <rect
        x={1}
        y={1}
        width={86}
        height={50}
        rx={25}
        fill="none"
        stroke="#0873A6"
        strokeWidth={2}
      />
    </svg>
  )
}

