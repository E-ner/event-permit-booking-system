import { useEffect, useState } from "react";
import api from "../utils/Axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await api.get("/users/me");
        setCurrentUserId(meRes.data.sub || meRes.data.id);

        const res = await api.get("/users");
        const filteredUsers = res.data.filter((element : any) => element.role !== "AUTHORITY")
        setUsers(
          Array.isArray(res.data) ? filteredUsers : filteredUsers.items || []
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Create user (AUTHORITY only)
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "VENUE_MANAGER",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post("/users/create", createForm);
      if (res.status === 201 || res.status === 200) {
        toast.success("User created");
        const r = await api.get("/users");
        setUsers(Array.isArray(r.data) ? r.data : r.data.items || []);
      } else {
        throw new Error("Failed to create");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3 p-2">
                <Label>Username</Label>
                <Input
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  required
                />
                <Label>Email</Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  required
                />
                <Label>Role</Label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="VENUE_MANAGER">VENUE_MANAGER</option>
                </select>
                <div className="flex justify-end">
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.id}
                    className={currentUserId === u.id ? "bg-blue-50" : ""}
                  >
                    <TableCell>{u.id}</TableCell>
                    <TableCell>
                      {u.username || u.name || "-"}
                      {currentUserId === u.id && (
                        <Badge className="ml-2 bg-blue-600">You</Badge>
                      )}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{(u.role || "").toString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {u?.role !== "AUTHORITY" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(u.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
