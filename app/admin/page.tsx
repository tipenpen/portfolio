"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  Lock,
  LogOut,
  FolderKanban,
  User,
  Share2,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import {
  PortfolioData,
  ProjectItem,
  SocialLink,
  EducationItem,
} from "@/lib/portfolio-data";

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "projects" | "education" | "profile" | "socials" | "preloader"
  >("projects");
  const [data, setData] = useState<PortfolioData | null>(null);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Education Editor State
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [isNewEducation, setIsNewEducation] = useState(false);

  // Social Editor State
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isNewSocial, setIsNewSocial] = useState(false);

  // Load portfolio data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const json = await res.json();
          if (!json.education) json.education = [];
          setData(json);
        }
      } catch (err) {
        console.error("Gagal memuat data", err);
      }
    }
    loadData();

    const savedPass = sessionStorage.getItem("tipen_cms_pass");
    if (savedPass) {
      setTimeout(() => {
        setPasscode(savedPass);
        setIsAuthenticated(true);
      }, 0);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("tipen_cms_pass", passcode);
      setAuthError("");
    } else {
      setAuthError("Kata sandi salah. (Kata sandi bawaan: admin123)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("tipen_cms_pass");
    setPasscode("");
  };

  const handleSaveAll = async () => {
    if (!data) return;
    setLoading(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, data }),
      });

      const result = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.error || "Gagal menyimpan perubahan.");
      }
    } catch {
      setSaveError("Terjadi kendala jaringan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // --- PROJECT HANDLERS ---
  const handleAddNewProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      num: String((data?.projects.length || 0) + 1).padStart(2, "0"),
      title: "Nama Proyek Baru",
      client: "Nama Klien / Instansi",
      category: "Kategori Website",
      year: new Date().getFullYear().toString(),
      role: "Pengembang Website",
      description: "Deskripsi lengkap mengenai website yang telah berhasil dikembangkan.",
      tech: ["Aplikasi Web", "Responsif", "Cepat"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      specs: [
        { label: "KATEGORI", value: "Profil Perusahaan" },
        { label: "TAMPILAN", value: "Seluler & Desktop" },
        { label: "KECEPATAN", value: "Optimal" },
      ],
      link: "#",
    };
    setEditingProject(newProj);
    setIsNewProject(true);
  };

  const handleSaveProjectForm = () => {
    if (!editingProject || !data) return;

    let updatedProjects: ProjectItem[];
    if (isNewProject) {
      updatedProjects = [...data.projects, editingProject];
    } else {
      updatedProjects = data.projects.map((p) =>
        p.id === editingProject.id ? editingProject : p
      );
    }

    setData({ ...data, projects: updatedProjects });
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!data) return;
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      const updated = data.projects.filter((p) => p.id !== id);
      setData({ ...data, projects: updated });
    }
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const newProjects = [...data.projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    setData({ ...data, projects: newProjects });
  };

  // --- EDUCATION HANDLERS ---
  const handleAddNewEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "Nama Universitas / Sekolah",
      degree: "Jenjang & Jurusan",
      period: "2020 — 2024",
      description: "Deskripsi ringkas mengenai fokus studi dan keahlian yang dipelajari.",
      achievements: ["Fokus Pemrograman Web"],
    };
    setEditingEducation(newEdu);
    setIsNewEducation(true);
  };

  const handleSaveEducationForm = () => {
    if (!editingEducation || !data) return;

    let updatedEducation: EducationItem[];
    const currentEdu = data.education || [];

    if (isNewEducation) {
      updatedEducation = [...currentEdu, editingEducation];
    } else {
      updatedEducation = currentEdu.map((e) =>
        e.id === editingEducation.id ? editingEducation : e
      );
    }

    setData({ ...data, education: updatedEducation });
    setEditingEducation(null);
  };

  const handleDeleteEducation = (id: string) => {
    if (!data) return;
    if (confirm("Hapus riwayat pendidikan ini?")) {
      const updated = (data.education || []).filter((e) => e.id !== id);
      setData({ ...data, education: updated });
    }
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    if (!data || !data.education) return;
    const newEdu = [...data.education];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newEdu.length) return;

    const temp = newEdu[index];
    newEdu[index] = newEdu[targetIndex];
    newEdu[targetIndex] = temp;
    setData({ ...data, education: newEdu });
  };

  // --- SOCIAL MEDIA HANDLERS ---
  const handleAddNewSocial = () => {
    const newSoc: SocialLink = {
      id: `soc-${Date.now()}`,
      name: "Platform Baru",
      href: "https://",
      handle: "@username",
    };
    setEditingSocial(newSoc);
    setIsNewSocial(true);
  };

  const handleSaveSocialForm = () => {
    if (!editingSocial || !data) return;

    let updatedSocials: SocialLink[];
    if (isNewSocial) {
      updatedSocials = [...data.socials, editingSocial];
    } else {
      updatedSocials = data.socials.map((s) =>
        s.id === editingSocial.id ? editingSocial : s
      );
    }

    setData({ ...data, socials: updatedSocials });
    setEditingSocial(null);
  };

  const handleDeleteSocial = (id: string) => {
    if (!data) return;
    if (confirm("Hapus tautan media sosial ini?")) {
      const updated = data.socials.filter((s) => s.id !== id);
      setData({ ...data, socials: updated });
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#121215] p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Otorisasi Akses CMS
              </h1>
              <p className="text-xs text-zinc-400">Panel Pengelolaan Portofolio</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">
                KATA SANDI ADMINISTRATOR
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan kata sandi (Default: admin123)"
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-white/40 focus:outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Masuk ke Panel Kendali
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center font-mono text-xs">
        Memuat data portofolio...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-[#FAFAFA] p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>SISTEM MANAJEMEN KONTEN LENGKAP (CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Panel Kendali Portofolio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-xs text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Lihat Website</span>
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors shadow-lg"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{loading ? "Menyimpan..." : "Simpan Seluruh Perubahan"}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 hover:text-rose-400 hover:border-rose-400/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Alerts */}
      {saveSuccess && (
        <div className="my-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>Seluruh perubahan berhasil disimpan secara permanen ke website.</span>
        </div>
      )}
      {saveError && (
        <div className="my-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="my-6 flex flex-wrap gap-2 border-b border-white/[0.06] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            activeTab === "projects"
              ? "bg-white/[0.08] text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          <span>1. Proyek ({data.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            activeTab === "education"
              ? "bg-white/[0.08] text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>2. Pendidikan ({(data.education || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            activeTab === "profile"
              ? "bg-white/[0.08] text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <User className="h-4 w-4" />
          <span>3. Teks &amp; Profil</span>
        </button>

        <button
          onClick={() => setActiveTab("socials")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            activeTab === "socials"
              ? "bg-white/[0.08] text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>4. Media Sosial ({data.socials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("preloader")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            activeTab === "preloader"
              ? "bg-white/[0.08] text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Loader2 className="h-4 w-4" />
          <span>5. Preloader</span>
        </button>
      </div>

      {/* TAB 1: PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Daftar proyek yang ditampilkan pada reel gulir horizontal halaman utama.
            </p>
            <button
              onClick={handleAddNewProject}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Proyek Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-white/[0.08] bg-[#121215] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => handleMoveProject(idx, "up")}
                      disabled={idx === 0}
                      className="text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Geser ke Atas"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveProject(idx, "down")}
                      disabled={idx === data.projects.length - 1}
                      className="text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Geser ke Bawah"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">
                      Urutan {idx + 1} &bull; {proj.year} &bull; {proj.client}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-zinc-400">{proj.category}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-1 font-light">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingProject({ ...proj });
                      setIsNewProject(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-white/30"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Sunting</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EDUCATION (NEW) */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Kelola Riwayat Pendidikan
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tambahkan atau sunting rekam jejak akademik yang ditampilkan pada bagian Riwayat Pendidikan.
              </p>
            </div>
            <button
              onClick={handleAddNewEducation}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Pendidikan</span>
            </button>
          </div>

          <div className="space-y-3">
            {(data.education || []).map((edu, idx) => (
              <div
                key={edu.id}
                className="rounded-2xl border border-white/[0.08] bg-[#121215] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => handleMoveEducation(idx, "up")}
                      disabled={idx === 0}
                      className="text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Geser ke Atas"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveEducation(idx, "down")}
                      disabled={idx === (data.education?.length || 0) - 1}
                      className="text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Geser ke Bawah"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase">
                      {edu.period}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {edu.institution}
                    </h3>
                    <p className="text-xs text-zinc-300 font-medium">{edu.degree}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-1 font-light">
                      {edu.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingEducation({ ...edu });
                      setIsNewEducation(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-white/30"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Sunting</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & TEXTS */}
      {activeTab === "profile" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white pb-3 border-b border-white/[0.06]">
            Informasi Profil &amp; Teks Utama Halaman
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                NAMA IDENTITAS
              </label>
              <input
                type="text"
                value={data.profile.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, name: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                SUBTITEL LOGO / BRAND
              </label>
              <input
                type="text"
                value={data.profile.brandSubtitle}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, brandSubtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                SAPAAN AWAL
              </label>
              <input
                type="text"
                value={data.profile.greeting}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, greeting: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                STATUS KETERSEDIAAN PROYEK
              </label>
              <input
                type="text"
                value={data.profile.availability}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, availability: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                LOKASI
              </label>
              <input
                type="text"
                value={data.profile.location}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, location: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                ALAMAT EMAIL RESMI
              </label>
              <input
                type="email"
                value={data.profile.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, email: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                NOMOR WHATSAPP (Format: +62...)
              </label>
              <input
                type="text"
                value={data.profile.whatsapp}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, whatsapp: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                TEKS HAK CIPTA (FOOTER COPYRIGHT)
              </label>
              <input
                type="text"
                value={data.profile.copyright}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, copyright: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Headline Customizer */}
          <div className="pt-4 border-t border-white/[0.06] space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase">
              Susunan Kalimat Judul Utama (Headline)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Baris 1
                </label>
                <input
                  type="text"
                  value={data.profile.headline1}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, headline1: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Baris 2 (Teks Berwarna Lembut)
                </label>
                <input
                  type="text"
                  value={data.profile.headlineSub}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, headlineSub: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Tag Kecil Samping Baris 2
                </label>
                <input
                  type="text"
                  value={data.profile.headlineSubTag}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, headlineSubTag: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Baris 3 (Penutup Judul)
                </label>
                <input
                  type="text"
                  value={data.profile.headlineEnd}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, headlineEnd: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Bio & Badges */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                PARAGRAF PERKENALAN 1
              </label>
              <textarea
                rows={3}
                value={data.profile.bio1}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, bio1: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                PARAGRAF PERKENALAN 2
              </label>
              <textarea
                rows={3}
                value={data.profile.bio2}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, bio2: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                3 POIN KEUNGGULAN (Pisahkan dengan tanda koma)
              </label>
              <input
                type="text"
                value={data.profile.valueBadges.join(", ")}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: {
                      ...data.profile,
                      valueBadges: e.target.value
                        .split(",")
                        .map((b) => b.trim())
                        .filter(Boolean),
                    },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIALS & FOOTER */}
      {activeTab === "socials" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-bold text-white">
                Daftar Media Sosial &amp; Kontak Footer
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tambah, ubah, atau hapus kanal media sosial yang muncul pada bagian bawah website.
              </p>
            </div>
            <button
              onClick={handleAddNewSocial}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Media Sosial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.socials.map((soc) => (
              <div
                key={soc.id}
                className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2 relative group hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{soc.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingSocial({ ...soc });
                        setIsNewSocial(false);
                      }}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Edit"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(soc.id)}
                      className="text-zinc-400 hover:text-rose-400 p-1"
                      title="Hapus"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 font-medium truncate">{soc.handle}</p>
                <a
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono truncate"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{soc.href}</span>
                </a>
              </div>
            ))}
          </div>

          {/* Footer Call to Action Text Customizer */}
          <div className="pt-6 border-t border-white/[0.06] space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase">
              Teks Ajakan Menghubungi di Footer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Judul Footer Baris 1
                </label>
                <input
                  type="text"
                  value={data.profile.footerTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, footerTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Judul Footer Baris 2 (Sorotan)
                </label>
                <input
                  type="text"
                  value={data.profile.footerTitleHighlight}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        footerTitleHighlight: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Teks Tombol Footer
                </label>
                <input
                  type="text"
                  value={data.profile.footerBtnText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, footerBtnText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRELOADER */}
      {activeTab === "preloader" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white pb-3 border-b border-white/[0.06]">
            Pengaturan Layar Pemuatan Awal (Preloader)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                LENCANA / BADGE PRELOADER
              </label>
              <input
                type="text"
                value={data.preloader.badge}
                onChange={(e) =>
                  setData({
                    ...data,
                    preloader: { ...data.preloader, badge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                TEKS KAKI PRELOADER
              </label>
              <input
                type="text"
                value={data.preloader.footerText}
                onChange={(e) =>
                  setData({
                    ...data,
                    preloader: { ...data.preloader, footerText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                PESAN-PESAN STATUS SAAT MEMUAT (Pisahkan dengan baris baru / Enter)
              </label>
              <textarea
                rows={5}
                value={data.preloader.messages.join("\n")}
                onChange={(e) =>
                  setData({
                    ...data,
                    preloader: {
                      ...data.preloader,
                      messages: e.target.value.split("\n").filter(Boolean),
                    },
                  })
                }
                className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH PENDIDIKAN */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.1] bg-[#121215] p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {isNewEducation
                  ? "Tambah Riwayat Pendidikan Baru"
                  : "Sunting Riwayat Pendidikan"}
              </h3>
              <button
                onClick={() => setEditingEducation(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Tutup [ESC]
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  NAMA INSTITUSI / PERGURUAN TINGGI / SEKOLAH
                </label>
                <input
                  type="text"
                  value={editingEducation.institution}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      institution: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  JENJANG &amp; JURUSAN / GELAR (Contoh: S1 Teknik Informatika)
                </label>
                <input
                  type="text"
                  value={editingEducation.degree}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      degree: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  PERIODE TAHUN (Contoh: 2020 — 2024)
                </label>
                <input
                  type="text"
                  value={editingEducation.period}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      period: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  DESKRIPSI FORMAL
                </label>
                <textarea
                  rows={3}
                  value={editingEducation.description}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  PRESTASI / CATATAN KHUSUS (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={(editingEducation.achievements || []).join(", ")}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      achievements: e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingEducation(null)}
                className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs text-zinc-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEducationForm}
                className="rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH PROYEK */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#121215] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {isNewProject ? "Tambah Proyek Baru" : "Sunting Informasi Proyek"}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Tutup [ESC]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  JUDUL PROYEK
                </label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  KATEGORI WEBSITE
                </label>
                <input
                  type="text"
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  NAMA KLIEN / INSTANSI
                </label>
                <input
                  type="text"
                  value={editingProject.client}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, client: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  TAHUN PENYELESAIAN
                </label>
                <input
                  type="text"
                  value={editingProject.year}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, year: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  URL GAMBAR CUPLIKAN PROYEK
                </label>
                <input
                  type="text"
                  value={editingProject.image}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, image: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  DESKRIPSI FORMAL PROYEK
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  TAG KEUNGGULAN / FITUR (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={editingProject.tech.join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tech: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              {/* 3 Highlights/Specs */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="block text-xs font-mono text-zinc-400">
                  3 HIGHLIGHT / SPESIFIKASI PROYEK
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="space-y-1">
                      <input
                        type="text"
                        placeholder="Label (Contoh: KATEGORI)"
                        value={editingProject.specs[idx]?.label || ""}
                        onChange={(e) => {
                          const newSpecs = [...editingProject.specs];
                          newSpecs[idx] = {
                            ...newSpecs[idx],
                            label: e.target.value.toUpperCase(),
                            value: newSpecs[idx]?.value || "",
                          };
                          setEditingProject({
                            ...editingProject,
                            specs: newSpecs,
                          });
                        }}
                        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-2.5 py-1.5 text-[11px] text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Nilai (Contoh: Toko Online)"
                        value={editingProject.specs[idx]?.value || ""}
                        onChange={(e) => {
                          const newSpecs = [...editingProject.specs];
                          newSpecs[idx] = {
                            label: newSpecs[idx]?.label || "FITUR",
                            value: e.target.value,
                          };
                          setEditingProject({
                            ...editingProject,
                            specs: newSpecs,
                          });
                        }}
                        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-2.5 py-1.5 text-[11px] text-zinc-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs text-zinc-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProjectForm}
                className="rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
              >
                Terapkan ke Daftar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH SOSMED */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#121215] p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {isNewSocial ? "Tambah Media Sosial Baru" : "Sunting Media Sosial"}
              </h3>
              <button
                onClick={() => setEditingSocial(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Tutup [ESC]
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  NAMA PLATFORM (Contoh: Instagram, WhatsApp, GitHub)
                </label>
                <input
                  type="text"
                  value={editingSocial.name}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  LABEL / USERNAME (Contoh: @username, Kirim Pesan)
                </label>
                <input
                  type="text"
                  value={editingSocial.handle}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, handle: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  TAUTAN URL LENGKAP (https://...)
                </label>
                <input
                  type="text"
                  value={editingSocial.href}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, href: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingSocial(null)}
                className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs text-zinc-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSocialForm}
                className="rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
