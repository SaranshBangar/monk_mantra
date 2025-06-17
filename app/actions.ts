"use server";
import { neon } from "@neondatabase/serverless";

export type TaskStatus = "pending" | "complete";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

export async function getAllTasks(): Promise<Task[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    SELECT * FROM "public"."data" 
    ORDER BY "createdAt" DESC
  `;
  return data as Task[];
}

export async function addTask(title: string, status: TaskStatus = "pending") {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    INSERT INTO "public"."data" ("title", "status", "createdAt")
    VALUES (${title}, ${status}, NOW())
    RETURNING *;
  `;
  return data;
}

export async function getATask(id: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    SELECT * FROM "public"."data" 
    WHERE "id" = ${id}
  `;
  return data;
}

export async function updateTask(id: string, title: string, status?: TaskStatus) {
  const sql = neon(process.env.DATABASE_URL!);

  if (status !== undefined) {
    const data = await sql`
      UPDATE "public"."data"
      SET "title" = ${title}, "status" = ${status}
      WHERE "id" = ${id}
      RETURNING *;
    `;
    return data;
  } else {
    const data = await sql`
      UPDATE "public"."data"
      SET "title" = ${title}
      WHERE "id" = ${id}
      RETURNING *;
    `;
    return data;
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    UPDATE "public"."data"
    SET "status" = ${status}
    WHERE "id" = ${id}
    RETURNING *;
  `;
  return data;
}

export async function deleteTask(id: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    DELETE FROM "public"."data"
    WHERE "id" = ${id}
    RETURNING *;
  `;
  return data;
}
