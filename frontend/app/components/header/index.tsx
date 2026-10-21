import logo from "../../../public/imgs/logo.svg";

export default function Header() {
  return (
    <header className=" w-full px-14 py-1 flex flex-row items-center justify-between h-20">
      <img src={"./imgs/logo.svg"} alt="CP Life" className="g-full w-fit select-none " />
      <span className="flex flex-row gap-5 w-fit items-center justify-center ">
        <div className="flex-row gap-5 items-center justify-center lg:flex hidden ">

          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            {" "}
            Produtos
          </p>
          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            Soluções
          </p>
          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            A CP Life
          </p>
          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            Projetos
          </p>
          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            Blog
          </p>
          <p
            className="text-400-14 text-graphite
  hover:text-primary-blue hover:underline
  cursor-pointer select-none
  transition-colors duration-300 ease-in-out"
          >
            Contato
          </p>
        </div>

        <button className="bg-cp-life-cyan rounded-xl px-4 py-3 gap-2 w-fit text-400-12 md:text-600-14 cursor-pointer text-off-white ">
          Simule seu projeto
        </button>
      </span>
    </header>
  );
}
