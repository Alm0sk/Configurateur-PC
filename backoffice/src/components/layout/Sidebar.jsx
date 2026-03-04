import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Cpu,
  Building2,
  Settings,
  LogOut,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/users", icon: Users },
  { name: "Catégories", href: "/categories", icon: FolderTree },
  { name: "Composants", href: "/components", icon: Cpu },
  { name: "Partenaires", href: "/partners", icon: Building2 },
  { name: "Configurations", href: "/configurations", icon: Monitor },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  const currentUserId = user?.id || user?._id;
  const navigationItems =
    user?.role === "admin"
      ? navigation
      : navigation.filter((item) => item.href !== "/users");

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Cpu className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">ConfigPC</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        {user?.role !== "admin" && currentUserId && (
          <NavLink
            to={`/users/${currentUserId}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <Users className="h-5 w-5" />
            Mon profil
          </NavLink>
        )}
      </nav>

      {/* User info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.prenom?.[0]}
            {user?.nom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
