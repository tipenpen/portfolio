import fs from "fs/promises";
import path from "path";

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
const TMP_DATA_FILE = path.join("/tmp", "portfolio.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  // 1. Coba baca dari /tmp jika berada di lingkungan Vercel serverless yang telah menyimpan modifikasi
  try {
    const tmpContent = await fs.readFile(TMP_DATA_FILE, "utf-8");
    const parsedTmp = JSON.parse(tmpContent);
    if (!parsedTmp.education) parsedTmp.education = [];
    return parsedTmp;
  } catch {
    // Abaikan jika berkas /tmp belum ada, lanjut membaca berkas bawaan
  }

  // 2. Baca dari berkas bawaan proyek
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.education) {
      parsed.education = [];
    }
    return parsed;
  } catch {
    throw new Error("Gagal membaca data portofolio dari berkas JSON.");
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  const content = JSON.stringify(data, null, 2);

  // 1. Coba simpan ke berkas lokal proyek
  try {
    await fs.writeFile(DATA_FILE, content, "utf-8");
    return true;
  } catch {
    // 2. Jika gagal karena sistem berkas hanya-baca (lingkungan serverless Vercel), simpan ke /tmp
    try {
      await fs.writeFile(TMP_DATA_FILE, content, "utf-8");
      return true;
    } catch {
      throw new Error("Gagal menyimpan data portofolio.");
    }
  }
}
