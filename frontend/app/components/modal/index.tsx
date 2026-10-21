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
                className={` relative py-6  flex z-30  flex-col w-[90%] max-h-[95vh]  h-auto gap-8  bg-white rounded-2xl border overflow-y-auto border-border-gray shadow-md`}
                style={data.style}
            >
                <div className='flex flex-row items-center pb-6 border-b px-8  border-border-gray justify-between '>
                    <span className='flex flex-col gap-2'>
                        <h2 className='text-600-28 text-primary-blue'>Solicite seu orçamento</h2>
                        <h3 className='text-400-16 text-neutral-gray'>Confira seu projeto e envie os dados para um atendimento personalizado.</h3>
                    </span>

                    <button
                        onClick={data.onClose}
                        className="flex rounded-full w-10 h-10  p-2.5 items-center justify-center bg-off-white border border-border-gray cursor-pointer"
                    >
                        <XCircle width={18} height={18} stroke="2" className="stroke-neutral-gray " />

                    </button>
                </div>
                {data.Children}
            </div>
        </main>
    )
}