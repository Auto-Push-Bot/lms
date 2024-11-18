'use client'

import { usePathname } from 'next/navigation'; // Para resaltar el link activo.
import clsx from 'clsx'; // Para aplicar estilos condicionalmente.
import Link from 'next/link';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import Badge from '@mui/material/Badge';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '@/app/services/messages/chat.service';
import { fetchUnreadObservationCount } from '@/app/services/projects/projects.service';

const linksscholar = [
  { name: 'Proyectos', href: '/scholar/projects', icon: WorkIcon },
  { name: 'Mensajes', href: '/scholar/messages', icon: ChatIcon },
];

interface LinkProps {
  current_id_number: number;
}

export function SideNavLinksScholar({ current_id_number }: LinkProps) {
  const { watch, setValue } = useForm({
    defaultValues: {
      unreadCount: 0,
      unreadobservations: 0,
    },
  });

  // Fetch unread counts
  const { data: unreadMessages, refetch } = useQuery({
    queryKey: ['getUnreadCount'],
    queryFn: () => fetchUnreadCount(current_id_number),
    refetchInterval: 5000,
  });
  const { data: unreadObservations, refetch: refetchObservations } = useQuery({
    queryKey: ['getUnreadObservationCount'],
    queryFn: () => fetchUnreadObservationCount(current_id_number),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (unreadMessages !== undefined) {
      setValue("unreadCount", unreadMessages, { shouldValidate: true });
    }
    if (unreadObservations !== undefined) {
      setValue("unreadobservations", unreadObservations, { shouldValidate: true });
    }
  }, [unreadMessages, unreadObservations, setValue]);

  const unreadCount = watch('unreadCount');
  const unreadObservationsCount = watch('unreadobservations');

  // Pathname to highlight the active link
  const pathname = usePathname();

  // Handle link click to refetch counts
  const handleLinkClick = () => {
    refetch();
    refetchObservations();
  };

  return (
    <>
      {linksscholar.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        const renderMessageBadge = link.name === 'Mensajes' && unreadCount > 0;
        const renderObservationBadge = link.name === 'Proyectos' && unreadObservationsCount > 0;

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
              badgeContent={link.name === 'Mensajes' ? unreadCount : unreadObservationsCount}
              color="error"
              invisible={!(renderMessageBadge || renderObservationBadge)}
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
