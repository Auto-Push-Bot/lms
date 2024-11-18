'use client'

import { usePathname } from 'next/navigation';//Para ressaltar el link activo.
import clsx from 'clsx';//Para aplicar estilos condicionalmente. Los dos se usan para resaltar el link activo
import Link from 'next/link';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import WorkIcon from '@mui/icons-material/Work';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import Badge from '@mui/material/Badge';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '@/app/services/messages/chat.service';

const linksadmin = [
    { name: 'Proyectos', href: '/admin/projects', icon: WorkIcon },
    { name: 'Histórico', href: '/admin/historic', icon: HistoryIcon },
    { name: 'Inventario', href: '/admin/inventory', icon: InventoryIcon },
    { name: 'Mensajes', href: '/admin/messages', icon: ChatIcon },
    { name: 'Usuarios', href: '/admin/usermanagement', icon: GroupIcon },
    { name: 'Parámetros', href: '/admin/paramsmanagement', icon: BuildIcon },
    
    //Añadir links segun necesario aca.
];

interface LinkProps {
  current_id_number: number;
}

export function SideNavLinksAdmin({ current_id_number }: LinkProps) {
  const { watch, setValue } = useForm({
    defaultValues: {
      unreadCount: 0,
    }
  });
  //fetch unread count
  const { data, refetch } = useQuery({
    queryKey: ['getUnreadCount'],
    queryFn: () => fetchUnreadCount(current_id_number),
    refetchInterval: 5000,
  });
  useEffect(() => {
    if (data !== undefined && data !== null) {
      setValue("unreadCount", data, { shouldValidate: true });
    }
  }, [data, setValue]);
  const unreadCount = watch('unreadCount');
  //pathname
  const pathname = usePathname();
  //link click
  const handleLinkClick = () => {
    refetch();
  };
  return (
    <>
      {linksadmin.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`); // Verifica si el pathname es igual o comienza con el href seguido de una barra

        const renderBadge = link.name === 'Mensajes' && unreadCount > 0;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={handleLinkClick}
            className={clsx(
              'flex h-16 grow items-center justify-center gap-2 text-white p-3 text-sm font-medium hover:bg-gradient-to-t hover:from-orange-500 hover:to-gray-800 md:hover:bg-gradient-to-l md:hover:from-orange-500 md:hover:to-gray-800 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-gradient-to-t from-orange-500 to-transparent md:bg-gradient-to-l md:from-orange-500 md:to-gray-800': isActive,
              },
            )}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              invisible={!renderBadge}
              overlap="circular"
            >
              <LinkIcon className="w-6" />
            </Badge>
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}