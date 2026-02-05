import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../utils/Axios";
import {
  Building2,
  Calendar,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function DashboardPage() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [permits, setPermits] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const resV = await api.get("/venues");
        setVenues(Array.isArray(resV.data) ? resV.data : resV.data.items || []);
      } catch (e) {
        console.warn("Could not load venues");
      }
      try {
        const resB = await api.get("/bookings");
        setBookings(
          Array.isArray(resB.data) ? resB.data : resB.data.items || []
        );
      } catch (e) {
        console.warn("Could not load bookings");
      }
      try {
        const resP = await api.get("/permits");
        setPermits(
          Array.isArray(resP.data) ? resP.data : resP.data.items || []
        );
      } catch (e) {
        console.warn("Could not load permits");
      }
    };
    load();
  }, []);

  const stats = {
    authority: [
      {
        label: "Pending Permits",
        value: permits.filter(
          (p) => (p.status || "").toLowerCase() === "pending"
        ).length,
        icon: Clock,
        color: "yellow",
      },
      {
        label: "Approved Permits",
        value: permits.filter(
          (p) => (p.status || "").toLowerCase() === "approved"
        ).length,
        icon: CheckCircle,
        color: "green",
      },
      {
        label: "Rejected Permits",
        value: permits.filter(
          (p) => (p.status || "").toLowerCase() === "declined"
        ).length,
        icon: XCircle,
        color: "red",
      },
      {
        label: "Total Applications",
        value: permits.length,
        icon: FileCheck,
        color: "blue",
      },
    ],
    venue_manager: [
      {
        label: "My Venues",
        value: venues.length,
        icon: Building2,
        color: "blue",
      },
      {
        label: "Pending Bookings",
        value: bookings.filter(
          (b) => (b.status || "").toLowerCase() === "pending"
        ).length,
        icon: Clock,
        color: "yellow",
      },
      {
        label: "Confirmed Bookings",
        value: bookings.filter(
          (b) => (b.status || "").toLowerCase() === "approved"
        ).length,
        icon: CheckCircle,
        color: "green",
      },
      {
        label: "Monthly Revenue",
        value: "$26K",
        icon: TrendingUp,
        color: "green",
      },
    ],
    organizer: [
      {
        label: "My Bookings",
        value: bookings.length,
        icon: Calendar,
        color: "blue",
      },
      {
        label: "Pending Approval",
        value: bookings.filter(
          (b) => (b.status || "").toLowerCase() === "pending"
        ).length,
        icon: Clock,
        color: "yellow",
      },
      {
        label: "My Permits",
        value: permits.length,
        icon: FileCheck,
        color: "purple",
      },
      {
        label: "Upcoming Events",
        value: "2",
        icon: TrendingUp,
        color: "green",
      },
    ],
  };

  const currentStats = stats[user?.role || "ORGANIZER"] || [];

  const bookingData = [
    { month: "Jan", bookings: 12 },
    { month: "Feb", bookings: 19 },
    { month: "Mar", bookings: 15 },
    { month: "Apr", bookings: 25 },
    { month: "May", bookings: 22 },
    { month: "Jun", bookings: 30 },
  ];

  const statusData = [
    {
      name: "Approved",
      value: bookings.filter(
        (b) => (b.status || "").toLowerCase() === "approved"
      ).length,
    },
    {
      name: "Pending",
      value: bookings.filter(
        (b) => (b.status || "").toLowerCase() === "pending"
      ).length,
    },
    {
      name: "Rejected",
      value: bookings.filter(
        (b) => (b.status || "").toLowerCase() === "declined"
      ).length,
    },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Monthly booking statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>Booking status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 w-full">
                {statusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest bookings and permit applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.venue.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.venue.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      booking.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
