"use client";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileActions from "@/components/profile/ProfileActions";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border-2 border-purple-500/30 bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <ProfileHeader title="Perfil de Usuario" />

          <ProfileContent user={user} />

          <div className="px-6 pb-6">
            <ProfileActions onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}

