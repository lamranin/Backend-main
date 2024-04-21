import z from "zod";

export const profileSchema = {
  profileUpdate: z.object({
    data: z.object({
      email: z.string().email(),
      name: z.string().optional(),
      contact: z.string().optional(),
      dateOfBirth: z.string().optional(),
      address: z.string().optional(),
      bio: z.string().optional(),
      profilePicture: z.string().optional()
    })
  })
};

export type ProfileUpdateBodyType = z.infer<
  typeof profileSchema.profileUpdate
>["data"];
