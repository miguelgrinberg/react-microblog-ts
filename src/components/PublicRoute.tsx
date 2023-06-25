import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function PublicRoute({ children }: React.PropsWithChildren<{}>) {
  const { user } = useUser();

  if (user === undefined) {
    return null;
  }
  else if (user) {
    return <Navigate to="/" />
  }
  else {
    return <>{children}</>;
  }
}