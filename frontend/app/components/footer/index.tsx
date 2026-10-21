import FacebookLogo from "../svg/facebookLogo";
import InstagramLogo from "../svg/instagramLogo";
import YoutubeLogo from "../svg/youtubeLogo";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-5 bg-primary-blue px-14 w-full">
            <div className="flex flex-col md:flex-row justify-between w-full items-center md:items-start py-16 gap-6">
                <span className="flex flex-col gap-4 items-start lg:items-start justify-center">

                    <h2 className="text-600-28 font-bold text-off-white">CP LIFE</h2>
                    <p className="text-400-12 md:text-600-14  text-off-white">Proteção e elegância para piscinas,<br /> pets e ambientes de lazer desde 2007.</p>
                    <div className="flex flex-row gap-3 justify-between md:justify-start w-full">
                        <button className="rounded-lg p-2.5 bg-off-white/7">
                            <FacebookLogo className="w-5 h-5 text-off-white" />
                        </button>
                        <button className="rounded-lg p-2.5 bg-off-white/7">
                            <InstagramLogo className="w-5 h-5 text-off-white" />
                        </button>
                        <button className="rounded-lg p-2.5 bg-off-white/7">
                            <YoutubeLogo className="w-5 h-5 text-off-white" />
                        </button>
                    </div>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 w-full md:w-fit md:grid-cols-3 gap-7 md:gap-4 items-center  md:items-start justify-center">

                    <span className="flex flex-col items-center md:items-start gap-3.5 w-full md:w-40">
                        <h3 className="text-400-12 md:text-600-14  cursor-pointer text-off-white">Navegação</h3>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">Produtos</p>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">Soluções</p>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">Projetos</p>

                    </span>
                    <span className="flex flex-col items-center md:items-start gap-3.5 w-full md:w-40">
                        <h3 className="text-400-12 md:text-600-14  cursor-pointer text-off-white">Contato</h3>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">WhatsApp</p>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">Telefone</p>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">E-mail</p>

                    </span>
                    <span className="flex flex-col  items-center md:items-start gap-3.5 w-full sm:w-40">

                        <h3 className="text-400-12 md:text-600-14 cursor-pointer text-off-white">Institucional</h3>
                        <p className="text-400-12 md:text-600-14  cursor-pointer text-off-white/70">A CP Life</p>
                        <p className="text-400-12 md:text-600-14 cursor-pointer text-off-white/70">Blog</p>

                    </span>

                </div>
            </div>
            <div className="flex flex-col gap-5 md:flex-row justify-between items-center border-t border-off-white/14 py-5">
                <span className="text-off-white text-400-12 md:text-600-14 ">© 2024 CP Life. Todos os direitos reservados.</span>
                <span className="text-off-white text-400-12 md:text-600-14 " >Política de Privacidade • Termos de Uso</span>
            </div>


        </footer>
    )
}