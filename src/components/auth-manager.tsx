'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createUserDoc } from '@/lib/user';
import { Loader } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup'];
const PUBLIC_ROUTES = ['/'];

export function AuthManager({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  useEffect(() => {
    if (isUserLoading || isCreatingDoc) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (user) {
      // User is logged in
      const userDocRef = doc(firestore, 'users', user.uid);
      
      setIsCreatingDoc(true);
      getDoc(userDocRef).then((docSnap) => {
        if (!docSnap.exists()) {
          // Create user document if it doesn't exist
          console.log('User document does not exist, creating...');
          createUserDoc(firestore, user, { name: user.displayName });
        }
        
        if (isAuthRoute) {
          // Redirect from auth pages to dashboard if logged in
          router.replace('/dashboard');
        }
      }).finally(() => {
          setIsCreatingDoc(false);
      });

    } else {
      // User is not logged in
      if (!isAuthRoute && !isPublicRoute) {
        // Redirect to login if trying to access a protected page
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, pathname, router, firestore, isCreatingDoc]);

  if (isUserLoading || isCreatingDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
