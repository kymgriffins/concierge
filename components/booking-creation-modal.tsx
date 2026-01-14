"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { createBookingForProfile, getServices } from "@/lib/db-adapter";

interface BookingCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function BookingCreationModal({ open, onClose, onSuccess }: BookingCreationModalProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    traveler_name: '',
    traveler_email: '',
    traveler_phone: '',
    service_id: '',
    flight_date: '',
    flight_number: '',
    airport: '',
    flight_type: 'arrival' as 'arrival' | 'departure' | 'transit',
    special_requests: '',
  });
  const toast = useToast();

  useEffect(() => {
    if (open) {
      loadServices();
    }
  }, [open]);

  const loadServices = async () => {
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, pass null as profile since superuser creates bookings
      // In production, this should get the actual superuser profile from auth

      await createBookingForProfile(null, {
        ...formData,
        status: 'created',
        communication_channel: 'internal',
      });

      toast.showToast({
        title: "Booking created",
        description: "The booking has been created successfully",
        type: "success",
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.showToast({
        title: "Failed to create booking",
        description: "Please try again",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="traveler_name">Client Name</Label>
              <Input
                id="traveler_name"
                value={formData.traveler_name}
                onChange={(e) => handleInputChange('traveler_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="traveler_email">Email</Label>
              <Input
                id="traveler_email"
                type="email"
                value={formData.traveler_email}
                onChange={(e) => handleInputChange('traveler_email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="traveler_phone">Phone</Label>
              <Input
                id="traveler_phone"
                value={formData.traveler_phone}
                onChange={(e) => handleInputChange('traveler_phone', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="service_id">Service</Label>
              <Select value={formData.service_id} onValueChange={(value) => handleInputChange('service_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="flight_date">Flight Date</Label>
              <Input
                id="flight_date"
                type="date"
                value={formData.flight_date}
                onChange={(e) => handleInputChange('flight_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="flight_number">Flight Number</Label>
              <Input
                id="flight_number"
                value={formData.flight_number}
                onChange={(e) => handleInputChange('flight_number', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="flight_type">Flight Type</Label>
              <Select value={formData.flight_type} onValueChange={(value: 'arrival' | 'departure' | 'transit') => handleInputChange('flight_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrival">Arrival</SelectItem>
                  <SelectItem value="departure">Departure</SelectItem>
                  <SelectItem value="transit">Transit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="airport">Airport</Label>
            <Input
              id="airport"
              value={formData.airport}
              onChange={(e) => handleInputChange('airport', e.target.value)}
              placeholder="e.g., JFK, LAX, CDG"
            />
          </div>

          <div>
            <Label htmlFor="special_requests">Special Requests</Label>
            <Textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => handleInputChange('special_requests', e.target.value)}
              rows={3}
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}