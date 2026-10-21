import { z } from "zod";

export const quoteSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo"),
  whatsapp: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }, "Informe um WhatsApp válido com DDD"),
  email: z.email("Informe um e-mail válido"),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido"),
  state: z.string().trim().regex(/^[A-Za-z]{2}$/, "Selecione o estado"),
  city: z.string().trim().min(2, "Informe a cidade"),
  message: z.string().trim().max(1000, "Mensagem muito longa").optional(),
  consent: z.boolean().refine((value) => value, "É necessário aceitar a política de privacidade"),
});

export type QuoteForm = z.infer<typeof quoteSchema>;
