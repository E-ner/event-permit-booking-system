import { useState, useEffect } from "react";
import api from "../utils/Axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Star,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { venue_img_data } from "../data/data";

export function VenuesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  
  // Data State
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);

  // Booking form state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [attendees, setAttendees] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");

  // Venue Management State
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    capacity: "",
    pricePerDay: "",
    amenities: "",
    images: "",
  });

  // Load Venues
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/venues");
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setVenues(data);
      } catch (err) {
        console.warn("Could not load venues from backend");
      }
    };
    load();
  }, []);

  const districts = ["Gasabo", "Kicukiro", "Nyarugenge"];

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      districtFilter === "all" || venue.district === districtFilter;
    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "small" && venue.capacity < 500) ||
      (capacityFilter === "medium" &&
        venue.capacity >= 500 &&
        venue.capacity < 5000) ||
      (capacityFilter === "large" && venue.capacity >= 5000);

    return matchesSearch && matchesDistrict && matchesCapacity;
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;
    try {
      const payload = {
        venueId: selectedVenue.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        eventName: selectedVenue.name,
        details: purpose,
        expectedAttendees: Number(attendees || 0),
      };
      const res = await api.post("/bookings", payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Booking request submitted successfully!");
        setStartDate("");
        setEndDate("");
        setAttendees("");
        setPurpose("");
        navigate("/bookings");
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error("Venue already booked on these dates");
      } else {
        toast.error("Failed to submit booking");
      }
    }
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        description: form.description,
        capacity: Number(form.capacity),
      };
      const res = await api.post("/venues", payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Venue created");
        const r = await api.get("/venues");
        setVenues(Array.isArray(r.data) ? r.data : r.data.items || []);
        resetForm();
      }
    } catch (err: any) {
      toast.error("Failed to create venue");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenueId) return;
    setEditing(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        description: form.description,
        capacity: Number(form.capacity),
      };
      const res = await api.patch(`/venues/${editingVenueId}`, payload);
      if (res.status === 200) {
        toast.success("Venue updated");
        const r = await api.get("/venues");
        setVenues(Array.isArray(r.data) ? r.data : r.data.items || []);
        resetForm();
      }
    } catch (err: any) {
      toast.error("Failed to update venue");
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await api.delete(`/venues/${venueId}`);
      toast.success("Venue deleted successfully!");
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err: any) {
      toast.error("Failed to delete venue");
    }
  };

  const resetForm = () => {
    setForm({
      name: "", address: "", latitude: "", longitude: "",
      description: "", capacity: "", pricePerDay: "",
      amenities: "", images: "",
    });
    setEditingVenueId(null);
  };

  const startEditVenue = (venue: any) => {
    setForm({
      name: venue.name,
      address: venue.address,
      latitude: String(venue.latitude),
      longitude: String(venue.longitude),
      description: venue.description || "",
      capacity: String(venue.capacity || ""),
      pricePerDay: "",
      amenities: "",
      images: "",
    });
    setEditingVenueId(venue.id);
  };

  const calculateDistance = (lat: number, lng: number) => {
    const cityCenter = { lat: -1.9536, lng: 30.0606 };
    const distance = Math.sqrt(Math.pow(lat - cityCenter.lat, 2) + Math.pow(lng - cityCenter.lng, 2)) * 111;
    return distance.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Venue Discovery</h1>
        <p className="text-muted-foreground">Find and book the perfect venue for your event</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger><SelectValue placeholder="Capacity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (&lt;500)</SelectItem>
                <SelectItem value="medium">Medium (500-5000)</SelectItem>
                <SelectItem value="large">Large (5000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <div className="p-4 flex justify-end">
          {user?.role.toUpperCase() === "VENUE_MANAGER" && (
            <Dialog>
              <DialogTrigger asChild><Button>Create Venue</Button></DialogTrigger>
              <DialogContent className="max-w-xl">
                <form onSubmit={handleCreateVenue} className="space-y-3 p-4">
                  <h3 className="text-lg font-semibold">Create New Venue</h3>
                  <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
                    <Input placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
                  </div>
                  <Input placeholder="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                  <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Button type="submit" disabled={creating} className="w-full">{creating ? "Creating..." : "Create Venue"}</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue, index) => {
          const venueImage = venue_img_data[index % venue_img_data.length];

          return (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={venueImage}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 text-gray-900">
                    <Navigation className="w-3 h-3 mr-1" />
                    {calculateDistance(venue.latitude, venue.longitude)} km
                  </Badge>
                </div>
                {user?.role === "VENUE_MANAGER" && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" onClick={() => startEditVenue(venue)}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <form onSubmit={handleUpdateVenue} className="space-y-3 p-4">
                          <h3 className="text-lg font-semibold">Update Venue</h3>
                          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                          <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                          <Button type="submit" disabled={editing} className="w-full">{editing ? "Updating..." : "Update"}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteVenue(venue.id)}>Delete</Button>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" /> {venue.address}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{venue.description}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{venue.capacity.toLocaleString()} capacity</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedVenue(venue)}>
                      <Calendar className="w-4 h-4 mr-2" /> View Details & Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedVenue && (
                      <div className="space-y-4">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedVenue.name}</DialogTitle>
                        </DialogHeader>
                        <img src={venueImage} alt={selectedVenue.name} className="w-full h-64 object-cover rounded-lg" />
                        <p className="text-sm text-muted-foreground">{selectedVenue.description}</p>
                        
                        {user?.role?.toUpperCase() === "ORGANIZER" ? (
                          <form onSubmit={handleBooking} className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">Book This Venue</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                              </div>
                            </div>
                            <Button type="submit" className="w-full">Submit Booking Request</Button>
                          </form>
                        ) : (
                          <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                            Please log in as an Organizer to book this venue.
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}