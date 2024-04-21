import { databaseClient } from "database";
import { ProfileUpdateBodyType } from "./profile.schema";
export const profileService = {
  getProfile: async (id: string) => {
    const profile = await databaseClient.user.findUnique({
      where: {
        id
      },
      select: {
        email: true,
        username: true,
        ownRecipes: true,
        savedRecipes: true,
        id: true,
        person: {
          select: {
            name: true,
            contactNumber: true,
            dateOfBirth: true,
            address: true,
            bio: true,
            profilePicture: true
          }
        }
      }
    });
    return profile;
  },
  updateProfile: async (id: string, data: ProfileUpdateBodyType) => {
    const updatedProfile = await databaseClient.user.update({
      where: { id },
      data: {
        person: {
          update: {
            name: data.name,
            contactNumber: data.contact,
            dateOfBirth: data.dateOfBirth
              ? new Date(data.dateOfBirth).toISOString()
              : undefined,
            address: data.address,
            bio: data.bio,
            profilePicture: data.profilePicture
          }
        }
      },
      select: {
        email: true,
        person: {
          select: {
            name: true,
            contactNumber: true,
            dateOfBirth: true,
            address: true,
            bio: true,
            profilePicture: true // Ensure to return the profile picture URL
          }
        }
      }
    });
    return updatedProfile;
  }
};
