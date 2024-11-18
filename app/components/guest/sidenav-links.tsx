'use client'

import { usePathname } from 'next/navigation';//Para ressaltar el link activo.
import clsx from 'clsx';//Para aplicar estilos condicionalmente. Los dos se usan para resaltar el link activo
import Link from 'next/link';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import WorkIcon from '@mui/icons-material/Work';

const linksguest = [
  { name: 'Proyectos', href: '/guest/projects', icon: WorkIcon },
  { name: 'Histórico', href: '/guest/historic', icon: HistoryIcon },
  { name: 'Inventario', href: '/guest/inventory', icon: InventoryIcon },
  
  //Añadir links segun necesario aca.
];

export function SideNavLinksGuest() {
  const pathname = usePathname();
  return (
    <>
      {linksguest.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`); // Verifica si el pathname es igual o comienza con el href seguido de una barra

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-16 grow items-center justify-center gap-2 text-white p-3 text-sm font-medium hover:bg-gradient-to-t hover:from-orange-500 hover:to-gray-800 md:hover:bg-gradient-to-l md:hover:from-orange-500 md:hover:to-gray-800 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-gradient-to-t from-orange-500 to-transparent md:bg-gradient-to-l md:from-orange-500 md:to-gray-800': isActive,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}