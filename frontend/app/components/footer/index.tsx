import FacebookLogo from "../svg/facebookLogo";
import InstagramLogo from "../svg/instagramLogo";
import YoutubeLogo from "../svg/youtubeLogo";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-5 bg-primary-blue px-14 w-full">
            <div className="flex flex-row justify-between w-full py-11">
                <span className="flex flex-col gap-4 items-start justify-center">

                    <h2 className="text-heading-md font-bold text-off-white">CP LIFE</h2>
                    <p className="text-body-sm text-off-white">Proteção e elegância para piscinas,<br /> pets e ambientes de lazer desde 2007.</p>
                    <div>
                        <button className="rounded-lg p-2.5 bg-off-white/14">
                            <FacebookLogo className="w-10 h-10 text-off-white" />
                        </button>
                        <button>
                            <InstagramLogo className="w-10 h-10 text-off-white" />
                        </button>
                        <button>
                            <YoutubeLogo className="w-10 h-10 text-off-white" />
                        </button>
                    </div>
                </span>
                <span className="flex flex-col gap-3.5 w-40">
                    <h3 className="text-body cursor-pointer text-off-white">Navegação</h3>
                    <p className="text-body cursor-pointer text-off-white/70">Produtos</p>
                    <p className="text-body cursor-pointer text-off-white/70">Soluções</p>
                    <p className="text-body cursor-pointer text-off-white/70">Projetos</p>

                </span>
                <span className="flex flex-col gap-3.5 w-40">
                    <h3 className="text-body cursor-pointer text-off-white">Institucional</h3>
                    <p className="text-body cursor-pointer text-off-white/70">A CP Life</p>
                    <p className="text-body cursor-pointer text-off-white/70">Blog</p>

                </span>
                <span className="flex flex-col gap-3.5 w-40">
                    <h3 className="text-body cursor-pointer text-off-white">Contato</h3>
                    <p className="text-body cursor-pointer text-off-white/70">WhatsApp</p>
                    <p className="text-body cursor-pointer text-off-white/70">Telefone</p>
                    <p className="text-body cursor-pointer text-off-white/70">E-mail</p>

                </span>
            </div>
            <div className="flex flex-row justify-between items-center border-t border-off-white/14 py-5">
                <span className="text-off-white text-body-sm">© 2024 CP Life. Todos os direitos reservados.</span>
                <span className="text-off-white text-body-sm" >Política de Privacidade • Termos de Uso</span>
            </div>


        </footer>
    )
}