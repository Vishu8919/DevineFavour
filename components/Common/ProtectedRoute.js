'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, role }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || (role && user.role !== role)) {
      router.replace('/login');
    }
  }, [user, role, router]);

  // Don't render anything while redirecting
  if (!user || (role && user.role !== role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
