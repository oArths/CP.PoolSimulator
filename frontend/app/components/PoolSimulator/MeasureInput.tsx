"use client";
import { useState } from "react";

export default function MeasureInput({
    value,
    unit,
    onCommit,
}: {
    value: number;
    unit: "Metros" | "Centimetros";
    onCommit: (value: number) => void;
}) {
    const [draft, setDraft] = useState<string | null>(null);
    const decimals = unit === "Metros" ? 2 : 0;
    const display =
        draft ?? (decimals === 2 ? value.toFixed(2) : String(Math.round(value)));

    return (
        <input
            className="input"
            type="text"
            inputMode="decimal"
            value={display}
            placeholder={decimals === 2 ? "8,00 m" : "800 cm"}
            onChange={(e) => {
                // sanitiza no próprio input: sem sinal negativo e com o máximo de decimais da unidade
                const digits = e.currentTarget.value.replace(/[^\d.]/g, "");
                const [whole, ...rest] = digits.split(".");
                const clean =
                    decimals === 0 || !rest.length
                        ? whole
                        : `${whole}.${rest.join("").slice(0, decimals)}`;
                setDraft(clean);
                const parsed = Number(clean);
                if (clean !== "" && !Number.isNaN(parsed)) onCommit(parsed);
            }}
            onBlur={() => setDraft(null)}
        />
    );
}
