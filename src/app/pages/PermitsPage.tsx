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
import { Textarea } from "../components/ui/textarea";
import {
  FileCheck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";


export function PermitsPage() {
  const { user } = useAuth();
  const [permits, setPermits] = useState<any[]>([]);
  const [selectedPermit, setSelectedPermit] = useState<any | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/permits");
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setPermits(
          data.map((p: any) => ({
            ...p,
            status: (p.status || "").toLowerCase(),
          }))
        );
      } catch (err) {
        console.error("Failed loading permits", err);
      }
    };
    load();
  }, []);

  const handleApprove = async (permitId: string) => {
    try {
      await api.patch(`/permits/${permitId}/status`, {
        status: "APPROVED",
        authorityNotes: reviewComment,
      });
      toast.success("Permit approved successfully!");
      setPermits((prev) =>
        prev.map((p) => (p.id === permitId ? { ...p, status: "approved" } : p))
      );
      setReviewComment("");
    } catch (err) {
      toast.error("Failed to approve permit");
    }
  };

  const handleReject = async (permitId: string) => {
    console.log("reached the function")
    if (!reviewComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await api.patch(`/permits/${permitId}/status`, {
        status: "DECLINED",
        authorityNotes: reviewComment,
      });
      toast.success("Permit rejected.");
      setPermits((prev) =>
        prev.map((p) => (p.id === permitId ? { ...p, status: "declined" } : p))
      );
      setReviewComment("");
    } catch (err) {
      toast.error("Failed to reject permit");
    }
  };

  const handleDeletePermit = async (permitId: string) => {
    if (!window.confirm("Are you sure you want to delete this permit?")) return;
    try {
      await api.delete(`/permits/${permitId}`);
      toast.success("Permit deleted successfully!");
      setPermits((prev) => prev.filter((p) => p.id !== permitId));
    } catch (err) {
      toast.error("Failed to delete permit");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { bg: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { bg: "bg-green-100 text-green-800", icon: CheckCircle },
      declined: { bg: "bg-red-100 text-red-800", icon: XCircle },
    };
    const variant = variants[status as keyof typeof variants];
    const Icon = variant.icon;
    return (
      <Badge className={variant.bg}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getNoiseLevelBadge = (level: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={variants[level as keyof typeof variants]}>
        {level.toUpperCase()}
      </Badge>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permit Management</h1>
          <p className="text-muted-foreground">
            Review and approve event permit applications
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <FileCheck className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{permits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PENDING Review
            </CardTitle>
            <Clock className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {permits.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {permits.filter((p) => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {permits.filter((p) => p.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permit Applications</CardTitle>
          <CardDescription>
            All event permit applications and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permit ID</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendees</TableHead>
                {/* can come in the update */}
                {/* <TableHead>Noise Level</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-medium">
                    #{permit.id.slice(10, -20).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{permit.booking.eventName}</p>
                      <p className="text-sm text-muted-foreground">
                        {permit?.applicant?.username || ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{permit.type}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{permit.booking.venue.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {permit.booking.venue.address}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(permit.booking.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {permit.booking.expectedAttendees.toLocaleString()}
                  </TableCell>
                  {/* CAN COME IN THE UPDATE */}
                  {/* <TableCell>{getNoiseLevelBadge(permit.noiseLevel)}</TableCell> */}
                  <TableCell>{getStatusBadge(permit.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPermit(permit);
                              setReviewComment("");
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          {selectedPermit && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-2xl">
                                  {selectedPermit.eventName}
                                </DialogTitle>
                                <DialogDescription>
                                  Permit ID: {selectedPermit.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Event Type
                                    </Label>
                                    <p className="mt-1 font-semibold">
                                      {selectedPermit.booking.eventName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Current Status
                                    </Label>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedPermit.status)}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Event Description
                                  </Label>
                                  <p className="mt-1 text-muted-foreground">
                                    {selectedPermit.booking.description}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Venue
                                    </Label>
                                    <p className="mt-1">
                                      {selectedPermit.booking.venue.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedPermit.booking.venue.address}{" "}
                                      District
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Event Date
                                    </Label>
                                    <p className="mt-1 font-semibold">
                                      {new Date(
                                        selectedPermit.booking.endDate
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Expected Attendees
                                    </Label>
                                    <p className="mt-1 text-lg font-semibold">
                                      {selectedPermit.booking.expectedAttendees.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Booking ID
                                    </Label>
                                    <p className="mt-1 font-mono text-sm">
                                      {selectedPermit.booking.id}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Security Plan
                                  </Label>
                                  <p className="mt-1 text-muted-foreground">
                                    {selectedPermit.securityPlan}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Organizer Information
                                  </Label>
                                  <p className="mt-1">
                                    {selectedPermit.organizerName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Application submitted:{" "}
                                    {new Date(
                                      selectedPermit.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                {selectedPermit.reviewedBy && (
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <Label className="text-sm font-medium">
                                      Review Information
                                    </Label>
                                    <p className="mt-1 text-sm">
                                      Reviewed by: {selectedPermit.reviewedBy}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        selectedPermit.reviewedAt!
                                      ).toLocaleString()}
                                    </p>
                                    {selectedPermit.comments && (
                                      <p className="mt-2 text-sm">
                                        {selectedPermit.comments}
                                      </p>
                                    )}
                                  </div>
                                )}
                                {selectedPermit.status === "pending" &&
                                  user?.role.toUpperCase() === "AUTHORITY" && (
                                    <div className="space-y-4 pt-4 border-t">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Review Comments
                                        </Label>
                                        <Textarea
                                          placeholder="Add your review comments here..."
                                          value={reviewComment}
                                          onChange={(e) =>
                                            setReviewComment(e.target.value)
                                          }
                                          className="mt-2"
                                          rows={3}
                                        />
                                      </div>
                                      <div className="flex gap-3">
                                        <Button
                                          className="flex-1"
                                          onClick={() =>
                                            handleApprove(selectedPermit.id)
                                          }
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve Permit
                                        </Button>
                                        <Button
                                          className="flex-1"
                                          variant="destructive"
                                          onClick={() =>
                                            handleReject(selectedPermit.id)
                                          }
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject Permit
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      {permit.status === "pending" &&
                        (user?.role.toUpperCase()) === "AUTHORITY" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(permit.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedPermit(permit);
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      {user?.role.toUpperCase() === "ORGANIZER" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePermit(permit.id)}
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

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
