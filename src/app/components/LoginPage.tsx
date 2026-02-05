import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Building2, Shield, UserCog, Users } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="flex flex-col justify-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Event Permit & Venue Booking System
            </h1>
            <p className="text-xl text-gray-600">Republic of Rwanda</p>
          </div>
          <p className="text-gray-700 text-lg">
            Streamlining event management and venue bookings across Rwanda with
            digital efficiency and transparency.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Centralized venue discovery with geolocation</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Online permit application and approval</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <span>Real-time status tracking and notifications</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.rw"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <span
                    className="text-primary cursor-pointer underline"
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </span>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
