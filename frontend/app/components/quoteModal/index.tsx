"use client";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import * as SvgComponents from "../svg";
import PoolOutline from "../svg/poolOutline";
import Dropdown from "../dropdown";
import Modal from "../modal";
import { Field, SectionTitle, SummaryRow } from "../ui";
import { usePoolStore } from "@/app/store/poolStore";
import { quoteSchema } from "@/app/store/poolStore/quoteSchema";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const poolFormatComponents: Record<
    string,
    ComponentType<SVGProps<SVGSVGElement>>
> = SvgComponents;

const UFS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO",
];

// máscaras apenas visuais: o store continua guardando só os dígitos
function maskWhatsapp(digits: string) {
    if (!digits) return "";
    if (digits.length <= 2) return `(${digits}`;
    const ddd = `(${digits.slice(0, 2)}) `;
    const number = digits.slice(2);
    if (!number) return ddd.trimEnd();
    const split = number.length > 8 ? 5 : 4;
    if (number.length <= split) return ddd + number;
    return `${ddd}${number.slice(0, split)}-${number.slice(split)}`;
}

function maskCep(digits: string) {
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export default function QuoteModal({ onClose }: { onClose: () => void }) {
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
    const service = usePoolStore((state) => state.service);
    const fullName = usePoolStore((state) => state.fullName);
    const whatsapp = usePoolStore((state) => state.whatsapp);
    const email = usePoolStore((state) => state.email);
    const cep = usePoolStore((state) => state.cep);
    const state = usePoolStore((state) => state.state);
    const city = usePoolStore((state) => state.city);
    const message = usePoolStore((state) => state.message);
    const consent = usePoolStore((state) => state.consent);

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [attachments, setAttachments] = useState<File[]>([]);

    const decimals = measure === "Metros" ? 2 : 0;
    const unit = measure === "Metros" ? "m" : "cm";
    const fmt = (value: number) => value.toFixed(decimals);
    const w = Number(width ?? 0) || 0;
    const h = Number(heigth ?? 0) || 0;
    const g = Number(gap ?? 0) || 0;
    const area = w * h;
    const fence = 2 * (w + 2 * g) + 2 * (h + 2 * g);
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

    return (
        <Modal
            onClose={onClose}
            Children={
                <section className="h-fit px-4 md:px-8 gap-5 grid grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col gap-5 col-span-2 lg:col-span-1">
                        <div className="card flex flex-col w-full">
                            <SectionTitle
                                title="Resumo da configuração"
                                description="Confira todos os detalhes escolhidos para sua cerca."
                            />
                            <div className="bg-aqua-light rounded-2xl px-7 py-10 my-auto">
                                <div className="flex flex-col items-center">
                                    <PoolOutline
                                        texture={deck ? `./imgs/${deck.texture}` : undefined}
                                        outlineColor={display?.color}
                                    >
                                        {FormatIcon && (
                                            <FormatIcon className="w-9/12 h-full stroke-cp-life-cyan fill-cp-life-cyan  " />
                                        )}
                                        <p className="absolute text-graphite text-600-12 md:text-600-14 bottom-2 md:bottom-5 lg:bottom-8">
                                            PISCINA {fmt(w)} X {fmt(h)} {unit}
                                        </p>
                                    </PoolOutline>
                                    {gate && (
                                        <p className="text-primary-blue text-400-14 relative top-3">
                                            {gate.type}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <SummaryRow label="Formato da piscina" value={format?.name} />
                                <SummaryRow label="Produto" value={surrounded?.type} />
                                <SummaryRow label="Portão" value={gate?.type} />
                                <SummaryRow
                                    label="Deck/piso"
                                    value={
                                        <span className="flex flex-row gap-1 items-center justify-center">
                                            <img
                                                className="w-3 h-3 rounded-sm"
                                                src={`./imgs/${deck?.imagePath}`}
                                                alt=""
                                                width={80}
                                                height={46}
                                            />
                                            <p className="text-400-14 text-graphite">{deck?.name}</p>
                                        </span>
                                    }
                                />
                                <SummaryRow
                                    label="Cor da tela"
                                    value={
                                        <span className="flex flex-row gap-1 items-center justify-center">
                                            <img
                                                className="w-3 h-3 rounded-sm"
                                                src={`./imgs/${display?.imagePath}`}
                                                alt=""
                                                width={80}
                                                height={46}
                                            />
                                            <p className="text-400-14 text-graphite">
                                                {display?.name}
                                            </p>
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className="card flex flex-col w-full">
                            <SectionTitle title="Resumo das medidas" />
                            <div className="flex flex-col gap-4">
                                <SummaryRow
                                    label="Dimensões da piscina"
                                    value={`${fmt(w)} X ${fmt(h)} ${unit}`}
                                />
                                <SummaryRow label="Distância da piscina até a cerca" value={gap} />
                                <SummaryRow
                                    label="Área da piscina"
                                    value={`${fmt(area)} ${unit}²`}
                                />
                                <SummaryRow
                                    label="Perímetro da cerca"
                                    value={`${fmt(fence)} ${unit}`}
                                    highlight
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card flex flex-col w-full col-span-2">
                        <SectionTitle
                            title="Vamos conversar sobre seu projeto?"
                            description="Preencha seus dados para que nossa equipe analise a configuração e entre em contato com você."
                        />
                        <fieldset className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 w-full">
                                <h3 className="text-600-16 text-primary-blue">Seus dados</h3>
                                <div className="flex flex-col gap-4 w-full">
                                    <Field label="Nome completo *" error={formErrors.fullName}>
                                        <input
                                            className="input"
                                            placeholder="Como podemos chamar você?"
                                            value={fullName}
                                            onChange={(e) => setField("fullName", e.target.value)}
                                        />
                                    </Field>
                                    <div className="flex flex-col  md:flex-row w-full gap-4">
                                        <Field label="WhatsApp *" error={formErrors.whatsapp}>
                                            <input
                                                className="input"
                                                placeholder="(00) 00000-0000"
                                                inputMode="numeric"
                                                value={maskWhatsapp(whatsapp)}
                                                onChange={(e) =>
                                                    setField(
                                                        "whatsapp",
                                                        e.target.value.replace(/\D/g, "").slice(0, 11),
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field label="E-mail *" error={formErrors.email}>
                                            <input
                                                className="input"
                                                placeholder="voce@exemplo.com.br"
                                                value={email}
                                                onChange={(e) => setField("email", e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <h3 className="text-600-16 text-primary-blue">
                                    Onde será seu projeto?
                                </h3>
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex flex-col  md:flex-row w-full gap-4">
                                        <Field label="CEP *" error={formErrors.cep}>
                                            <input
                                                className="input"
                                                placeholder="00000-000"
                                                inputMode="numeric"
                                                value={maskCep(cep)}
                                                onChange={(e) => lookupCep(e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Estado *" error={formErrors.state}>
                                            <Dropdown
                                                options={UFS}
                                                value={state}
                                                onChange={(value) => setField("state", value)}
                                                placeholder="Selecione o estado"
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Cidade *" error={formErrors.city}>
                                        <input
                                            className="input"
                                            placeholder="Informe a cidade do projeto"
                                            value={city}
                                            onChange={(e) => setField("city", e.target.value)}
                                        />
                                    </Field>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${service === "Produto" ? "border-cp-life-cyan bg-cp-life-cyan/10 " : "border-border-gray"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="tipo"
                                                value="produto"
                                                className="mt-0.5 h-4 w-4 accent-primary-blue"
                                                checked={service === "Produto"}
                                                onChange={() => setField("service", "Produto")}
                                            />
                                            <div className="flex flex-col">
                                                <span
                                                    className={`text-600-14 ${service === "Produto" ? "text-primary-blue" : "text-gray-800 "}`}
                                                >
                                                    Produto
                                                </span>
                                                <span className="text-400-12 text-gray-500">
                                                    Somente o fornecimento da cerca.
                                                </span>
                                            </div>
                                        </label>
                                        <label
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${service === "Produto + Instalçao" ? "border-cp-life-cyan bg-cp-life-cyan/10 " : "border-border-gray"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="tipo"
                                                value="produto-instalacao"
                                                checked={service === "Produto + Instalçao"}
                                                onChange={() =>
                                                    setField("service", "Produto + Instalçao")
                                                }
                                                className="mt-0.5 h-4 w-4 accent-primary-blue"
                                            />
                                            <div className="flex flex-col">
                                                <span
                                                    className={`text-600-14 ${service === "Produto + Instalçao" ? "text-primary-blue" : "text-gray-800 "}`}
                                                >
                                                    Produto + instalação
                                                </span>
                                                <span className="text-400-12 text-gray-500">
                                                    Fornecimento e instalação no local.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                    <Field label="Mensagem (opcional)" error={formErrors.message}>
                                        <textarea
                                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-400-14 text-graphite outline-none focus:border-primary-blue"
                                            placeholder="Conte mais sobre o local, suas dúvidas e o que você precisa para o projeto."
                                            rows={7}
                                            value={message}
                                            onChange={(e) => setField("message", e.target.value)}
                                        />
                                    </Field>
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
                                                        <span className=" min-w-0 flex-1 truncate text-400-14 text-graphite">
                                                            {(() => {
                                                                const dotIndex = file.name.lastIndexOf(".");
                                                                const name = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
                                                                const extension = dotIndex > 0 ? file.name.slice(dotIndex) : "";

                                                                return name.length > 20
                                                                    ? `${name.slice(0, 20)}...${extension}`
                                                                    : file.name;
                                                            })()}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            aria-label="Remover arquivo"
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
                                                onChange={(e) =>
                                                    setField("consent", e.target.checked)
                                                }
                                                className="mt-0.5 h-4 w-4 shrink-0 accent-primary-blue"
                                            />
                                            <span className="text-400-14 text-graphite">
                                                Autorizo o tratamento dos meus dados para análise do
                                                projeto e contato pela CP LIFE, conforme a{" "}
                                                <a
                                                    href="#"
                                                    className="text-primary-blue underline"
                                                >
                                                    Política de Privacidade
                                                </a>
                                                . *
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="flex flex-col-reverse gap-5 mt-10 sm:flex-row items-center sm:mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="button-outline w-full sm:w-fit"
                            >
                                Voltar à Configuração
                            </button>
                            <button
                                type="button"
                                onClick={submitQuote}
                                className="button-primary w-full sm:w-fit"
                            >
                                Enviar solicitação
                            </button>
                        </div>
                    </div>
                </section>
            }
        />
    );
}
