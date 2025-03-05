"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../_actions/adminActions";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading)
    return (
      <p className="text-center text-muted-foreground">Loading users...</p>
    );

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        User List
      </h2>

      {users?.length ? (
        <div className="border rounded-xl shadow-md overflow-hidden">
          <Table className="w-full">
            <TableHeader className="bg-muted text-muted-foreground">
              <TableRow>
                <TableHead className="px-4 py-3 text-left">Name</TableHead>
                <TableHead className="px-4 py-3 text-left">
                  Expiry Date
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    index % 2 === 0 ? "bg-muted/50" : "bg-background"
                  )}
                >
                  <TableCell className="px-4 py-3">{user.name}</TableCell>
                  <TableCell className="px-4 py-3">
                    {user.expiryDate
                      ? new Date(user.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {user.status && (
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          user.status === "active"
                            ? "bg-green-500/20 text-green-600"
                            : user.status === "expired"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-yellow-500/20 text-yellow-600"
                        )}
                      >
                        {user.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No users found.</p>
      )}
    </div>
  );
}
