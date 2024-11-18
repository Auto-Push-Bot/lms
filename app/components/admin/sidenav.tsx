import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LabTrackLogoWhite from "../labtrack-logo";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import { getLabById } from "@/app/lib/queries/laboratory";
import { getTypeAdmin } from "@/app/lib/queries/usertype";
import { doLogout } from "@/app/services/login/login.service";
import IconButton from "@mui/material/IconButton";
import { SideNavLinksAdmin } from "./sidenav-links";

export default async function SideNav() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const adminType = await getTypeAdmin();
  const current_id_string = session?.user?.id; 
  const current_id_number = Number(current_id_string);

  let role;
  if (session?.user?.usertype_id === adminType) {
    role = "Admin";
  } 

  const laboratory_id = session?.user?.laboratory_id;
  const laboratory = await getLabById(laboratory_id); 

  const lab = laboratory.name;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b md:bg-gradient-to-r from-gray-800 to-gray-700 border-b-4 md:border-r-4 md:border-b-0 border-orange-500">
      <Link className="flex mb-6 mt-6 md:mt-0 h-10 md:h-20 justify-center items-center" href="/">
        <div>
          <LabTrackLogoWhite/>
        </div>
      </Link>
      <div className="flex flex-row grow justify-between md:flex-col overflow-auto custom-scrollbar h-full">
        <SideNavLinksAdmin current_id_number={current_id_number}/>
        <div className="hidden h-auto w-full grow md:block"/>
        <div className="flex flex-col items-center justify-center w-full md:py-6 hidden md:block">
          <p className="flex text-center items-center justify-center text-white font-medium md:justify-start hidden md:block">
            <strong>{session?.user?.name}</strong>
          </p>
          <p className="flex text-center items-center justify-center text-white font-medium md:justify-start hidden md:block">
            {lab}
          </p>
          <p className="flex text-center items-center justify-center text-orange-500 font-medium md:justify-start hidden md:block">
            {role}
          </p>
        </div>
        <form action={doLogout}>
          <div className="flex items-center justify-center gap-2 text-white p-3 text-sm font-medium hover:bg-gradient-to-r hover:from-red-700 hover:to-orange-500 hidden md:block">
            <Button variant="text" size="large" color="inherit" type="submit" disableElevation endIcon={<LogoutIcon />} fullWidth>
              CERRAR SESIÓN
            </Button>
          </div>
          <div className="flex h-16 grow items-center justify-center gap-2 block md:hidden text-white">
            <IconButton color="inherit" type="submit">
              <LogoutIcon/>
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}