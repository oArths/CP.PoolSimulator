'use client'
import type { ComponentType, SVGProps } from "react";
import Home from "../home";
import poolDescription from "../../json/poolAvalible.json"
import * as SvgComponents from "../svg";
import PoolOutline from "../svg/poolOutline";
import { usePoolStore } from "@/app/store/poolStore";

const poolFormatComponents: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = SvgComponents;

export default function PoolSimulator() {
    const active = "1";
    const poolItems: PoolAvailable[] = poolDescription
    const setField = usePoolStore((state) => state.setField);
    const format = usePoolStore((state) => state.format);
    const heigth = usePoolStore((state) => state.heigth);
    const width = usePoolStore((state) => state.width);
    const FormatIcon = format
        ? poolFormatComponents[format.component]
        : null;

    return (
        <>
            <Home />
            <section className="flex flex-col items-center justify-center w-11/12 h-fit gap-7 ">
                <div className="flex flex-row gap-2.5 w-fit items-center py-5">
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${active === "1" ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-body-sm">Formato</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${active === "2" ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-body-sm">Medidas</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${active === "2" ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-body-sm">Produto</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${active === "2" ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-body-sm">Configuração</h3>
                    </div>
                    <div className="w-7 h-0.5 bg-neutral-gray/30" />
                    <div className="flex flex-row items-center gap-2 cursor-pointer ">
                        <div
                            className={` h-7 w-7 rounded-full ${active === "2" ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        ></div>
                        <h3 className="text-graphite text-body-sm">Estimativa</h3>
                    </div>
                </div>
                <span className="flex flex-col gap-1.5 w-full">
                    <h1 className="text-heading-md text-primary-blue">
                        Qual é o formato da sua piscina?
                    </h1>
                    <h2 className="text-body text-graphite">
                        Selecione o formato que melhor representa a sua piscina. Você poderá
                        ajustar as medidas no próximo passo.
                    </h2>
                </span>
                <div className="flex flex-row gap-7 w-full  ">
                    <div className="w-1/2 flex flex-col gap-4">

                        <div className="grid grid-cols-3 grid-rows-2 gap-4 "    >
                            {poolItems && poolItems[0].formats.map((item, index) => {
                                const FormatIcon = poolFormatComponents[item.component]
                                return (
                                    <div onClick={() => (setField("format", (item)))} key={index} className={`flex flex-col items-center justify-center w-full h-fit rounded-2xl border-2 p-4 gap-3 cursor-pointer hover:border-cp-life-cyan hover:bg-cp-life-cyan/10 ${format?.name === item.name ? "border-cp-life-cyan bg-cp-life-cyan/10" : "border-border-gray "}`}>
                                        {FormatIcon ? <FormatIcon className="fill-transparent stroke-primary-blue" /> : null}                                        <h4 className="text-body-sm text-graphite">{item.name}</h4>
                                    </div>
                                )
                            })}

                        </div>
                        <p className="card-info w-full h-fit text-graphite text-body-sm">Não encontrou o formato exato? Escolha o mais próximo — você poderá detalhar melhor nas etapas seguintes.</p>
                    </div>

                    <div className="card flex flex-col w-1/2">
                        <h2 className="text-heading-md text-primary-blue">Pré Visualização</h2>
                        <div className="bg-aqua-light rounded-2xl px-7 py-16">
                            <div>
                                <PoolOutline className="text-transparent  ">
                                    {FormatIcon && (
                                        <FormatIcon className="w-9/12 h-full stroke-cp-life-cyan fill-cp-life-cyan  " />
                                    )}
                                    <p className="absolute text-graphite text-heading-sm">PISCINA {width} X {heigth} m</p>
                                </PoolOutline>

                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <button className="button-outline">Cancelar</button>
                    <button className="button-primary">Próximo: Medidas</button>
                </div>
            </section>
        </>

    );
}
