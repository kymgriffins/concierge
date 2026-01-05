"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable, { Column } from "@/components/ui/data-table/data-table";
import { useToast } from "@/components/ui/toast";
import { RefreshCw, Settings, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
      toast.showToast({
        title: "Services loaded",
        description: `${data.services?.length || 0} services loaded successfully`,
        type: "success",
      });
    } catch (err) {
      console.error("Error loading services:", err);
      toast.showToast({
        title: "Error",
        description: "Failed to load services",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(id: string, currentActive: boolean) {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update service");
      }

      await load();
      toast.showToast({
        title: "Success",
        description: `Service ${!currentActive ? "activated" : "deactivated"}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating service:", err);
      toast.showToast({
        title: "Error",
        description: err.message || "Failed to update service",
        type: "error",
      });
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete service");
      }

      await load();
      toast.showToast({
        title: "Success",
        description: "Service deleted successfully",
        type: "success",
      });
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast.showToast({
        title: "Error",
        description: err.message || "Failed to delete service",
        type: "error",
      });
    }
  }

  const getStatusBadge = (active: boolean) => {
    return (
      <Badge variant={active ? "default" : "secondary"}>
        {active ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const columns: Column<Service>[] = [
    {
      key: "icon",
      header: "Icon",
      width: "w-16",
      cell: (row) => <span className="text-lg">{row.icon}</span>,
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      meta: { hideOnMobile: true },
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {row.description}
        </span>
      ),
      meta: { hideOnMobile: true },
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span className="font-semibold">{row.price}</span>
        </div>
      ),
    },
    {
      key: "active",
      header: "Status",
      filterable: true,
      cell: (row) => getStatusBadge(row.active),
      meta: {
        mobileCard: {
          label: "Status",
          value: (row) => getStatusBadge(row.active),
        },
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleActive(row.id, row.active)}
            className="text-xs"
          >
            {row.active ? "Deactivate" : "Activate"}
          </Button>
          <Link href={`/admin/manage/services/${row.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </Link>
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading services...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Services Management
          </CardTitle>
          <CardDescription>
            Manage airport concierge services and their pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Total Services: {services.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={load} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/admin/manage/services/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </Link>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={services}
            searchable={true}
            defaultPageSize={25}
            emptyMessage="No services found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
