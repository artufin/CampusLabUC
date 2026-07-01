import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { OpenDataDataset } from "@/lib/types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "solar-plants.json");

export async function GET() {
  try {
    const raw = await readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as { generatedAt: string; datasets: OpenDataDataset[] };
    return NextResponse.json(parsed.datasets);
  } catch {
    return NextResponse.json(
      { error: "Datos de generación solar no disponibles" },
      { status: 404 },
    );
  }
}
