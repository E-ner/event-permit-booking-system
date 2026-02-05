import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  Calendar,
  LogOut,
  Menu,
  Bell,
  User,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["AUTHORITY", "VENUE_MANAGER", "ORGANIZER"],
    },
    {
      icon: Building2,
      label: "Venues",
      path: "/venues",
      roles: ["AUTHORITY", "VENUE_MANAGER", "ORGANIZER"],
    },
    {
      icon: Calendar,
      label: "Bookings",
      path: "/bookings",
      roles: ["AUTHORITY", "VENUE_MANAGER", "ORGANIZER"],
    },
    {
      icon: FileCheck,
      label: "Permits",
      path: "/permits",
      roles: ["AUTHORITY", "ORGANIZER"],
    },
    {
      icon: Users,
      label: "Users",
      path: "/users",
      roles: ["AUTHORITY"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes((user?.role || "").toUpperCase())
  );
  const NavLinks = () => (
    <>
      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <h2 className="font-bold text-lg">EPVBS Rwanda</h2>
                    <p className="text-sm text-muted-foreground">
                      Event Management
                    </p>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    <NavLinks />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block">
              <h1 className="font-bold text-xl">
                Event Permit & Venue Booking System
              </h1>
              <p className="text-sm text-muted-foreground">
                Republic of Rwanda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role?.replace("_", " ")}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] border-r bg-white">
          <nav className="p-4 space-y-2">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
