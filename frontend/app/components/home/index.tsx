export default function Home() {
    return (
        <section className="bg-[url('/imgs/poolExampleBackGround.svg')] bg-cover bg-center bg-no-repeat h-fit w-full flex flex-row px-16 py-12 justify-between ">
            <div className="flex flex-col gap-5 items-start justify-center">
                <p className="px-3.5 py-2 text-graphite bg-aqua-light rounded-full w-fit h-fit text-center">Simulador de cerca • passo 1 de 5</p>
                <h1 className="text-display-xl font-extrabold text-off-white ">Escolha o formato da piscina</h1>
                <h3 className="text-body-lg text-off-white/85 ">Passo 1 de 5 — selecione o formato que mais se aproxima da sua piscina.</h3>
            </div>
            <div>
                <img src={"./imgs/poolExample.svg"}/>
            </div>

        </section>
    )
}