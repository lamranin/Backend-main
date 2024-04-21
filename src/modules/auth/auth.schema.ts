import { z } from "zod";

export const RegisterBody = z.object({
  data: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    contact: z.string(),
    dateOfBirth: z.string(),
    address: z.string().optional(),
    bio: z.string().optional()
  })
});

export const LoginBody = z.object({
  data: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export type RegisterBodyType = z.infer<typeof RegisterBody>["data"];
export type LoginBodyType = z.infer<typeof LoginBody>["data"];
