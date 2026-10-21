"use client";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import Home from "../home";
import poolDescription from "../../json/poolAvalible.json";
import * as SvgComponents from "../svg";
import PoolOutline from "../svg/poolOutline";
import Dropdown from "../dropdown";
import { usePoolStore } from "@/app/store/poolStore";
import { quoteSchema } from "@/app/store/poolStore/quoteSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";
import Modal from "../modal";

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

const UFS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO",
];

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
    const service = usePoolStore((state) => state.service);
    const fullName = usePoolStore((state) => state.fullName);
    const whatsapp = usePoolStore((state) => state.whatsapp);
    const email = usePoolStore((state) => state.email);
    const cep = usePoolStore((state) => state.cep);
    const state = usePoolStore((state) => state.state);
    const city = usePoolStore((state) => state.city);
    const message = usePoolStore((state) => state.message);
    const consent = usePoolStore((state) => state.consent);
    const stepIndex = STEPS.indexOf(actualStep);
    const [configStep, setConfigStep] = useState<"deck" | "display">("deck");
    const [productStep, setProductStep] = useState<"produto" | "portao">(
        "produto",
    );
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const showDeckColors = stepIndex >= STEPS.indexOf("Configuração");
    const FormatIcon = format ? poolFormatComponents[format.component] : null;

    const submitQuote = () => {
        const result = quoteSchema.safeParse({
            fullName,
            whatsapp,
            email,
            cep,
            state,
            city,
            message,
            consent,
        });
        if (!result.success) {
            const errors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0];
                if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
            }
            setFormErrors(errors);
            toast.error(Object.values(errors)[0] ?? "Revise os campos destacados.");
            return;
        }
        setFormErrors({});
        toast.success("Solicitação enviada! Nossa equipe entrará em contato.");
    };

    const lookupCep = async (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 8);
        setField("cep", digits);
        if (digits.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await response.json();
            if (data.erro) {
                toast.error("CEP não encontrado.");
                return;
            }
            setField("state", data.uf ?? "");
            setField("city", data.localidade ?? "");
        } catch {
            toast.error("Não foi possível buscar o CEP.");
        }
    };

    const addFiles = (selected: FileList | null) => {
        if (!selected) return;
        const next = [...attachments, ...Array.from(selected)];
        if (next.length > 3) toast.error("Anexe no máximo 3 arquivos.");
        setAttachments(next.slice(0, 3));
    };

    const removeFile = (index: number) => {
        setAttachments(attachments.filter((_, fileIndex) => fileIndex !== index));
    };

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

                <div className="grid grid-cols-2 gap-7 flex-1 w-full  h-fit ">
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
                                            <label className="text-600-14 text-graphite">
                                                Comprimento
                                            </label>
                                            <MeasureInput
                                                value={w}
                                                unit={measure}
                                                onCommit={(value) => setField("width", value)}
                                            />
                                        </span>
                                        <span className="flex flex-col gap-1.5 w-full">
                                            <label className="text-600-14 text-graphite">
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
                                        <label className="text-600-14 text-graphite">
                                            Distância da piscina até a cerca
                                        </label>
                                        <MeasureInput
                                            value={g}
                                            unit={measure}
                                            onCommit={(value) => setField("gap", value)}
                                        />
                                    </span>
                                    <span className="flex flex-col gap-1.5 w-full">
                                        <label className="text-600-14 text-graphite">
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
                                        {productStep === "produto"
                                            ? "Selecione o material da cerca."
                                            : "Escolha o tipo de portão que deseja incluir."}
                                    </h2>
                                </span>
                                <fieldset
                                    className={
                                        productStep === "produto" ? "flex flex-col gap-4" : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
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
                                <fieldset
                                    className={
                                        productStep === "portao" ? "flex flex-col gap-4" : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
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
                                        {configStep === "deck"
                                            ? "Escolha o piso ao redor da piscina."
                                            : "Escolha a cor da malha da cerca."}
                                    </h2>
                                </span>
                                <fieldset
                                    className={
                                        configStep === "deck" ? "flex flex-col gap-6" : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
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
                                                        <figure className="w-20 h-fit">
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
                                <fieldset
                                    className={
                                        configStep === "display" ? "flex flex-col gap-4" : "hidden"
                                    }
                                >
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
                                                        <figure className="w-20 h-fit">
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
                                onClick={() => {
                                    if (
                                        actualStep === "Configuração" &&
                                        configStep === "display"
                                    ) {
                                        setConfigStep("deck");
                                        return;
                                    }
                                    if (actualStep === "Produto" && productStep === "portao") {
                                        setProductStep("produto");
                                        return;
                                    }
                                    setConfigStep("deck");
                                    setProductStep("produto");
                                    setField("actualStep", STEPS[stepIndex - 1]);
                                }}
                                disabled={actualStep === "Formato"}
                            >
                                Voltar ao{" "}
                                {actualStep === "Configuração" && configStep === "display"
                                    ? "Tipo de deck/piso"
                                    : actualStep === "Produto" && productStep === "portao"
                                        ? "Produto"
                                        : STEPS[stepIndex - 1]}
                            </button>
                            <button
                                onClick={() => {
                                    if (actualStep === "Configuração" && configStep === "deck") {
                                        setConfigStep("display");
                                        return;
                                    }
                                    if (actualStep === "Produto" && productStep === "produto") {
                                        setProductStep("portao");
                                        return;
                                    }
                                    if (actualStep === "Configuração" && configStep === "display") {
                                        setIsQuoteOpen(true);
                                        return;
                                    }
                                    setField("actualStep", STEPS[stepIndex + 1]);
                                }}
                                disabled={actualStep === "Estimativa"}
                                className="button-primary"
                            >
                                Próximo:{" "}
                                {actualStep === "Configuração" && configStep === "deck"
                                    ? "Cor da tela"
                                    : actualStep === "Configuração" && configStep === "display"
                                        ? "Solicitar orçamento"
                                        : actualStep === "Produto" && productStep === "produto"
                                            ? "Tipo de portão"
                                            : STEPS[stepIndex + 1]}
                            </button>
                        </div>
                    </div>

                    <div className="card flex flex-col w-full h-full ">
                        <h2 className="text-600-28 text-primary-blue">Visualização 2D</h2>
                        <div className="bg-aqua-light rounded-2xl px-7 py-10 my-auto">
                            <div className="flex flex-col items-center">
                                <PoolOutline
                                    texture={
                                        showDeckColors && deck
                                            ? `./imgs/${deck.texture}`
                                            : undefined
                                    }
                                    outlineColor={showDeckColors ? display?.color : undefined}
                                >
                                    {FormatIcon && (
                                        <FormatIcon className="w-9/12 h-full stroke-cp-life-cyan fill-cp-life-cyan  " />
                                    )}
                                    <p className="absolute text-graphite text-600-14 bottom-8">
                                        PISCINA {fmt(w)} X {fmt(h)} {unit}
                                    </p>
                                </PoolOutline>
                                {actualStep !== "Formato" &&
                                    actualStep !== "Medidas" &&
                                    actualStep !== "Produto" && (
                                        <p className="text-primary-blue text-400-14 relative top-3">
                                            {gate?.type}
                                        </p>
                                    )}
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
                {isQuoteOpen && (
                    <Modal
                        onClose={() => setIsQuoteOpen(false)}
                    Children={
                        <section className="h-fit  px-8 gap-5 grid grid-cols-3">
                            <div className="flex flex-col gap-5 col-span-1">
                                <div className="card flex flex-col w-full ">
                                    <span className="flex flex-col gap-4 w-full">
                                        <h1 className="text-600-28 text-primary-blue">
                                            Resumo da configuração
                                        </h1>
                                        <h2 className="text-400-16 text-graphite">
                                            Confira todos os detalhes escolhidos para sua cerca.
                                        </h2>
                                    </span>
                                    <div className="bg-aqua-light rounded-2xl px-7 py-10 my-auto">
                                        <div className="flex flex-col items-center">
                                            <PoolOutline
                                                texture={
                                                    showDeckColors && deck
                                                        ? `./imgs/${deck.texture}`
                                                        : undefined
                                                }
                                                outlineColor={
                                                    showDeckColors ? display?.color : undefined
                                                }
                                            >
                                                {FormatIcon && (
                                                    <FormatIcon className="w-9/12 h-full stroke-cp-life-cyan fill-cp-life-cyan  " />
                                                )}
                                                <p className="absolute text-graphite text-600-14 bottom-8">
                                                    PISCINA {fmt(w)} X {fmt(h)} {unit}
                                                </p>
                                            </PoolOutline>
                                            {actualStep !== "Formato" &&
                                                actualStep !== "Medidas" &&
                                                actualStep !== "Produto" && (
                                                    <p className="text-primary-blue text-400-14 relative top-3">
                                                        {gate?.type}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">
                                                Formato da piscina
                                            </p>
                                            <p className="text-400-14 text-graphite">
                                                {format?.name}
                                            </p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">Produto</p>
                                            <p className="text-400-14 text-graphite">
                                                {surrounded?.type}
                                            </p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">Portão</p>
                                            <p className="text-400-14 text-graphite">{gate?.type}</p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">Deck/piso</p>
                                            <span className="flex flex-row gap-1 items-center justify-center">
                                                <img
                                                    className="w-3 h-3 rounded-sm"
                                                    src={`./imgs/${deck?.imagePath}`}
                                                />
                                                <p className="text-400-14 text-graphite">
                                                    {deck?.name}
                                                </p>
                                            </span>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">
                                                Cor da tela
                                            </p>
                                            <span className="flex flex-row gap-1 items-center justify-center">
                                                <img
                                                    className="w-3 h-3 rounded-sm"
                                                    src={`./imgs/${display?.imagePath}`}
                                                />
                                                <p className="text-400-14 text-graphite">
                                                    {display?.name}
                                                </p>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="card flex flex-col w-full ">
                                    <span className="flex flex-col gap-4 w-full">
                                        <h1 className="text-600-28 text-primary-blue">
                                            Resumo das medidas
                                        </h1>
                                    </span>

                                    <div className="flex flex-col gap-4">
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">
                                                Dimensões da piscina
                                            </p>
                                            <p className="text-400-14 text-graphite">
                                                {fmt(w)} X {fmt(h)} {unit}
                                            </p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">
                                                Distância da piscina até a cerca
                                            </p>
                                            <p className="text-400-14 text-graphite">{gap}</p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <p className="text-400-14 text-neutral-gray">
                                                Área da piscina{" "}
                                            </p>
                                            <p className="text-400-14 text-graphite">
                                                {fmt(area)} {unit}²
                                            </p>
                                        </span>
                                        <span className="flex flex-row justify-between border-t border-border-gray pt-3">
                                            <p className="text-400-18 text-graphite">
                                                Perímetro da cerca
                                            </p>
                                            <p className="text-600-18 text-primary-blue">
                                                {fmt(area)} {unit}²
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card flex flex-col w-full col-span-2 ">
                                <span className="flex flex-col gap-4 w-full">
                                    <h1 className="text-600-28 text-primary-blue">
                                        Vamos conversar sobre seu projeto?
                                    </h1>
                                    <h2 className="text-400-16 text-graphite">
                                        Preencha seus dados para que nossa equipe analise a
                                        configuração e entre em contato com você.
                                    </h2>
                                </span>
                                <fieldset className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-4 w-full">
                                        <h3 className="text-600-16 text-primary-blue">
                                            Seus dados
                                        </h3>
                                        <div className="flex flex-col gap-4 w-full">
                                            <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                <label className="text-400-14 text-graphite">
                                                    Nome completo *
                                                </label>
                                                <input
                                                    className="input"
                                                    placeholder="Como podemos chamar você?"
                                                    value={fullName}
                                                    onChange={(e) => setField("fullName", e.target.value)}
                                                />
                                                {formErrors.fullName && (
                                                    <span className="text-400-12 text-red-500">
                                                        {formErrors.fullName}
                                                    </span>
                                                )}
                                            </span>
                                            <div className="flex flex-row w-full gap-4">
                                                <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                    <label className="text-400-14 text-graphite">
                                                        WhatsApp *
                                                    </label>
                                                    <input
                                                        className="input"
                                                        placeholder="(00) 00000-0000"
                                                        inputMode="numeric"
                                                        value={whatsapp}
                                                        onChange={(e) =>
                                                            setField(
                                                                "whatsapp",
                                                                e.target.value.replace(/\D/g, "").slice(0, 11),
                                                            )
                                                        }
                                                    />
                                                    {formErrors.whatsapp && (
                                                        <span className="text-400-12 text-red-500">
                                                            {formErrors.whatsapp}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                    <label className="text-400-14 text-graphite">
                                                        E-mail *
                                                    </label>
                                                    <input
                                                        className="input"
                                                        placeholder="voce@exemplo.com.br"
                                                        value={email}
                                                        onChange={(e) => setField("email", e.target.value)}
                                                    />
                                                    {formErrors.email && (
                                                        <span className="text-400-12 text-red-500">
                                                            {formErrors.email}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 w-full">
                                        <h3 className="text-600-16 text-primary-blue">
                                            Onde será seu projeto?
                                        </h3>
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className="flex flex-row w-full gap-4">
                                                <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                    <label className="text-400-14 text-graphite">
                                                        CEP *
                                                    </label>
                                                    <input
                                                        className="input"
                                                        placeholder="00000-000"
                                                        inputMode="numeric"
                                                        value={cep}
                                                        onChange={(e) => lookupCep(e.target.value)}
                                                    />
                                                    {formErrors.cep && (
                                                        <span className="text-400-12 text-red-500">
                                                            {formErrors.cep}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                    <label className="text-400-14 text-graphite">
                                                        Estado *
                                                    </label>
                                                    <Dropdown
                                                        options={UFS}
                                                        value={state}
                                                        onChange={(value) => setField("state", value)}
                                                        placeholder="Selecione o estado"
                                                    />
                                                    {formErrors.state && (
                                                        <span className="text-400-12 text-red-500">
                                                            {formErrors.state}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                <label className="text-400-14 text-graphite">
                                                    Cidade *
                                                </label>
                                                <input
                                                    className="input"
                                                    placeholder="Informe a cidade do projeto"
                                                    value={city}
                                                    onChange={(e) => setField("city", e.target.value)}
                                                />
                                                {formErrors.city && (
                                                    <span className="text-400-12 text-red-500">
                                                        {formErrors.city}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 w-full">
                                        <h3 className="text-600-16 text-primary-blue">
                                            O que você precisa?
                                        </h3>
                                        <div className="flex flex-col gap-4 w-full">
                                            <label className="text-400-14 text-graphite">
                                                Tipo de serviço *
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label
                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${service === "Produto" ? "border-cp-life-cyan bg-cp-life-cyan/10 " : "border-border-gray"}`}>

                                                    <input
                                                        type="radio"
                                                        name="tipo"
                                                        value="produto"
                                                        className="mt-0.5 h-4 w-4 accent-primary-blue"
                                                        checked={service === "Produto"}
                                                        onChange={() => setField("service", "Produto")}
                                                    />

                                                    <div className="flex flex-col">
                                                        <span className={`text-600-14 ${service === "Produto" ? "text-primary-blue" : "text-gray-800 "}`}>
                                                            Produto
                                                        </span>

                                                        <span className="text-400-12 text-gray-500">
                                                            Somente o fornecimento da cerca.
                                                        </span>
                                                    </div>
                                                </label>

                                                <label
                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${service === "Produto + Instalçao" ? "border-cp-life-cyan bg-cp-life-cyan/10 " : "border-border-gray"}`}>
                                                    <input
                                                        type="radio"
                                                        name="tipo"
                                                        value="produto-instalacao"
                                                        checked={service === "Produto + Instalçao"}
                                                        onChange={() => setField("service", "Produto + Instalçao")}
                                                        className="mt-0.5 h-4 w-4 accent-primary-blue"
                                                    />

                                                    <div className="flex flex-col">
                                                        <span className={`text-600-14 ${service === "Produto + Instalçao" ? "text-primary-blue" : "text-gray-800 "}`}>
                                                            Produto + instalação
                                                        </span>

                                                        <span className="text-400-12 text-gray-500">
                                                            Fornecimento e instalação no local.
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                            <span className="flex flex-col gap-1.5 items-start justify-center w-full">
                                                <label className="text-400-14 text-graphite">
                                                    Mensagem (opcional)
                                                </label>

                                                <textarea
                                                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-400-14 text-graphite outline-none focus:border-primary-blue"
                                                    placeholder="Conte mais sobre o local, suas dúvidas e o que você precisa para o projeto."
                                                    rows={7}
                                                    value={message}
                                                    onChange={(e) => setField("message", e.target.value)}
                                                />
                                                {formErrors.message && (
                                                    <span className="text-400-12 text-red-500">
                                                        {formErrors.message}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="flex flex-col gap-2.5 w-full">
                                                <label className="text-400-14 text-graphite">
                                                    Fotos e plantas (opcional)
                                                </label>
                                                <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-gray bg-off-white px-4 py-7 text-center cursor-pointer transition-colors hover:border-cp-life-cyan">
                                                    <span className="text-600-14 text-primary-blue">
                                                        Anexar fotos ou plantas
                                                    </span>
                                                    <span className="text-400-12 text-neutral-gray">
                                                        Fotos da piscina e do piso, plantas ou projeto em PDF
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            addFiles(e.target.files);
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                </label>
                                                {attachments.length > 0 && (
                                                    <ul className="flex flex-col gap-2">
                                                        {attachments.map((file, index) => (
                                                            <li
                                                                key={`${file.name}-${index}`}
                                                                className="flex items-center justify-between gap-2 rounded-lg border border-border-gray px-3 py-2"
                                                            >
                                                                <span className="truncate text-400-14 text-graphite">
                                                                    {file.name}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(index)}
                                                                    className="shrink-0 rounded-full p-1 hover:bg-off-white"
                                                                >
                                                                    <X className="h-4 w-4 stroke-neutral-gray" />
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <p className="text-400-12 text-neutral-gray">
                                                    Os anexos ajudam nossa equipe a entender melhor as
                                                    condições do local.
                                                </p>
                                            </span>
                                            <div className="border-t border-border-gray pt-4">
                                                <label className="flex items-start gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        required
                                                        checked={consent}
                                                        onChange={(e) => setField("consent", e.target.checked)}
                                                        className="mt-0.5 h-4 w-4 shrink-0 accent-primary-blue"
                                                    />
                                                    <span className="text-400-14 text-graphite">
                                                        Autorizo o tratamento dos meus dados para análise do
                                                        projeto e contato pela CP LIFE, conforme a{" "}
                                                        <a href="#" className="text-primary-blue underline">
                                                            Política de Privacidade
                                                        </a>
                                                        . *
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={submitQuote}
                                        className="button-primary"
                                    >
                                        Enviar solicitação
                                    </button>
                                </div>
                            </div>
                        </section>
                    }
                    />
                )}
            </section>
            <ToastContainer position="top-right" autoClose={4000} />
        </>
    );
}
