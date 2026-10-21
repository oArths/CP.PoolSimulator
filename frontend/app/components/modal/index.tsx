import { XCircle } from 'lucide-react'

interface ModalProps {
    Children: React.JSX.Element
    onClose: () => void
    style?: React.CSSProperties
}

export default function Modal(data: ModalProps): React.JSX.Element {
    return (
        <main className=" fixed inset-0 z-20 flex items-center justify-center w-full h-full bg-graphite/15 backdrop-blur-[10px]">
            <div
                className={` relative p-14 flex z-30  flex-col max-w-[90%] max-h-[95vh]  h-auto gap-12 bg-white rounded-md border border-border-gray shadow-md`}
                style={data.style}
            >
                <div className='flex flex-row'>
                    <span>
                        <h2>Solicite seu orçamento</h2>
                        <h3>Confira seu projeto e envie os dados para um atendimento personalizado.</h3>
                    </span>

                    <button
                        onClick={data.onClose}
                        className="flex rounded-full w-10 h-10  p-2.5 items-center justify-center bg-off-white border border-border-gray absolute right-4 top-4 cursor-pointer"
                    >
                        <XCircle width={18} height={18} stroke="2" className="stroke-neutral-gray " />

                    </button>
                </div>
                {data.Children}
            </div>
        </main>
    )
}