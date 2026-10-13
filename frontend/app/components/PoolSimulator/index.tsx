import Image from "next/image";
export default function PoolSimulator() {
    const active = "1";
    return (
        <section className="flex flex-col items-center justify-center w-11/12 h-fit ">
            <div className="flex flex-row gap-2.5 w-fit items-center">
                <div className="flex flex-row items-center gap-2 ">
                    <div
                        className={` h-7 w-7 rounded-full ${active === "1" ? "bg-primary-blue" : "border border-neutral-gray/30"}`}
                    ></div>
                    <h3 className="text-graphite text-body-sm">Formato</h3>
                </div>
                <div className="w-7 h-0.5 bg-neutral-gray/30" />
                <div className="flex flex-row items-center gap-2 ">
                    <div
                        className={` h-7 w-7 rounded-full ${active === "2" ? "bg-primary-blue" : "border border-neutral-gray/30"}`}
                    ></div>
                    <h3 className="text-graphite text-body-sm">Medidas</h3>
                </div>
                <div className="w-7 h-0.5 bg-neutral-gray/30" />
                <div className="flex flex-row items-center gap-2 ">
                    <div
                        className={` h-7 w-7 rounded-full ${active === "2" ? "bg-primary-blue" : "border border-neutral-gray/30"}`}
                    ></div>
                    <h3 className="text-graphite text-body-sm">Produto</h3>
                </div>
                <div className="w-7 h-0.5 bg-neutral-gray/30" />
                <div className="flex flex-row items-center gap-2 ">
                    <div
                        className={` h-7 w-7 rounded-full ${active === "2" ? "bg-primary-blue" : "border border-neutral-gray/30"}`}
                    ></div>
                    <h3 className="text-graphite text-body-sm">Configuração</h3>
                </div>
                <div className="w-7 h-0.5 bg-neutral-gray/30" />
                <div className="flex flex-row items-center gap-2 ">
                    <div
                        className={` h-7 w-7 rounded-full ${active === "2" ? "bg-primary-blue" : "border border-neutral-gray/30"}`}
                    ></div>
                    <h3 className="text-graphite text-body-sm">Estimativa</h3>
                </div>
            </div>
            <span className="flex flex-col gap-1.5">
                <h1 className="text-heading-md text-primary-blue">
                    Qual é o formato da sua piscina?
                </h1>
                <h2 className="text-body text-graphite">
                    Selecione o formato que melhor representa a sua piscina. Você poderá
                    ajustar as medidas no próximo passo.
                </h2>
            </span>
            <div className="flex flex-row gap-7   ">
                <div className="grid grid-cols-3 grid-rows-2">
                    <div className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer ${"s" === "s" ? "border-primary-blue bg-primary-blue/10" : "border-neutral-gray/30 "}`}>
                        <Image
                            src="/imgs/RectangleIcon.svg"
                            alt="Icone de piscian"
                            width={80}
                            height={100}
                        />
                        <h4 className="text-body-sm text-graphite">Retangular</h4>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer ${"s" === "s" ? "border-primary-blue bg-primary-blue/10" : "border-neutral-gray/30 "}`}>
                        <Image
                            src="/imgs/RectangleIcon.svg"
                            alt="Icone de piscian"
                            width={80}
                            height={100}
                        />
                        <h4 className="text-body-sm text-graphite">Retangular</h4>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer ${"s" === "s" ? "border-primary-blue bg-primary-blue/10" : "border-neutral-gray/30 "}`}>
                        <Image
                            src="/imgs/RectangleIcon.svg"
                            alt="Icone de piscian"
                            width={80}
                            height={100}
                        />
                        <h4 className="text-body-sm text-graphite">Retangular</h4>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer ${"s" === "s" ? "border-primary-blue bg-primary-blue/10" : "border-neutral-gray/30 "}`}>
                        <Image
                            src="/imgs/RectangleIcon.svg"
                            alt="Icone de piscian"
                            width={80}
                            height={100}
                        />
                        <h4 className="text-body-sm text-graphite">Retangular</h4>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer ${"s" === "s" ? "border-primary-blue bg-primary-blue/10" : "border-neutral-gray/30 "}`}>
                        <Image
                            src="/imgs/RectangleIcon.svg"
                            alt="Icone de piscian"
                            width={80}
                            height={100}
                        />
                        <h4 className="text-body-sm text-graphite">Retangular</h4>
                    </div>
                </div>
                <div></div>
            </div>
            <div>
                <button className="button-outline">Cancelar</button>
                <button className="button-primary">Próximo: Medidas</button>
            </div>
        </section>
    );
}
