import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F8F8F8] text-[#375B38] py-12">
      <div className="w-full max-w-max mx-auto flex flex-col md:flex-row justify-center items-center gap-40 text-sm leading-relaxed px-6 md:px-10">

        {/* Bloque izquierdo */}
        <div className="flex flex-col items-center text-center gap-4 md:items-start md:text-left">

          {/* Redes sociales */}
          <div className="flex gap-6">
            <Link href="https://www.instagram.com/u_tad/" target="_blank" rel="noopener noreferrer">
              <Image src="/photos/footer/insta.png" alt="Instagram" width={36} height={36} />
            </Link>
            <Link href="https://www.facebook.com/utadcentrouniversitario/" target="_blank" rel="noopener noreferrer">
              <Image src="/photos/footer/facebook.png" alt="Facebook" width={36} height={36} />
            </Link>
            <Link href="https://x.com/u_tad" target="_blank" rel="noopener noreferrer">
              <Image src="/photos/footer/X.png" alt="Twitter" width={36} height={36} />
            </Link>
          </div>

          {/* Dirección */}
          <div className="text-xs">
            <p>Calle Playa de Liencres, 2 bis – Parque Europa Empresarial</p>
            <p>Edificio Madrid – 28290 Las Rozas, Madrid</p>
          </div>

          {/* Info contacto */}
          <p className="text-xs">
            <a href="mailto:info@u-tad.com" className="underline">info@u-tad.com</a> |{" "}
            <a href="tel:+34900373379" className="underline">(+34) 900 373 379</a> | L-V: 09:00 h. – 21:00 h.
          </p>

          {/* Logo U-tad */}
          <Link href="https://u-tad.com/" target="_blank" rel="noopener noreferrer">
            <Image src="/photos/footer/utad.png" alt="U-tad" width={100} height={50} />
          </Link>
        </div>

        {/* Bloque derecho */}
        <div className="flex flex-col items-center text-center gap-5 md:items-start md:text-left">

          {/* Logo CSIC */}
          <Link href="https://www.csic.es/es" target="_blank" rel="noopener noreferrer">
            <Image src="/photos/footer/csic.png" alt="CSIC" width={160} height={60} />
          </Link>

          <p className="text-xs">
            © CSIC - Consejo Superior de Investigaciones Científicas.<br />
            Todos los derechos reservados.
          </p>

          {/* GitHub logo */}
          <Link href="https://github.com/birdeeplus/birdeep" target="_blank" rel="noopener noreferrer">
            <Image src="/photos/footer/github.png" alt="GitHub" width={150} height={150} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
