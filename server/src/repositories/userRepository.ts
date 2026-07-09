import { RowDataPacket, ResultSetHeader } from "mysql2";
import mysqlPool from "../database/mysql";

export interface DbUser extends RowDataPacket {
  id: number;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  password_hash?: string;
  role: "customer" | "admin" | "staff";
}

export const findUserByEmail = async (
  email: string,
): Promise<DbUser | null> => {
  const [rows] = await mysqlPool.execute<DbUser[]>(
    "SELECT id, email, password_hash as password, full_name as name, role FROM users WHERE email = ?",
    [email],
  );
  return rows.length ? rows[0] : null;
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: "customer" | "admin" | "staff",
) => {
  const [result] = await mysqlPool.execute<ResultSetHeader>(
    "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)",
    [name, email, hashedPassword, role],
  );

  return {
    id: result.insertId,
    name,
    email,
    role,
  };
};

export const findUserById = async (id: number) => {
  const [rows] = await mysqlPool.execute<DbUser[]>(
    "SELECT id, full_name as name, email, phone_number as phone, role FROM users WHERE id = ?",
    [id],
  );
  return rows.length ? rows[0] : null;
};

export const updateUser = async (
  id: number,
  data: { name?: string; email?: string; phone?: string },
) => {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    updates.push("full_name = ?");
    values.push(data.name);
  }
  if (data.email !== undefined) {
    updates.push("email = ?");
    values.push(data.email);
  }
  if (data.phone !== undefined) {
    updates.push("phone_number = ?");
    values.push(data.phone);
  }

  if (updates.length === 0) {
    return findUserById(id);
  }

  updates.push("updated_at = NOW()");
  values.push(id);

  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  await mysqlPool.execute(query, values);

  return findUserById(id);
};
