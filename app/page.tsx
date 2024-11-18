import Image from "next/image";
import Button from '@mui/material/Button';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LabTrackLogoWhite from "./components/labtrack-logo";

export default function Principal() {
  return (
    <main className="flex flex-col h-screen w-screen">
      <div className="absolute inset-0 h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/research-background.png')" }} >
        <div className="absolute inset-0 bg-gray-800 opacity-80" />
      </div>
      <div className="flex h-[15%] relative ml-10 z-10">
        <LabTrackLogoWhite />
      </div>
      <div className="flex flex-col md:flex-row h-full w-full bg-gray-100 items-center justify-center border-t-8 border-b-8 border-orange-500 z-10">
        <div className="flex flex-col w-8/10 md:w-2/5 m-16 items-start">
          <p className="text-xl md:text-3xl text-gray-700 font-medium">
            <strong className="text-orange-500">
              Bienvenido a LMS.
            </strong>
            Click a continuación para iniciar sesión o registrarse si es un docente.
          </p>
          <div className="flex justify-start gap-5 mt-5">
            <Button variant="contained" href="/login" size="large" color="warning" disableElevation endIcon={<KeyboardArrowRightIcon />}>
              Iniciar Sesión
            </Button>
            <Button variant="contained" href="/register" size="large" color="warning" disableElevation endIcon={<KeyboardArrowRightIcon />}>
              Registrarse
            </Button>
          </div>
        </div>
        <div className="flex justify-center md:w-3/5">
          <div className="flex justify-center">
            <Image src="/research-desktop.png" width={410} height={450} className="hidden md:block" alt="Versión Escritorio Imagen" />
            <Image src="/research-mobile.png" width={189} height={210} className="block md:hidden" alt="Versión Mobile Imagen" />
          </div>
        </div>
      </div>
      <div className="flex items-end w-screen h-[10%] text-white text-l font-medium z-10">
        <p className="flex ml-10 mb-4">Proyecto PPS - Giménez - 2024</p>
      </div>
    </main>
  );
}