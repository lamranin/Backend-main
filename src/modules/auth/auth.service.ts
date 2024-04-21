import { hash, verify } from "argon2";
import { databaseClient } from "database";
// Adjust this import to your actual database client path
import { RegisterBodyType } from "./auth.schema";

export const authService = {
  findUserById: async (id: string) => {
    const user = await databaseClient.user.findUnique({
      where: {
        id
      }
    });
    return user;
  },

  findUserByEmail: async (email: string) => {
    const user = await databaseClient.user.findUnique({
      where: {
        email
      }
    });
    return user;
  },

  login: async (email: string, password: string) => {
    const user = await authService.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const validPassword = await verify(user.password, password);
    if (!validPassword) throw new Error("Invalid password");

    // Exclude password from the result
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  signUp: async (data: RegisterBodyType) => {
    const {
      username,
      email,
      password,
      name,
      contact,
      dateOfBirth,
      address,
      bio
    } = data;

    const hashedPassword = await hash(password);

    const newUser = await databaseClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        person: {
          create: {
            name,
            contactNumber: contact,
            dateOfBirth: new Date(dateOfBirth).toISOString(),
            address,
            bio
          }
        }
      },
      include: {
        person: true
      }
    });

    // Exclude password from the result
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  hashPassword: async (password: string) => {
    return await hash(password);
  },

  verifyPassword: async (
    databasePassword: string,
    candidatePassword: string
  ) => {
    return await verify(databasePassword, candidatePassword);
  }
};
