// Author: rauneetsingh1@gmail.com
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
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      // Still waiting for Firebase Auth to initialize
      return;
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (user) {
      // User is authenticated
      const userDocRef = doc(firestore, 'users', user.uid);
      
      getDoc(userDocRef).then((docSnap) => {
        if (!docSnap.exists()) {
          // If the user document doesn't exist, create it.
          // This is a one-time operation for new sign-ups.
          console.log('User document does not exist, creating...');
          createUserDoc(firestore, user, { name: user.displayName });
        }
        
        if (isAuthRoute) {
          // If logged in, redirect away from login/signup to the dashboard.
          router.replace('/dashboard');
        } else {
          // If on any other route, we're done processing.
          setIsProcessing(false);
        }
      }).catch(error => {
        console.error("Error checking/creating user document:", error);
        // Even if there's an error, we should stop processing to avoid getting stuck.
        setIsProcessing(false);
      });

    } else {
      // User is not authenticated
      if (!isAuthRoute && !isPublicRoute) {
        // If trying to access a protected page, redirect to login.
        router.replace('/login');
      } else {
        // If on a public or auth route, we're done processing.
        setIsProcessing(false);
      }
    }
    // The dependency array ensures this effect runs only when auth state changes.
  }, [user, isUserLoading, pathname, router, firestore]);

  if (isUserLoading || isProcessing) {
    // Show a global loader while we verify auth and handle initial routing.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
