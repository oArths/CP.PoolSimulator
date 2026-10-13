import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PoolStoreInterface {
  format: string;
  heigth: number;
  width: number;
  gap: number;
  measure: "Centimetros" | "Metros";
  surrounded: string;
  gate: string;
  deck: string;
  display  : string;
}

interface UserData{
    fullName: string,
    whatszap: number,
    email: string,
    cep: number,
    state: string,
    city: string,
    images: [] 
}



