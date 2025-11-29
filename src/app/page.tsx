import Image from "next/image";
import Link from "next/link";
import kidsLearning from "@/components/images/kids-learning.png";
// import kidsLearning from "@/components/images/kids-learning.png";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 to-blue-200 font-sans text-zinc-800 dark:from-sky-900 dark:to-blue-950 dark:text-white">
    
    {/* Top Right Login Button */}
    <div className="w-full flex justify-end p-6">
    <Link
      href="/login"
      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition"
    >
    Login
    </Link>
    </div>

    {/* Hero Section */}
    <section className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-20">
      <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-md">
        Selamat Datang di <span className="text-blue-600 dark:text-blue-400">EduKids</span>
      </h1>
    <p className="mt-4 max-w-2xl text-lg sm:text-xl opacity-90">
    Platform pembelajaran interaktif untuk anak Sekolah Dasar kelas 1 hingga 6. Belajar jadi lebih seru,
    mudah, dan menyenangkan!
    </p>
    <Image
      src={kidsLearning}
      alt="Kids Learning Illustration"
      width={480}
      height={480}
      className="mt-10 w-[320px] sm:w-[450px] h-auto"
    />
    </section>

    {/* Informational Sections */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 pb-20 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">Materi Sesuai Kurikulum</h3>
          <p className="opacity-80">Pelajaran lengkap untuk setiap kelas mengikuti kurikulum nasional.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">Interaktif dan Menarik</h3>
          <p className="opacity-80">Animasi dan permainan edukatif yang membuat belajar jadi asyik.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">Akses Mudah</h3>
          <p className="opacity-80">Belajar kapan saja dan di mana saja dengan perangkat apa pun.</p>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-8 text-center opacity-70 text-sm">
    © {new Date().getFullYear()} EduKids Learning. All rights reserved.
    </footer>
    </div>
  );
}