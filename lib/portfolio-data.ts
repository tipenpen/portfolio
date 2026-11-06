import fs from "fs/promises";
import path from "path";
import clientPromise from "./mongodb";

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  num: string;
  title: string;
  client: string;
  category: string;
  year: string;
  role: string;
  description: string;
  tech: string[];
  image: string;
  specs: ProjectSpec[];
  link: string;
}

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  handle: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  achievements?: string[];
}

export interface ProfileData {
  name: string;
  brandSubtitle: string;
  availability: string;
  location: string;
  greeting: string;
  headline1: string;
  headlineSub: string;
  headlineSubTag: string;
  headlineEnd: string;
  bio1: string;
  bio2: string;
  valueBadges: string[];
  email: string;
  whatsapp: string;
  heroBtnPrimary: string;
  heroBtnSecondary: string;
  footerTitle: string;
  footerTitleHighlight: string;
  footerBtnText: string;
  copyright: string;
}

export interface PreloaderData {
  badge: string;
  messages: string[];
  footerText: string;
}

export interface PortfolioData {
  profile: ProfileData;
  education: EducationItem[];
  socials: SocialLink[];
  projects: ProjectItem[];
  preloader: PreloaderData;
}

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");
const DB_NAME = process.env.MONGODB_DB || "tipen_portfolio";
const COLLECTION_NAME = "portfolio";
const MASTER_DOC_ID = "portfolio_master";

// Fungsi pembantu untuk membaca berkas JSON lokal sebagai cadangan
async function readLocalFallback(): Promise<PortfolioData> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.education) parsed.education = [];
    return parsed;
  } catch {
    throw new Error("Gagal membaca berkas cadangan data portofolio lokal.");
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  // 1. Coba ambil dari MongoDB
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const col = db.collection(COLLECTION_NAME);
      const doc = await col.findOne({ _id: MASTER_DOC_ID as unknown as import("mongodb").ObjectId });

      if (doc) {
        return {
          profile: doc.profile,
          education: doc.education || [],
          socials: doc.socials || [],
          projects: doc.projects || [],
          preloader: doc.preloader,
        };
      }

      // Jika koleksi MongoDB masih kosong, inisialisasi dari berkas lokal
      const initialData = await readLocalFallback();
      await col.updateOne(
        { _id: MASTER_DOC_ID as unknown as import("mongodb").ObjectId },
        { $set: { ...initialData, updatedAt: new Date() } },
        { upsert: true }
      );
      return initialData;
    } catch (dbErr) {
      console.warn("Koneksi MongoDB gagal saat membaca, beralih ke berkas lokal:", dbErr);
    }
  }

  // 2. Cadangan jika MongoDB tidak aktif
  return readLocalFallback();
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  let savedToMongo = false;

  // 1. Simpan ke MongoDB
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const col = db.collection(COLLECTION_NAME);

      await col.updateOne(
        { _id: MASTER_DOC_ID as unknown as import("mongodb").ObjectId },
        {
          $set: {
            profile: data.profile,
            education: data.education,
            socials: data.socials,
            projects: data.projects,
            preloader: data.preloader,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      savedToMongo = true;
    } catch (dbErr) {
      console.error("Gagal menyimpan ke MongoDB:", dbErr);
    }
  }

  // 2. Selalu simpan juga ke berkas lokal jika sistem berkas mengizinkan (sebagai backup / offline sync)
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Pada lingkungan serverless (Vercel), penulisan ke berkas lokal mungkin diabaikan jika sistem berkas hanya-baca
  }

  if (clientPromise && !savedToMongo) {
    throw new Error("Gagal menyimpan perubahan ke MongoDB.");
  }

  return true;
}
