"use client";
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
        <section className="bg-[url('/imgs/poolExampleBackGround.svg')] bg-cover bg-center bg-no-repeat h-fit w-full flex flex-row px-16 py-12 justify-between ">
            <div className="flex flex-col gap-5 items-start justify-center">
                <h1 className="text-800-40 font-extrabold text-off-white ">{title}</h1>
                <h3 className="text-400-18 text-off-white/85 ">
                    Passo {STEPS.indexOf(actualStep) + 1} de {STEPS.length} — {description}
                </h3>
            </div>
            <div className="lg:flex hidden">
                <img src={"./imgs/poolExample.svg"} />
            </div>

        </section>
    )
}
