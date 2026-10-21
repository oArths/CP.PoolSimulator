import * as React from "react";

interface PoolOutlineProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  texture?: string;
  outlineColor?: string;
}

export default function PoolOutline({
  children,
  texture,
  outlineColor,
  ...props
}: PoolOutlineProps) {
  return (
    <div className="relative w-full h-fit">
      <div
        className="absolute rounded-[14px]"
        style={{
          left: `${13 / 434 * 100}%`,
          top: `${29 / 322 * 100}%`,
          width: `${408 / 434 * 100}%`,
          height: `${284 / 322 * 100}%`,
          backgroundImage: texture ? `url(${texture})` : undefined,
          backgroundSize: "100% 96%",
        }}
      />
      <svg
        className="relative"
        width="100%"
        height="100%"
        viewBox="0 0 434 322"
        preserveAspectRatio="xMidYMid meet"
        fill="none" stroke="#0873A6" 
        {...props}
      >
        <rect
          x={13}
          y={29}
          width={408}
          height={284}
          rx={14}
          strokeWidth={3}
          strokeDasharray="54 26 "
          stroke={outlineColor}
        />

        <rect
          x={186}
          y={307}
          width={62}
          height={13}
          rx={6}
          fill="#176082"
        />
      </svg>

      <div className="absolute inset-0  flex items-center justify-center flex-col" style={{
        left: `${13 / 434 * 100}%`,
        top: `${29 / 322 * 100}%`,
        width: `${408 / 434 * 100}%`,
        height: `${284 / 322 * 100}%`,
      }}>
        {children}
      </div>
    </div>
  );
}