"use client";
import Image from "next/image";
import { usePoolStore } from "@/app/store/poolStore";
import { STEPS } from "../PoolSimulator/steps";

const COPY: Record<(typeof STEPS)[number], [string, string]> = {
    Formato: [
        "Escolha o formato da piscina",
        "selecione o formato que mais se aproxima da sua piscina.",
    ],
    Medidas: [
        "Ajuste as medidas da sua piscina",
        "informe comprimento, largura e a distância até a cerca.",
    ],
    Produto: [
        "Escolha seu produto",
        "selecione o material da cerca e o tipo de portão.",
    ],
    Configuração: [
        "Configure seu projeto",
        "escolha o piso ao redor da piscina e a cor da tela.",
    ],
};

export default function Home() {
    const actualStep = usePoolStore((state) => state.actualStep);
    // actualStep comes back from localStorage, so it can hold a stale value
    const [title, description] = COPY[actualStep] ?? COPY.Formato;

    return (
        <section className="relative h-fit w-full flex flex-row px-16 py-12 justify-between ">
            <Image
                src="/imgs/poolExampleBackGround.svg"
                alt=""
                fill
                preload
                fetchPriority="high"
                sizes="100vw"
                className="object-cover object-center"
            />
            <div className="relative flex flex-col gap-5 items-start justify-center">
                <h1 className="text-800-40 font-extrabold text-off-white ">{title}</h1>
                <p className="text-400-18 text-off-white/85 ">
                    Passo {STEPS.indexOf(actualStep) + 1} de {STEPS.length} — {description}
                </p>
            </div>
            <div className="relative lg:flex hidden">
                <Image
                    src="/imgs/poolExample.jpg"
                    alt=""
                    width={1584}
                    height={672}
                    sizes="475px"
                    className="w-[475px] max-w-full h-auto rounded-2xl"
                />
            </div>

        </section>
    )
}
