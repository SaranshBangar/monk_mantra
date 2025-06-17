"use server";
import { neon } from "@neondatabase/serverless";

export async function getAllTasks() {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    SELECT * FROM "public"."data" 
    ORDER BY "createdAt" DESC
  `;
  return data;
}

export async function addTask(task: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    INSERT INTO "public"."data" ("task")
    VALUES (${task})
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

export async function updateTask(id: string, task: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    UPDATE "public"."data"
    SET "task" = ${task}
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
