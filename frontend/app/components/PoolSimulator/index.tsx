"use client";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import Home from "../home";
import poolDescription from "../../json/poolAvalible.json";
import * as SvgComponents from "../svg";
import PoolOutline from "../svg/poolOutline";
import { usePoolStore } from "@/app/store/poolStore";

const poolFormatComponents: Record<
    string,
    ComponentType<SVGProps<SVGSVGElement>>
> = SvgComponents;

const STEPS = [
    "Formato",
    "Medidas",
    "Produto",
    "Configuração",
    "Estimativa",
] as const;

function MeasureInput({
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

export default function PoolSimulator() {
    const poolItems: PoolAvailable[] = poolDescription;
    const setField = usePoolStore((state) => state.setField);
    const format = usePoolStore((state) => state.format);
    const heigth = usePoolStore((state) => state.heigth);
    const width = usePoolStore((state) => state.width);
    const measure = usePoolStore((state) => state.measure);
    const gate = usePoolStore((state) => state.gate);
    const deck = usePoolStore((state) => state.deck);
    const gap = usePoolStore((state) => state.gap);
    const display = usePoolStore((state) => state.display);
    const surrounded = usePoolStore((state) => state.surrounded);
    const actualStep = usePoolStore((state) => state.actualStep);
    const stepIndex = STEPS.indexOf(actualStep);
    const FormatIcon = format ? poolFormatComponents[format.component] : null;

    const decimals = measure === "Metros" ? 2 : 0;
    const unit = measure === "Metros" ? "m" : "cm";
    const fmt = (value: number) => value.toFixed(decimals);
    const w = Number(width ?? 0) || 0;
    const h = Number(heigth ?? 0) || 0;
    const g = Number(gap ?? 0) || 0;
    const area = w * h;
    // cerca = perímetro da linha de cerca, deslocada g em todos os lados
    const fence = 2 * (w + 2 * g) + 2 * (h + 2 * g);

    const toggleMeasure = (next: "Metros" | "Centimetros") => {
        if (next === measure) return;
        const factor = next === "Centimetros" ? 100 : 0.01;
        const convert = (value: number) => {
            const scaled = value * factor;
            return next === "Metros"
                ? Math.round(scaled * 100) / 100
                : Math.round(scaled);
        };
        setField("width", convert(w));
        setField("heigth", convert(h));
        setField("gap", convert(g));
        setField("measure", next);
    };

    return (
        <>
            <Home />
            <section className="flex flex-col items-center justify-center w-11/12 h-fit gap-7 mb-20 ">
                <div className="flex flex-row gap-2.5 w-fit items-center py-5">
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${0 <= stepIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-400-14">Formato</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${1 <= stepIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-400-14">Medidas</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${2 <= stepIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-400-14">Produto</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${3 <= stepIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-400-14">Configuração</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${4 <= stepIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-400-14">Estimativa</h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-7 flex-1 w-full  max-h-screen  ">
                    <div className="card flex flex-col gap-4 w-full h-full">
                        {actualStep === "Formato" && (
                            <>
                                <span className="flex flex-col gap-4 w-full">
                                    <h1 className="text-600-28 text-primary-blue">
                                        Qual é o formato da sua piscina?
                                    </h1>
                                    <h2 className="text-400-16 text-graphite">
                                        Selecione o formato que melhor representa a sua piscina.
                                        Você poderá ajustar as medidas no próximo passo.
                                    </h2>
                                </span>
                                <div className="grid grid-cols-3 grid-rows-2 gap-4 ">
                                    {poolItems &&
                                        poolItems[0].formats.map((item, index) => {
                                            const FormatIcon = poolFormatComponents[item.component];
                                            return (
                                                <div
                                                    onClick={() => setField("format", item)}
                                                    key={index}
                                                    className={`flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 p-4 gap-3 cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${format?.name === item.name ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}
                                                >
                                                    {FormatIcon ? (
                                                        <FormatIcon className="fill-transparent stroke-primary-blue" />
                                                    ) : null}{" "}
                                                    <h4 className="text-400-14 text-graphite">
                                                        {item.name}
                                                    </h4>
                                                </div>
                                            );
                                        })}
                                </div>
                                <p className="card-info w-full h-fit text-graphite text-400-14">
                                    Não encontrou o formato exato? Escolha o mais próximo — você
                                    poderá detalhar melhor nas etapas seguintes.
                                </p>
                            </>
                        )}
                        {actualStep === "Medidas" && (
                            <>
                                <span className="flex flex-col gap-4 w-full">
                                    <h1 className="text-600-28 text-primary-blue">
                                        Piscina {format?.name}
                                    </h1>
                                    <h2 className="text-400-16 text-graphite">
                                        Ajuste as medidas. A planta ao lado é atualizada
                                        automaticamente.
                                    </h2>
                                </span>
                                <fieldset className="flex flex-col gap-4">
                                    <div className="flex flex-row justify-between gap-3">
                                        <span className="flex flex-col gap-1.5 w-full">
                                            <label className="text-400-14 text-graphite">
                                                Comprimento
                                            </label>
                                            <MeasureInput
                                                value={w}
                                                unit={measure}
                                                onCommit={(value) => setField("width", value)}
                                            />
                                        </span>
                                        <span className="flex flex-col gap-1.5 w-full">
                                            <label className="text-400-14 text-graphite">
                                                Largura
                                            </label>
                                            <MeasureInput
                                                value={h}
                                                unit={measure}
                                                onCommit={(value) => setField("heigth", value)}
                                            />
                                        </span>
                                    </div>
                                    <span className="flex flex-col gap-1.5 w-full">
                                        <label className="text-400-14 text-graphite">
                                            Distância da piscina até a cerca
                                        </label>
                                        <MeasureInput
                                            value={g}
                                            unit={measure}
                                            onCommit={(value) => setField("gap", value)}
                                        />
                                    </span>
                                    <span className="flex flex-col gap-1.5 w-full">
                                        <label className="text-400-14 text-graphite">
                                            Unidade de medida
                                        </label>
                                        <div className="flex flex-row gap-2">
                                            <p
                                                onClick={() => toggleMeasure("Metros")}
                                                className={`tag cursor-pointer ${measure === "Metros" && "bg-aqua-light border-cp-life-cyan text-primary-blue"}`}
                                            >
                                                Metros
                                            </p>
                                            <p
                                                onClick={() => toggleMeasure("Centimetros")}
                                                className={`tag cursor-pointer ${measure === "Centimetros" && "bg-aqua-light border-cp-life-cyan text-primary-blue"}`}
                                            >
                                                Centímetros
                                            </p>
                                        </div>
                                    </span>
                                </fieldset>
                            </>
                        )}
                        {actualStep === "Produto" && (
                            <>
                                <span className="flex flex-col gap-4 w-full">
                                    <h1 className="text-600-28 text-primary-blue">
                                        Escolha seu produto
                                    </h1>
                                    <h2 className="text-400-16 text-graphite">
                                        Selecione o material da cerca e a opção de portão que deseja
                                        incluir.
                                    </h2>
                                </span>
                                <fieldset className="flex flex-col gap-4">
                                    <label className="text-400-14 font-medium text-graphite">
                                        Produto
                                    </label>
                                    {poolItems &&
                                        poolItems[0].surrounded.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setField("surrounded", item)}

                                                    className={`flex flex-col items-start gap-2.5 justify-center w-full h-full rounded-2xl border-2 p-4  cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${item.type === surrounded?.type ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}
                                                >
                                                    <h2 className=" text-600-22 text-primary-blue ">
                                                        {item.type}
                                                    </h2>
                                                    <p className="text-400-16 text-neutral-gray">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                </fieldset>
                                <fieldset className="flex flex-col gap-4">
                                    <label className="text-400-14 font-medium text-graphite">
                                        Tipo de portão
                                    </label>
                                    <div className="flex flex-row gap-3">

                                        {poolItems &&
                                            poolItems[0].gates.map((item, index) => {
                                                const FormatIcon = poolFormatComponents[item.component];

                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setField("gate", item)}

                                                        className={`flex flex-col items-center gap-2.5 justify-center w-full h-full rounded-2xl border-2 p-4  cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${item.type === gate?.type ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}
                                                    >
                                                        <p className="text-400-16 text-neutral-gray">
                                                            {" "}
                                                            <FormatIcon className="fill-transparent stroke-primary-blue" />
                                                        </p>
                                                        <h2 className=" text-400-14 text-primary-blue font-semibold ">
                                                            {item.type}
                                                        </h2>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </fieldset>
                            </>
                        )}
                        {actualStep === "Configuração" && (
                            <>
                                <span className="flex flex-col gap-4 w-full">
                                    <h1 className="text-600-28 text-primary-blue">
                                        Configure seu projeto
                                    </h1>
                                    <h2 className="text-400-16 text-graphite">
                                        Escolha o piso ao redor da piscina e a cor da malha da cerca.
                                    </h2>
                                </span>
                                <fieldset className="flex flex-col gap-4">
                                    <label className="text-400-14 font-medium text-graphite">
                                        Tipo de deck/piso
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">

                                        {poolItems &&
                                            poolItems[0].deck.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setField("deck", item)}

                                                        className={`flex flex-col items-center gap-2.5 justify-center w-full h-full rounded-2xl border-2 p-4  cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${item.name === deck?.name ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}
                                                    >
                                                        <figure>
                                                            <img src={`./imgs/${item.imagePath}`} />
                                                        </figure>
                                                        <p className="text-400-16 text-neutral-gray">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </fieldset>
                                <fieldset className="flex flex-col gap-4">
                                    <label className="text-600-14 font-medium text-graphite">
                                        Cor da tela
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">

                                        {poolItems &&
                                            poolItems[0].display.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setField("display", item)}

                                                        className={`flex flex-col items-center gap-2.5 justify-center w-full h-full rounded-2xl border-2 p-4  cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${item.name === display?.name ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}
                                                    >
                                                        <figure>
                                                            <img src={`./imgs/${item.imagePath}`} />
                                                        </figure>
                                                        <p className="text-400-16 text-neutral-gray">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </fieldset>
                            </>
                        )}
                        <div className="flex flex-row justify-between items-center mt-auto">
                            <button
                                className="button-outline"
                                onClick={() =>
                                    setField("actualStep", STEPS[STEPS.indexOf(actualStep) - 1])
                                }
                                disabled={actualStep === "Formato"}
                            >
                                Voltar ao{" "}
                                {
                                    STEPS[
                                    STEPS.indexOf(actualStep) === 0
                                        ? STEPS.indexOf(actualStep)
                                        : STEPS.indexOf(actualStep) + 1
                                    ]
                                }
                            </button>
                            <button
                                onClick={() =>
                                    setField("actualStep", STEPS[STEPS.indexOf(actualStep) + 1])
                                }
                                disabled={actualStep === "Estimativa"}
                                className="button-primary"
                            >
                                Próximo:{" "}
                                {
                                    STEPS[
                                    STEPS.indexOf(actualStep) === 0
                                        ? STEPS.indexOf(actualStep)
                                        : STEPS.indexOf(actualStep) + 1
                                    ]
                                }
                            </button>
                        </div>
                    </div>

                    <div className="card flex flex-col w-full h-full ">
                        <h2 className="text-600-28 text-primary-blue">
                            Visualização 2D
                        </h2>
                        <div className="bg-aqua-light rounded-2xl px-7 py-10">
                            <div>
                                <PoolOutline className="text-transparent  ">
                                    {FormatIcon && (
                                        <FormatIcon className="w-9/12 h-full stroke-cp-life-cyan fill-cp-life-cyan  " />
                                    )}
                                    <p className="absolute text-graphite text-600-14 bottom-5">
                                        PISCINA {fmt(w)} X {fmt(h)} {unit}
                                    </p>
                                </PoolOutline>
                            </div>
                        </div>
                        {actualStep === "Medidas" && (
                            <span className="flex flex-col gap-1.5 w-full">
                                <div className="flex flex-row gap-2">
                                    <p
                                        className={`tag cursor-pointer bg-aqua-light border-cp-life-cyan text-primary-blue`}
                                    >
                                        Área • {fmt(area)} {unit}²
                                    </p>
                                    <p
                                        className={`tag cursor-pointer bg-aqua-light border-cp-life-cyan text-primary-blue`}
                                    >
                                        Cerca • {fmt(fence)} {unit}
                                    </p>
                                    <p
                                        className={`tag cursor-pointer bg-aqua-light border-cp-life-cyan text-primary-blue`}
                                    >
                                        Distância • {fmt(g)} {unit}
                                    </p>
                                </div>
                            </span>
                        )}
                        {actualStep === "Produto" && (
                            <span className="flex flex-col gap-1.5 w-full">
                                <div className="flex flex-row gap-2">
                                    <p
                                        className={`tag cursor-pointer bg-aqua-light border-cp-life-cyan text-primary-blue`}
                                    >
                                        {surrounded?.type}
                                    </p>
                                    <p
                                        className={`tag cursor-pointer bg-aqua-light border-cp-life-cyan text-primary-blue`}
                                    >
                                        {gate?.type}
                                    </p>

                                </div>
                            </span>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
