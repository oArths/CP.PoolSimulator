import Image from "next/image";
import PoolSimulator from "./components/PoolSimulator";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start h-auto">
      <Header />
      <main className="flex flex-col items-center w-full">
        <PoolSimulator />
      </main>
      <Footer/>
    </div>
  );
}
