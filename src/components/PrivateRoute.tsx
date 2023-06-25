import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function PrivateRoute({ children }: React.PropsWithChildren<{}>) {
  const { user } = useUser();
  const location = useLocation();

  if (user === undefined) {
    return null;
  }
  else if (user) {
    return <>{children}</>;
  }

  const url = location.pathname + location.search + location.hash;
  return <Navigate to="/login" state={{next: url}} />
}