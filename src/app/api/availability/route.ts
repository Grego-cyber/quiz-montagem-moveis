import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// O caminho para o arquivo JSON de disponibilidade
// IMPORTANTE: Em um ambiente serverless como Vercel/Netlify, o sistema de arquivos é geralmente de leitura apenas após o build.
// Para persistência real, seria necessário um banco de dados ou um serviço de armazenamento externo.
// Para este exemplo, vamos assumir que estamos num ambiente onde podemos escrever no sistema de arquivos (ex: desenvolvimento local ou um servidor Node.js tradicional).
const availabilityFilePath = path.join(process.cwd(), "src", "data", "availability.json");

async function readAvailabilityFile() {
  try {
    const data = await fs.readFile(availabilityFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    // Se o arquivo não existir, retorna um objeto vazio ou uma estrutura padrão
    if (error.code === "ENOENT") {
      return {}; 
    }
    console.error("Error reading availability file:", error);
    throw new Error("Could not read availability data.");
  }
}

async function writeAvailabilityFile(data: any) {
  try {
    await fs.writeFile(availabilityFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing availability file:", error);
    throw new Error("Could not save availability data.");
  }
}

export async function GET(request: NextRequest) {
  try {
    const availabilityData = await readAvailabilityFile();
    return NextResponse.json(availabilityData);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newAvailabilityData = await request.json();
    if (typeof newAvailabilityData !== "object" || newAvailabilityData === null) {
        return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }
    await writeAvailabilityFile(newAvailabilityData);
    return NextResponse.json({ message: "Availability updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update availability" }, { status: 500 });
  }
}

