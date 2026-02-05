import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import api from "../utils/Axios";
import { Building2, UserCog, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const {user} = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "ORGANIZER",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submission started");
    e.preventDefault();

    // Public registration must always be ORGANIZER
    formData.role = "ORGANIZER";

    setIsLoading(true);

    try {
      const response = await api.post("/users/register", formData);

      if (response?.status !== 201 && response?.status !== 200) {
        throw new Error("Registration failed");
      }

      toast.success("Account created successfully. You can now sign in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Left - Branding */}
        <div className="flex flex-col justify-center space-y-6 p-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Event Permit & Venue Booking System
            </h1>
            <p className="text-xl text-gray-600">Republic of Rwanda</p>
          </div>

          <p className="text-lg text-gray-700">
            Create an account to access Rwanda’s centralized event permitting
            and venue booking platform.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Event Organizers</span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-green-600" />
              <span>Authorities & Approvals</span>
            </div>
            <div className="flex items-center gap-3">
              <UserCog className="w-5 h-5 text-yellow-600" />
              <span>Venue Management</span>
            </div>
          </div>
        </div>

        {/* Right - Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in the details below to register
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johnorganizer"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="organizer@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <span
                  className="text-primary cursor-pointer underline"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
