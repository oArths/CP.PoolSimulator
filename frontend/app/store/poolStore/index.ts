import { create } from "zustand";
import { persist } from "zustand/middleware";
import poolDescription from "../../json/poolAvalible.json";

const poolItems: PoolAvailable[] = poolDescription;

interface PoolStoreInterface {
  format: PoolFormat | null;
  heigth: number | null;
  width: number | null;
  gap: number | null;
  measure: "Centimetros" | "Metros";
  surrounded: PoolSurrounded | null;
  gate: PoolGate | null;
  deck: PoolDeck | null;
  display: PoolDisplay | null;
  actualStep: "Formato" | "Medidas" | "Produto" | "Configuração" | "Estimativa";
  service: "Produto" | "Produto + Instalçao";
  fullName: string;
  whatsapp: string;
  email: string;
  cep: string;
  state: string;
  city: string;
  message: string;
  consent: boolean;

  setField: <K extends keyof PoolStoreInterface>(
    field: K,
    value: PoolStoreInterface[K],
  ) => void;
}

export const usePoolStore = create<PoolStoreInterface>()(
  persist(
    (set) => ({
      format: poolItems[0].formats[0],
      heigth: 8,
      width: 4,
      gap: 0.8,
      measure: "Metros",
      surrounded: poolItems[0].surrounded[0],
      gate: poolItems[0].gates[0],
      deck: poolItems[0].deck[0],
      display: poolItems[0].display[0],
      actualStep: "Formato",
      service: "Produto",
      fullName: "",
      whatsapp: "",
      email: "",
      cep: "",
      state: "",
      city: "",
      message: "",
      consent: false,

      setField: (field, value) => set({ [field]: value }),
    }),
    {
      name: "session",
      version: 1,
      migrate: () => ({}) as PoolStoreInterface,
    },
  ),
);
