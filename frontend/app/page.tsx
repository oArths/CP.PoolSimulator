import Image from "next/image";
import PoolSimulator from "./components/PoolSimulator";
import Header from "./components/header";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start">
      <Header />
      <PoolSimulator />
    </div>
  );
}
