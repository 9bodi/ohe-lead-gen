import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui";

export default function Splash() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 sm:px-10 md:px-16"
      style={{ backgroundColor: "#1E3A8A", color: "#FFFFFF" }}
    >
      {/* Logo */}
      <div className="mb-12 sm:mb-14 md:mb-16 w-[110px] sm:w-[150px] md:w-[200px] lg:w-[200px]">
        <Logo size={200} variant="white" />
      </div>

      {/* Titre */}
      <h1 className="font-serif leading-[1.05] text-[40px] sm:text-[60px] md:text-[72px] lg:text-[76px] max-w-[16ch]">
        Évaluez votre niveau
        <br />
        en français
      </h1>

      {/* Sous-titre */}
      <p className="mt-6 md:mt-8 text-[16px] sm:text-[19px] md:text-[22px] opacity-85 max-w-[34ch]">
        Rapide, gratuit, résultat immédiat
      </p>

      {/* Bouton */}
            <Link
        href="/accueil"
        className="mt-10 sm:mt-12 md:mt-14 inline-flex items-center justify-center rounded-full bg-white px-8 md:px-10 py-4 md:py-5 text-[16px] sm:text-[17px] md:text-[19px] font-medium transition hover:opacity-90"
        style={{ color: "#1E3A8A" }}
      >
        Commencer le diagnostic
      </Link>


      {/* Signature Roxane */}
      <div className="mt-16 sm:mt-20 md:mt-24 flex items-center gap-3 md:gap-4">
        <span className="inline-block rounded-full overflow-hidden border border-white/40 shrink-0">
          <Image
            src="/images/roxane.avif"
            alt="Roxane Joannidès"
            width={56}
            height={56}
            className="object-cover"
            style={{ width: 56, height: 56 }}
          />
        </span>
        <div className="text-left">
          <div className="text-[13px] sm:text-[14px] md:text-[16px] font-medium">
            Roxane Joannidès
          </div>
          <div className="text-[12px] sm:text-[13px] md:text-[15px] opacity-70">
            Docteure en sciences du langage
          </div>
        </div>
      </div>
    </main>
  );
}
