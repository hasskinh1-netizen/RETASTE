import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, updateUser } from "../repositories/userRepository";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "retaste_secret";
const JWT_EXPIRES_IN = "7d";
const ADMIN_SIGNUP_SECRET = process.env.ADMIN_SIGNUP_SECRET || "admin_secret";
const STAFF_SIGNUP_SECRET = process.env.STAFF_SIGNUP_SECRET || "staff_secret";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin" | "staff";
  accessCode?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await createUser(
    payload.name,
    normalizedEmail,
    hashedPassword,
    "customer",
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const registerAdminUser = async (payload: RegisterPayload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  if (payload.accessCode !== ADMIN_SIGNUP_SECRET) {
    throw new Error("Invalid admin access code");
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await createUser(
    payload.name,
    normalizedEmail,
    hashedPassword,
    "admin",
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const registerStaffUser = async (payload: RegisterPayload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  if (payload.accessCode !== STAFF_SIGNUP_SECRET) {
    throw new Error("Invalid staff access code");
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await createUser(
    payload.name,
    normalizedEmail,
    hashedPassword,
    "staff",
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (payload: LoginPayload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  console.log(`[AUTH] Attempting login for: ${normalizedEmail}`);
  
  const user = await findUserByEmail(normalizedEmail);
  console.log(`[AUTH] User fetch result:`, user ? `ID=${(user as any).id}` : 'NOT FOUND');

  if (!user || !user.password) {
    console.log(`[AUTH] User validation failed - user: ${user ? 'found' : 'not found'}, password:  ${user && (user as any).password ? 'exists' : 'missing'}`);
    throw new Error("Incorrect email or password");
  }

  console.log(`[AUTH] Starting password comparison`);
  const passwordMatches = await bcrypt.compare(payload.password, user.password);
  console.log(`[AUTH] Password match result: ${passwordMatches}`);
  
  if (!passwordMatches) {
    throw new Error("Incorrect email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return {
    token,
    user: {
      id: user.id,
      name: (user as any).name,
      email: user.email,
      phone: (user as any).phone,
      role: user.role,
    },
  };
};

export const generateAuthToken = (user: {
  id: number;
  email: string;
  role: "customer" | "admin" | "staff";
}) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

export const updateUserProfile = async (
  userId: number,
  payload: { name?: string; email?: string; phone?: string },
) => {
  if (payload.email) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email already in use");
    }
  }

  const updatedData: any = {};
  if (payload.name) updatedData.name = payload.name;
  if (payload.email) updatedData.email = payload.email.trim().toLowerCase();
  if (payload.phone) updatedData.phone = payload.phone;

  const user = await updateUser(userId, updatedData);
  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: (user as any).name,
    email: user.email,
    phone: (user as any).phone,
    role: user.role,
  };
};
