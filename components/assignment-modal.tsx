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
import { getAgents, assignBookingToAgent, reassignBooking, getBookingById } from "@/lib/db-adapter";

interface AssignmentModalProps {
  open: boolean;
  bookingId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AgentWorkload extends Agent {
  active_bookings: number;
  urgent_bookings: number;
  avg_booking_age_hours: number;
}

export function AssignmentModal({ open, bookingId, onClose, onSuccess }: AssignmentModalProps) {
  const [agents, setAgents] = useState<AgentWorkload[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [instructions, setInstructions] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReassignment, setIsReassignment] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    if (open && bookingId) {
      loadData();
    }
  }, [open, bookingId]);

  const loadData = async () => {
    try {
      const [agentsResult, bookingResult] = await Promise.all([
        getAgents(),
        getBookingById(bookingId),
      ]);

      // Filter to only agents and super_admins
      const staffAgents = agentsResult.filter((agent: any) =>
        agent.role === 'agent' || agent.role === 'super_admin'
      );

      // For now, just use basic agent data - in production you'd want workload data
      const agentsWithWorkload = staffAgents.map((agent: any) => ({
        ...agent,
        active_bookings: Math.floor(Math.random() * 5), // Mock data
        urgent_bookings: Math.floor(Math.random() * 3), // Mock data
        avg_booking_age_hours: Math.random() * 10 + 5, // Mock data
      }));

      setAgents(agentsWithWorkload);
      setBooking(bookingResult);

      // Check if this is a reassignment
      setIsReassignment(bookingResult?.assigned_agent_profile_id != null);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) {
      toast.showToast({
        title: "No agent selected",
        description: "Please select an agent to assign this booking to",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (isReassignment) {
        await reassignBooking(bookingId, selectedAgent, 'superuser', reason || 'Reassigned by superuser');
        toast.showToast({
          title: "Booking reassigned",
          description: "The booking has been reassigned to the selected agent",
          type: "success",
        });
      } else {
        await assignBookingToAgent(bookingId, selectedAgent, 'superuser', instructions);
        toast.showToast({
          title: "Booking assigned",
          description: "The booking has been assigned to the selected agent",
          type: "success",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error assigning booking:", error);
      toast.showToast({
        title: "Failed to assign booking",
        description: "Please try again",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWorkloadColor = (bookings: number) => {
    if (bookings >= 4) return 'text-red-600';
    if (bookings >= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isReassignment ? 'Reassign Booking' : 'Assign Booking to Agent'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Assignment */}
          {isReassignment && booking?.assigned_agent_profile_id && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-800">Current Assignment</p>
              <p className="text-sm text-blue-700">
                Currently assigned to: {agents.find(a => a.id === booking.assigned_agent_profile_id)?.name || 'Unknown Agent'}
              </p>
            </div>
          )}

          {/* Agent Selection */}
          <div>
            <Label htmlFor="agent">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent..." />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{agent.name}</span>
                      <span className={`text-xs ml-2 ${getWorkloadColor(agent.active_bookings)}`}>
                        {agent.active_bookings} active
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agent Details */}
          {selectedAgent && (
            <div className="p-3 bg-gray-50 border rounded">
              {(() => {
                const agent = agents.find(a => a.id === selectedAgent);
                return agent ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{agent.name}</span>
                      <span className={`text-sm ${getWorkloadColor(agent.active_bookings)}`}>
                        {agent.active_bookings} active bookings
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {agent.urgent_bookings} urgent • {agent.avg_booking_age_hours?.toFixed(1)}h avg age
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Instructions or Reason */}
          <div>
            <Label htmlFor={isReassignment ? "reason" : "instructions"}>
              {isReassignment ? "Reason for Reassignment" : "Instructions for Agent"}
            </Label>
            <Textarea
              id={isReassignment ? "reason" : "instructions"}
              value={isReassignment ? reason : instructions}
              onChange={(e) => isReassignment ? setReason(e.target.value) : setInstructions(e.target.value)}
              rows={3}
              placeholder={
                isReassignment
                  ? "Explain why this booking is being reassigned..."
                  : "Provide any specific instructions for the agent..."
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={loading || !selectedAgent}>
              {loading && <Spinner />}
              {loading ? "Assigning..." : (isReassignment ? "Reassign Booking" : "Assign Booking")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}