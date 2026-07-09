import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/userRepository";

const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || "Admin";
const DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || "admin@retaste.local";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "admin";

export const ensureDefaultAdmin = async (): Promise<void> => {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    return;
  }

  try {
    // Add timeout wrapper to prevent hanging
    const result = await Promise.race([
      findUserByEmail(DEFAULT_ADMIN_EMAIL),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: MySQL not responding")), 5000)
      ) as Promise<any>,
    ]);

    if (result) {
      console.log(`Default admin already exists: ${DEFAULT_ADMIN_EMAIL}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await Promise.race([
      createUser(
        DEFAULT_ADMIN_NAME,
        DEFAULT_ADMIN_EMAIL,
        hashedPassword,
        "admin",
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: MySQL not responding")), 5000)
      ),
    ]);
    console.log(`Default admin created: ${DEFAULT_ADMIN_EMAIL}`);
  } catch (error: any) {
    console.warn(`Could not ensure default admin: ${error.message}`);
  }
};
