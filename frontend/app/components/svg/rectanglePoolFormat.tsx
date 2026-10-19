import * as React from "react"

export default function RectanglePoolFormat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={80} height={46} viewBox="0 0 80 46" {...props}>
      <rect
        x={1}
        y={1}
        width={78}
        height={44}
        rx={9}
        fill="none"
        stroke="#0873A6"
        strokeWidth={2}
      />
    </svg>
  )
}
