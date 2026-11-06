import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import SelectedWorks from "@/components/SelectedWorks";
import FooterCTA from "@/components/FooterCTA";
import Preloader from "@/components/Preloader";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="relative min-h-screen bg-[#09090B] text-[#FAFAFA] selection:bg-zinc-800 selection:text-white">
      {/* 0. Layar Pemuatan Awal (Preloader Dinamis) */}
      <Preloader preloader={data.preloader} />

      {/* 1. Navigasi Utama */}
      <Navbar profile={data.profile} />

      {/* 2. Perkenalan & Profil Utama */}
      <Hero profile={data.profile} />

      {/* 3. Riwayat Pendidikan (Dinamis dari CMS) */}
      <Education education={data.education} />

      {/* 4. Portofolio Proyek Pilihan (Horizontal Scroll Reel) */}
      <SelectedWorks projects={data.projects} />

      {/* 5. Konsultasi & Kerja Sama (Kontak & Media Sosial Dinamis) */}
      <FooterCTA profile={data.profile} socials={data.socials} />
    </main>
  );
}
