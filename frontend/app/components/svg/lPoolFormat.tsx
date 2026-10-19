import * as React from "react"

export default function LPoolFormat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={86} height={50} viewBox="0 0 86 50" {...props}>
      <path
        d="M1 1H45V23H85V49H1V1Z"
        fill="none"
        stroke="#0873A6"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  )
}
