"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable, { Column } from "@/components/ui/data-table/data-table";
import { formatDateUTC } from "@/lib/utils";
import { Eye, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Traveler {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  created_at?: string;
}

export function AdminCustomers() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [filteredTravelers, setFilteredTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTravelers();
  }, []);

  useEffect(() => {
    filterTravelers();
  }, [travelers, searchTerm]);

  const loadTravelers = async () => {
    try {
      const response = await fetch("/api/travelers");
      if (!response.ok) throw new Error("Failed to load travelers");
      const result = await response.json();
      setTravelers(result.travelers);
    } catch (error) {
      console.error("Error loading travelers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTravelers = () => {
    let filtered = travelers;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (traveler) =>
          (traveler.name || "").toLowerCase().includes(lowerTerm) ||
          (traveler.email || "").toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredTravelers(filtered);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers (Travelers)</h1>
          <p className="text-muted-foreground">
            View and manage traveler profiles and their booking history
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search travelers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travelers List */}
      <div>
        <DataTable
          columns={
            [
              {
                key: "avatar",
                header: "",
                cell: (t) => (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                ),
                width: "w-12",
              },
              {
                key: "name",
                header: "Name",
                accessor: (t) => t.name,
                cell: (t) => (
                  <div>
                    <div className="font-medium">{t.name || "Unnamed Traveler"}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.role || "traveler"}
                    </div>
                  </div>
                ),
                sortable: true,
              },
              {
                key: "contact",
                header: "Contact",
                cell: (t) => (
                  <div className="space-y-1">
                    {t.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {t.email}
                      </div>
                    )}
                    {t.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {t.phone}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "joined",
                header: "Joined",
                accessor: (t) => t.created_at,
                cell: (t) =>
                  t.created_at ? formatDateUTC(t.created_at) : "-",
                sortable: true,
              },
              {
                key: "actions",
                header: "",
                cell: (t) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/customers/${t.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                ),
              },
            ] as Column<Traveler>[]
          }
          data={filteredTravelers}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
          emptyMessage="No travelers found matching your criteria"
        />
      </div>
    </div>
  );
}
