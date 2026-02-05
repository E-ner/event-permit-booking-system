import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/Axios";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  MapPin,
  Users,
  Navigation,
  Calendar,
  Search,
  Star,
  ArrowRight,
  ShieldCheck,
  Building2,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { homePageImage, venue_img_data } from "../data/data"; 

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venues, setVenues] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/venues");
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setVenues(data);
      } catch (err) {
        console.warn("Could not load venues");
      }
    };
    load();
  }, []);

  const districts = ["Gasabo", "Kicukiro", "Nyarugenge"];

  const filteredVenues = venues?.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      districtFilter === "all" || venue.address?.includes(districtFilter);
    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "small" && venue.capacity < 500) ||
      (capacityFilter === "medium" &&
        venue.capacity >= 500 &&
        venue.capacity < 5000) ||
      (capacityFilter === "large" && venue.capacity >= 5000);

    return matchesSearch && matchesDistrict && matchesCapacity;
  });

  const calculateDistance = (lat: number, lng: number) => {
    const cityCenter = { lat: -1.9536, lng: 30.0606 };
    const distance =
      Math.sqrt(
        Math.pow(lat - cityCenter.lat, 2) + Math.pow(lng - cityCenter.lng, 2)
      ) * 111;
    return distance.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Event<span className="text-primary">Permit</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="rounded-full px-6"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="rounded-full px-6"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={homePageImage || "https://images.unsplash.com/photo-1765706729543-348de9e073b1?q=80&w=1976&auto=format&fit=crop"}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Rwanda Venue"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative container mx-auto px-6 text-center text-white z-10">
          <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-1">
            Official Event Licensing Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Seamless Events in{" "}
            <span className="text-primary-foreground underline decoration-primary">
              Rwanda
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-light">
            Book premium venues and process your official event permits in one
            integrated digital workflow.
          </p>

          {/* Search Bar - Floating */}
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search venue name or district..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none bg-black/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1">
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-[160px] border-none bg-black rounded-xl h-full py-6">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="rounded-xl px-8 py-6 shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 relative z-20">
        {/* Filters & Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full md:w-auto">
            <Button
              variant={capacityFilter === "all" ? "default" : "secondary"}
              onClick={() => setCapacityFilter("all")}
              className="rounded-full"
            >
              All Venues
            </Button>
            <Button
              variant={capacityFilter === "small" ? "default" : "secondary"}
              onClick={() => setCapacityFilter("small")}
              className="rounded-full"
            >
              Small (0-500)
            </Button>
            <Button
              variant={capacityFilter === "large" ? "default" : "secondary"}
              onClick={() => setCapacityFilter("large")}
              className="rounded-full"
            >
              Large (5000+)
            </Button>
          </div>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Showing {filteredVenues.length} available locations
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue , i) => {
            const venue_image = venue_img_data[i%venue_img_data.length]
            return (
              <Card
              key={venue.id}
              className="group border-none shadow-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={venue_image || "https://images.unsplash.com/photo-1765706729543-348de9e073b1?q=80&w=1976&auto=format&fit=crop"}
                  alt={venue.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-black backdrop-blur-md border-none shadow-sm">
                    <Navigation className="w-3 h-3 mr-1 text-primary" />
                    {calculateDistance(venue.latitude, venue.longitude)} km from
                    center
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {venue.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 font-medium text-slate-500">
                      <MapPin className="w-4 h-4 text-primary" />
                      {venue.address}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 border-y py-3 border-slate-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">
                      {venue.capacity.toLocaleString()} Capacity
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-l pl-4">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>

                <Button
                  className="w-full rounded-xl py-6 text-md font-semibold group"
                  onClick={() =>
                    navigate("/login", { state: { venueId: venue.id } })
                  }
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve Venue
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Button>
              </CardContent>
            </Card>
            )
})}
        </div>
      </main>

{
  user?.role == "VENUE_MANAGER" ? (
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-black rounded-[2.5rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Are you a Venue Owner?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join Rwanda's largest event ecosystem. List your space, manage
              bookings, and help organizers get their permits faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/register")}
                size="lg"
                className="rounded-full px-8 bg-white text-black border border-slate-300/20 cursor-pointer hover:bg-black hover:text-white duration-200"
              >
                Register
              </Button>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-black  border border-white/20 cursor-pointer hover:bg-black hover:text-white duration-200"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>
  ) : 
  (
    <></>
  )
}
{
  venues.length == 0 && (
    <div className="flex items-center justify-center p-10">
      <h1 className="text-black/50">Events appears here ...</h1>
    </div>
  )
}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold">EventPermit Rwanda</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; 2026 Republic of Rwanda. Digital Transformation Initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}
