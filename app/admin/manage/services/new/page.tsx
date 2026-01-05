"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ServiceForm {
  slug: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  active: boolean;
}

export default function NewServicePage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    slug: "",
    name: "",
    description: "",
    icon: "",
    price: 0,
    active: true,
  });
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create service");
      }

      const result = await response.json();
      toast.showToast({
        title: "Service created",
        description: `Service "${form.name}" created successfully`,
        type: "success",
      });

      // Redirect to services list
      router.push("/admin/manage/services");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.showToast({
        title: "Create failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const commonIcons = [
    "✈️", "🚗", "🏨", "🍽️", "🛍️", "📱", "🧳", "🎫", "🅿️", "🚕",
    "🍸", "☕", "🏃", "👨‍💼", "👩‍💼", "🛡️", "📋", "⏰", "🗺️", "💼"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Create New Service</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Add a new airport concierge service
          </p>
        </div>
        <Link href="/admin/manage/services">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Service Details
          </CardTitle>
          <CardDescription>
            Fill in the service information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Name *</label>
                <Input
                  placeholder="e.g., VIP Meet & Greet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input
                  placeholder="e.g., vip-meet-greet"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier, auto-generated from name
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe the service..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Icon *</label>
                <div className="space-y-3">
                  <Input
                    placeholder="e.g., ✈️ or 🚗"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    required
                  />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Common icons:</span>
                    {commonIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className="text-lg p-1 hover:bg-muted rounded"
                        onClick={() => setForm({ ...form, icon })}
                        title="Click to select"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USD) *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price.toString()}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.active ? "active" : "inactive"}
                  onValueChange={(val: string) =>
                    setForm({ ...form, active: val === "active" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Service"}
              </Button>
              <Link href="/admin/manage/services">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
