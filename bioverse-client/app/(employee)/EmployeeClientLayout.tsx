'use client';

import { useSessionTimeout } from '@/app/hooks/useSessionTimeout';
import { PropsWithChildren, useEffect } from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface EmployeeClientLayoutProps {
  userId: string;
  isAdmin: boolean;
  employeeRole: BV_AUTH_TYPE;
}

export default function EmployeeClientLayout({
  children,
  userId,
  isAdmin,
  employeeRole,
}: PropsWithChildren<EmployeeClientLayoutProps>) {

  useSessionTimeout({
      userId,
      isAdmin,
      onTimeout: () => {
        console.log('Session timed out');
      },
      employeeRole,
  });

  return <>{children}</>;
}
