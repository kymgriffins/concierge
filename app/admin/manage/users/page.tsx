"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable, { Column } from "@/components/ui/data-table/data-table";
import { useToast } from "@/components/ui/toast";
import { RefreshCw, UserCheck, Users, Shield, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("staff"); // Default to staff (agents and super_admins)
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error("Error loading profiles:", err);
      toast.showToast({
        title: "Error",
        description: "Failed to load user profiles",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function assignRole(id: string, role: string) {
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: id, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update role");
      }

      await load();
      toast.showToast({
        title: "Success",
        description: `User role updated to ${role}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating role:", err);
      toast.showToast({
        title: "Error",
        description: err.message || "Failed to update user role",
        type: "error",
      });
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete user");
      }

      await load();
      toast.showToast({
        title: "Success",
        description: "User deleted successfully",
        type: "success",
      });
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.showToast({
        title: "Error",
        description: err.message || "Failed to delete user",
        type: "error",
      });
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      super_admin: "default",
      agent: "secondary",
      traveller: "outline",
    } as const;

    const icons = {
      super_admin: <Shield className="w-3 h-3 mr-1" />,
      agent: <UserCheck className="w-3 h-3 mr-1" />,
      traveller: <Users className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant={variants[role as keyof typeof variants] || "outline"}>
        {icons[role as keyof typeof icons]}
        {role.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const columns: Column<Profile>[] = [
    {
      key: "id",
      header: "ID",
      width: "w-20",
      meta: { hideOnMobile: true },
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "role",
      header: "Role",
      filterable: true,
      cell: (row) => getRoleBadge(row.role),
      meta: {
        mobileCard: {
          label: "Role",
          value: (row) => getRoleBadge(row.role),
        },
      },
    },
    {
      key: "created_at",
      header: "Created",
      cell: (row) => new Date(row.created_at).toLocaleDateString(),
      meta: { hideOnMobile: true },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => assignRole(row.id, "agent")}
            disabled={row.role === "agent"}
            className="text-xs"
          >
            Make Agent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => assignRole(row.id, "traveller")}
            disabled={row.role === "traveller"}
            className="text-xs"
          >
            Make Traveller
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => assignRole(row.id, "super_admin")}
            disabled={row.role === "super_admin"}
            className="text-xs"
          >
            Make Admin
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => remove(row.id)}
            className="text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      ),
      meta: {
        hideOnMobile: false,
      },
    },
  ];

  const filteredData = roleFilter === "all"
    ? profiles
    : roleFilter === "staff"
    ? profiles.filter(p => p.role === "agent" || p.role === "super_admin")
    : profiles.filter(p => p.role === roleFilter);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Management
          </CardTitle>
          <CardDescription>
            Manage staff roles and permissions (Agents and Super Admins)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by role:</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff (Agents & Admins)</SelectItem>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="traveller">Traveller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={load} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            searchable={true}
            defaultPageSize={25}
            emptyMessage="No staff members found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
