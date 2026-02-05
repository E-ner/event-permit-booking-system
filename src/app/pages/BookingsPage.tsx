import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/Axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

export function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const [permitType, setPermitType] = useState<string>("noise_control");
  const [permitDetails, setPermitDetails] = useState<string>("");

  const isVenueManager = user?.role.toUpperCase() === "VENUE_MANAGER";
  const isOrganizer = user?.role.toUpperCase() === "ORGANIZER";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/bookings");
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setBookings(
          data.map((b: any) => ({
            ...b,
            status: (b.status || "PENDING").toLowerCase(),
          }))
        );
      } catch (err) {
        toast.error("Failed to load bookings");
      }
    };
    load();
  }, []);

  const handleApprove = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: "APPROVED" });
      toast.success("Booking approved successfully!");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      toast.error("Failed to approve booking");
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: "DECLINED" });
      toast.success("Booking rejected.");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "declined" } : b))
      );
    } catch (err) {
      toast.error("Failed to reject booking");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking deleted successfully!");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      toast.error("Failed to delete booking");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
    };
    const variantClass = variants[status] || "bg-gray-100 text-gray-800";
    return (
      <Badge className={variantClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">
            View and manage venue booking requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Calendar className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected Bookings
            </CardTitle>
            <X className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {bookings.filter((b) => b.status === "declined").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Complete list of venue booking requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Venue</TableHead>
                {!isOrganizer && <TableHead>Organizer</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    #{booking.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.venue.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.purpose}
                      </p>
                    </div>
                  </TableCell>
                  {!isOrganizer && (
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {booking.organizer?.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.organizer?.email}
                        </p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">
                        to {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {booking.expectedAttendees?.toLocaleString() ?? "0"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Dialog>
                        <div className="flex items-center gap-2">
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setPermitType("noise_control");
                                setPermitDetails("");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          {booking.status === "approved" &&
                          isOrganizer &&
                          booking.permits.length == 0 ? (
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setPermitType("noise_control");
                                  setPermitDetails("");
                                }}
                              >
                                Apply Permit
                              </Button>
                            </DialogTrigger>
                          ) : (
                            <></>
                          )}
                        </div>

                        <DialogContent className="max-w-2xl">
                          {selectedBooking && (
                            <>
                              <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                                <DialogDescription>
                                  ID: {selectedBooking.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Venue</Label>
                                    <p className="text-lg font-semibold">
                                      {selectedBooking.venue.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedBooking.status)}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Event Purpose</Label>
                                  <p className="mt-1">
                                    {selectedBooking.purpose ||
                                      selectedBooking.venue.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Start Date</Label>
                                    <p className="mt-1">
                                      {new Date(
                                        selectedBooking.startDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>End Date</Label>
                                    <p className="mt-1">
                                      {new Date(
                                        selectedBooking.endDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                {/* PERMIT FORM - Fixed the status check to lowercase */}
                                {selectedBooking.status.toLowerCase() ===
                                  "approved" &&
                                  isOrganizer && (
                                    <div className="pt-4 border-t space-y-3">
                                      <h4 className="font-semibold">
                                        Apply for Permit
                                      </h4>
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-sm">
                                            Permit Type
                                          </Label>
                                          <select
                                            value={permitType}
                                            onChange={(e) =>
                                              setPermitType(e.target.value)
                                            }
                                            className="w-full mt-1 p-2 border rounded-md"
                                          >
                                            {/* These values now match your API error list exactly */}
                                            <option value="noise_control">
                                              Noise Control
                                            </option>
                                            <option value="public_safety">
                                              Public Safety
                                            </option>
                                            <option value="alcohol_service">
                                              Alcohol Service
                                            </option>
                                            <option value="public_health">
                                              Public Health
                                            </option>
                                            <option value="other">Other</option>
                                          </select>
                                        </div>
                                        <div>
                                          <Label className="text-sm">
                                            Details
                                          </Label>
                                          <textarea
                                            value={permitDetails}
                                            onChange={(e) =>
                                              setPermitDetails(e.target.value)
                                            }
                                            className="w-full mt-1 p-2 border rounded-md"
                                            rows={3}
                                            placeholder="Provide details for the permit application..."
                                          />
                                        </div>
                                        <Button
                                          className="w-full"
                                          onClick={async () => {
                                            if (!permitDetails.trim()) {
                                              toast.error(
                                                "Please provide permit details"
                                              );
                                              return;
                                            }
                                            try {
                                              await api.post("/permits", {
                                                bookingId: selectedBooking.id,
                                                type: permitType,
                                                details: permitDetails,
                                              });
                                              toast.success(
                                                "Permit application submitted"
                                              );
                                              setPermitDetails("");
                                            } catch (err: any) {
                                              toast.error(
                                                "Failed to submit permit application"
                                              );
                                            }
                                          }}
                                        >
                                          Submit Permit Application
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Quick Action Buttons for Venue Manager */}
                      {booking.status === "pending" && isVenueManager && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(booking.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(booking.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {isOrganizer && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
