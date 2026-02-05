import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { VenuesPage } from "./pages/VenuesPage";
import { BookingsPage } from "./pages/BookingsPage";
import { PermitsPage } from "./pages/PermitsPage";
import { UsersPage } from "./pages/UsersPage";
import { HomePage } from "./pages/HomePage";
import { Toaster } from "./components/ui/sonner";
import { RegisterPage } from "./components/RegisterPage";
import TestApi from "../test/TestApi";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/venues"
            element={
              <ProtectedRoute
                allowedRoles={["VENUE_MANAGER", "ORGANIZER", "AUTHORITY"]}
              >
                <DashboardLayout>
                  <VenuesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute
                allowedRoles={["VENUE_MANAGER", "ORGANIZER", "AUTHORITY"]}
              >
                <DashboardLayout>
                  <BookingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/permits"
            element={
              <ProtectedRoute allowedRoles={["AUTHORITY", "ORGANIZER"]}>
                <DashboardLayout>
                  <PermitsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["AUTHORITY"]}>
                <DashboardLayout>
                  <UsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
