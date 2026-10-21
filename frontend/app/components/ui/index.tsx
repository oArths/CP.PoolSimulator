import type { ReactNode } from "react";

export function SectionTitle({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <span className="flex flex-col gap-4 w-full">
            <h2 className="text-600-24 md:text-600-28 text-primary-blue">{title}</h2>
            {description && (
                <p className="text-400-14 md:text-400-16 text-graphite">{description}</p>
            )}
        </span>
    );
}

export function SelectableCard({
    selected,
    onClick,
    className = "",
    children,
}: {
    selected: boolean;
    onClick: () => void;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border-2 p-4 w-full h-full cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${selected ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray"} ${className}`}
        >
            {children}
        </div>
    );
}

export function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <span className="flex flex-col gap-1.5 items-start justify-center w-full">
            <label className="text-400-14 text-graphite">{label}</label>
            {children}
            {error && <span className="text-400-12 text-red-500">{error}</span>}
        </span>
    );
}

export function SummaryRow({
    label,
    value,
    highlight = false,
}: {
    label: ReactNode;
    value: ReactNode;
    highlight?: boolean;
}) {
    return (
        <span
            className={`flex flex-row justify-between ${highlight ? "border-t border-border-gray pt-3" : ""}`}
        >
            <p className={highlight ? "text-400-18 text-graphite" : "text-400-14 text-neutral-gray"}>
                {label}
            </p>
            <span className={highlight ? "text-600-18 text-primary-blue" : "text-400-14 text-graphite"}>
                {value}
            </span>
        </span>
    );
}
