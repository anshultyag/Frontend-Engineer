"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";

const DashboardPage = dynamic(() => import("@/app/dashboard/page"), {
  loading: () => <LoadingSpinner message="Loading Dashboard..." />,
});

const LoginPage = dynamic(() => import("@/app/login/page"), {
  loading: () => <LoadingSpinner message="Loading Login..." />,
});

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
    </Suspense>
  );
}
