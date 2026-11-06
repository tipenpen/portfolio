import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortfolioData, savePortfolioData, PortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil data.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, data, action } = body;

    // Verifikasi kredensial login admin dari server secara aman
    if (action === "verify") {
      if (passcode === ADMIN_PASSCODE) {
        return NextResponse.json({ success: true, verified: true });
      }
      return NextResponse.json(
        { error: "Kata sandi otorisasi tidak valid." },
        { status: 401 }
      );
    }

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Kata sandi otorisasi tidak valid." },
        { status: 401 }
      );
    }

    if (!data || !data.profile || !Array.isArray(data.projects)) {
      return NextResponse.json(
        { error: "Format data portofolio tidak valid." },
        { status: 400 }
      );
    }

    await savePortfolioData(data as PortfolioData);

    // Revalidasi halaman utama agar perubahan langsung tampil di Vercel
    try {
      revalidatePath("/");
    } catch {
      // Revalidasi opsional jika dijalankan di runtime tertentu
    }

    return NextResponse.json({ success: true, message: "Data berhasil disimpan." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
