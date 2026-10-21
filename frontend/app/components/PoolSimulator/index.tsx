"use client";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import Home from "../home";
import poolDescription from "../../json/poolAvalible.json";
import * as SvgComponents from "../svg";
import PoolOutline from "../svg/poolOutline";
import MeasureInput from "./MeasureInput";
import StepIndicator from "./StepIndicator";
import StepNav from "./StepNav";
import { STEPS } from "./steps";
import { SectionTitle, SelectableCard } from "../ui";
import { usePoolStore } from "@/app/store/poolStore";
import QuoteModal from "../quoteModal";

const poolFormatComponents: Record<
    string,
    ComponentType<SVGProps<SVGSVGElement>>
> = SvgComponents;

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
    const [configStep, setConfigStep] = useState<"deck" | "display">("deck");
    const [productStep, setProductStep] = useState<"produto" | "portao">(
        "produto",
    );
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    const showDeckColors = stepIndex >= STEPS.indexOf("Configuração");
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

    const goBack = () => {
        if (actualStep === "Configuração" && configStep === "display") {
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
    };

    const goNext = () => {
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
    };

    const backLabel =
        actualStep === "Configuração" && configStep === "display"
            ? "Tipo de deck/piso"
            : actualStep === "Produto" && productStep === "portao"
                ? "Produto"
                : STEPS[stepIndex - 1];

    const nextLabel =
        actualStep === "Configuração" && configStep === "deck"
            ? "Cor da tela"
            : actualStep === "Configuração" && configStep === "display"
                ? "Solicitar orçamento"
                : actualStep === "Produto" && productStep === "produto"
                    ? "Tipo de portão"
                    : STEPS[stepIndex + 1];

    return (
        <>
            <Home />
            <section className="flex flex-col items-center justify-center w-11/12 h-fit gap-7 mb-20">
                <StepIndicator currentIndex={stepIndex} />

                <div className="flex flex-col-reverse lg:grid  lg:grid-cols-2 gap-7 flex-1 w-full h-fit">
                    <div className="card flex flex-col gap-4 w-full h-full order-1">
                        {actualStep === "Formato" && (
                            <>
                                <SectionTitle
                                    title="Qual é o formato da sua piscina?"
                                    description="Selecione o formato que melhor representa a sua piscina. Você poderá ajustar as medidas no próximo passo."
                                />
                                <div className="grid grid-cols-3 grid-rows-2 gap-4">
                                    {poolItems[0].formats.map((item) => {
                                        const Icon = poolFormatComponents[item.component];
                                        return (
                                            <SelectableCard
                                                key={item.name}
                                                selected={format?.name === item.name}
                                                onClick={() => setField("format", item)}
                                                className="flex flex-col items-center justify-center gap-3 "
                                            >
                                                {Icon ? (
                                                    <Icon className="fill-transparent stroke-primary-blue w-[90%]" />
                                                ) : null}
                                                <p className="text-400-14 text-graphite">
                                                    {item.name}
                                                </p>
                                            </SelectableCard>
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
                                <SectionTitle
                                    title={`Piscina ${format?.name}`}
                                    description="Ajuste as medidas. A planta ao lado é atualizada automaticamente."
                                />
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
                                <SectionTitle
                                    title="Escolha seu produto"
                                    description={
                                        productStep === "produto"
                                            ? "Selecione o material da cerca."
                                            : "Escolha o tipo de portão que deseja incluir."
                                    }
                                />
                                <fieldset
                                    className={
                                        productStep === "produto"
                                            ? "flex flex-col gap-4"
                                            : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
                                        Produto
                                    </label>
                                    {poolItems[0].surrounded.map((item) => (
                                        <SelectableCard
                                            key={item.type}
                                            selected={item.type === surrounded?.type}
                                            onClick={() => setField("surrounded", item)}
                                            className="flex flex-col items-start gap-2.5 justify-center"
                                        >
                                            <p className="text-600-22 text-primary-blue">
                                                {item.type}
                                            </p>
                                            <p className="text-400-16 text-neutral-gray">
                                                {item.description}
                                            </p>
                                        </SelectableCard>
                                    ))}
                                </fieldset>
                                <fieldset
                                    className={
                                        productStep === "portao"
                                            ? "flex flex-col gap-4"
                                            : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
                                        Tipo de portão
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {poolItems[0].gates.map((item) => {
                                            const Icon = poolFormatComponents[item.component];
                                            return (
                                                <SelectableCard
                                                    key={item.type}
                                                    selected={item.type === gate?.type}
                                                    onClick={() => setField("gate", item)}
                                                    className="flex flex-col items-center gap-2.5 justify-center "
                                                >
                                                    <p className="text-400-16 text-neutral-gray">
                                                        {Icon ? (
                                                            <Icon className="fill-transparent stroke-primary-blue" />
                                                        ) : null}
                                                    </p>
                                                    <p className="text-400-14 text-primary-blue font-semibold text-center">
                                                        {item.type}
                                                    </p>
                                                </SelectableCard>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            </>
                        )}

                        {actualStep === "Configuração" && (
                            <>
                                <SectionTitle
                                    title="Configure seu projeto"
                                    description={
                                        configStep === "deck"
                                            ? "Escolha o piso ao redor da piscina."
                                            : "Escolha a cor da malha da cerca."
                                    }
                                />
                                <fieldset
                                    className={
                                        configStep === "deck"
                                            ? "flex flex-col gap-6"
                                            : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
                                        Tipo de deck/piso
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {poolItems[0].deck.map((item) => (
                                            <SelectableCard
                                                key={item.name}
                                                selected={item.name === deck?.name}
                                                onClick={() => setField("deck", item)}
                                                className="flex flex-col items-center gap-2.5 justify-center"
                                            >
                                                <figure className="w-20 h-fit">
                                                    <img src={`./imgs/${item.imagePath}`} alt="" width={80} height={46} className="w-full h-auto" />
                                                </figure>
                                                <p className="text-400-16 text-neutral-gray">
                                                    {item.name}
                                                </p>
                                            </SelectableCard>
                                        ))}
                                    </div>
                                </fieldset>
                                <fieldset
                                    className={
                                        configStep === "display"
                                            ? "flex flex-col gap-4"
                                            : "hidden"
                                    }
                                >
                                    <label className="text-600-14 font-medium text-graphite">
                                        Cor da tela
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {poolItems[0].display.map((item) => (
                                            <SelectableCard
                                                key={item.name}
                                                selected={item.name === display?.name}
                                                onClick={() => setField("display", item)}
                                                className="flex flex-col items-center gap-2.5 justify-center"
                                            >
                                                <figure className="w-20 h-fit">
                                                    <img src={`./imgs/${item.imagePath}`} alt="" width={80} height={46} className="w-full h-auto" />
                                                </figure>
                                                <p className="text-400-16 text-neutral-gray">
                                                    {item.name}
                                                </p>
                                            </SelectableCard>
                                        ))}
                                    </div>
                                </fieldset>
                            </>
                        )}

                        <StepNav
                            onBack={goBack}
                            onNext={goNext}
                            backLabel={backLabel}
                            nextLabel={nextLabel}
                            showBack={actualStep !== "Formato"}
                        />
                    </div>

                    <div className="card flex flex-col w-full h-full order-2">
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
                                    <p className="absolute text-graphite text-600-12 md:text-600-14 bottom-2 md:bottom-5 lg:bottom-8">
                                        PISCINA {fmt(w)} X {fmt(h)} {unit}
                                    </p>
                                </PoolOutline>
                                {actualStep !== "Formato" &&
                                    actualStep !== "Medidas" &&
                                    actualStep !== "Produto" && (
                                        <p className="text-primary-blue  relative top-3 text-400-12 md:text-400-14">
                                            {gate?.type} 
                                        </p>
                                    )}
                            </div>
                        </div>
                        {actualStep === "Medidas" && (
                            <div className="flex flex-row gap-2">
                                <p className="tag bg-aqua-light border-cp-life-cyan text-primary-blue text-400-12 md:text-400-14">
                                    Área • {fmt(area)} {unit}²
                                </p>
                                <p className="tag bg-aqua-light border-cp-life-cyan text-primary-blue text-400-12 md:text-400-14">
                                    Cerca • {fmt(fence)} {unit}
                                </p>
                                <p className="tag bg-aqua-light border-cp-life-cyan text-primary-blue text-400-12 md:text-400-14">
                                    Distância • {fmt(g)} {unit}
                                </p>
                            </div>
                        )}
                        {actualStep === "Produto" && (
                            <div className="flex flex-row gap-2">
                                <p className="tag bg-aqua-light border-cp-life-cyan text-primary-blue text-400-12 md:text-400-14 ">
                                    {surrounded?.type}
                                </p>
                                <p className="tag bg-aqua-light border-cp-life-cyan text-primary-blue text-400-12 md:text-400-14">
                                    {gate?.type}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {isQuoteOpen && <QuoteModal onClose={() => setIsQuoteOpen(false)} />}
            </section>
        </>
    );
}
