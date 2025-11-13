import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, Mail, Award, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminService.getAllUsers().then(setUsers);
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await adminService.deleteUser(id);
    setUsers(users.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  const list = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (role) => {
    return {
      ADMIN: "bg-red-200 text-red-800",
      SELLER: "bg-blue-200 text-blue-800",
      USER: "bg-green-200 text-green-800",
    }[role];
  };

  return (
    <div className="space-y-6">
      <h2>User Management</h2>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {list.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3>
                    {u.firstName} {u.lastName}
                  </h3>
                  <Badge className={roleColor(u.role)}>{u.role}</Badge>
                  {u.sellerStatus && (
                    <Badge variant="secondary">{u.sellerStatus}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {u.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </span>

                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-emerald-600" />
                    {u.carbonPoints} points
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                className="text-red-600"
                onClick={() => deleteUser(u.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
