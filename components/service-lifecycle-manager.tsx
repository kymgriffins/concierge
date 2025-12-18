"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { MockAPI, Booking, Agent } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { CheckCircle2, Clock, AlertCircle, UserCheck, ArrowRight, Timer, Shield, Play, Square, Send, Check, LucideIcon } from 'lucide-react';

interface ServiceLifecycleStatus {
  currentStatus: Booking['status'];
  nextPossibleStatuses: Booking['status'][];
  canAutoTransition: boolean;
  timeUntilAutoTransition?: number;
  requiresSupervisorApproval: boolean;
}

interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

interface ServiceLifecycleManagerProps {
  booking: Booking;
  onStatusChange?: (booking: Booking) => void;
  compact?: boolean;
}

export function ServiceLifecycleManager({ booking, onStatusChange, compact = false }: ServiceLifecycleManagerProps) {
  const [lifecycleStatus, setLifecycleStatus] = useState<ServiceLifecycleStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentUser, setCurrentUser] = useState<Agent | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadLifecycleStatus();
    loadCurrentUser();
  }, [booking.id]);

  const loadLifecycleStatus = async () => {
    try {
      const status = await MockAPI.getServiceLifecycleStatus(booking.id);
      setLifecycleStatus(status);
    } catch (error) {
      console.error('Error loading lifecycle status:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await MockAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const handleStatusChange = async (newStatus: Booking['status']) => {
    setLoading(true);
    try {
      let updatedBooking: Booking | null = null;

      if (newStatus === 'pending_review') {
        updatedBooking = await MockAPI.submitForSupervisorReview(booking.id, reviewNotes);
        setShowReviewDialog(false);
        setReviewNotes('');
      } else if (newStatus === 'completed' && booking.status === 'pending_review') {
        updatedBooking = await MockAPI.approveSupervisorReview(booking.id, reviewNotes);
        setShowReviewDialog(false);
        setReviewNotes('');
      } else {
        updatedBooking = await MockAPI.updateBooking(booking.id, { status: newStatus });
      }

      if (updatedBooking) {
        onStatusChange?.(updatedBooking);
        await loadLifecycleStatus();
        toast.showToast({
          title: 'Status Updated',
          description: `Booking status changed to ${newStatus.replace('_', ' ')}`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.showToast({
        title: 'Update Failed',
        description: String(error),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTransitionCheck = async () => {
    setLoading(true);
    try {
      const result = await MockAPI.checkAndUpdateServiceLifecycles();
      if (result.updatedBookings > 0) {
        // Reload the booking data
        const updatedBooking = await MockAPI.getBookingById(booking.id);
        if (updatedBooking) {
          onStatusChange?.(updatedBooking);
          await loadLifecycleStatus();
          toast.showToast({
            title: 'Auto-Transition Complete',
            description: `${result.updatedBookings} booking(s) automatically transitioned`,
            type: 'success'
          });
        }
      } else {
        toast.showToast({
          title: 'No Transitions Needed',
          description: 'All bookings are up to date',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Error checking transitions:', error);
      toast.showToast({
        title: 'Check Failed',
        description: String(error),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: Booking['status']): StatusConfig => {
    const configs: Record<Booking['status'], StatusConfig> = {
      new: { label: 'New', color: 'default', icon: AlertCircle, description: 'Booking created, awaiting contact' },
      contacted: { label: 'Contacted', color: 'secondary', icon: UserCheck, description: 'Passenger has been contacted' },
      confirmed: { label: 'Confirmed', color: 'outline', icon: CheckCircle2, description: 'Booking confirmed and scheduled' },
      in_progress: { label: 'In Progress', color: 'destructive', icon: Play, description: 'Service is currently active' },
      completed: { label: 'Completed', color: 'outline', icon: Square, description: 'Service has been completed' },
      pending_review: { label: 'Pending Review', color: 'secondary', icon: Clock, description: 'Awaiting supervisor approval' },
      cancelled: { label: 'Cancelled', color: 'destructive', icon: AlertCircle, description: 'Booking has been cancelled' }
    };
    return configs[status] || configs.new;
  };

  const getServiceTypeIcon = (serviceId: string) => {
    const icons = {
      arrival: '🛬',
      departure: '🛫',
      transit: '🔄'
    };
    return icons[serviceId as keyof typeof icons] || '✈️';
  };

  if (!lifecycleStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-32 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const currentConfig = getStatusConfig(lifecycleStatus.currentStatus);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <span className="text-lg">{getServiceTypeIcon(booking.serviceId)}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={currentConfig.color as any}>{currentConfig.label}</Badge>
            {lifecycleStatus.canAutoTransition && (
              <Badge variant="outline" className="text-xs">
                <Timer className="w-3 h-3 mr-1" />
                Auto-transition ready
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{currentConfig.description}</p>
        </div>
        <div className="flex gap-1">
          {lifecycleStatus.nextPossibleStatuses.map((status: Booking['status']) => {
            const config = getStatusConfig(status);
            return (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(status)}
                disabled={loading}
                className="text-xs"
              >
                {status === 'pending_review' ? 'Submit Review' : config.label}
              </Button>
            );
          })}
          {lifecycleStatus.canAutoTransition && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoTransitionCheck}
              disabled={loading}
              className="text-xs"
            >
              <Play className="w-3 h-3 mr-1" />
              Check
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">{getServiceTypeIcon(booking.serviceId)}</span>
          Service Lifecycle
          <Badge variant={currentConfig.color as any}>{currentConfig.label}</Badge>
        </CardTitle>
        <CardDescription>
          Manage the {booking.serviceId} service lifecycle for {booking.passengerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <currentConfig.icon className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium">{currentConfig.label}</h3>
            <p className="text-sm text-muted-foreground">{currentConfig.description}</p>
            {lifecycleStatus.timeUntilAutoTransition && lifecycleStatus.timeUntilAutoTransition > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Auto-transition in {Math.floor(lifecycleStatus.timeUntilAutoTransition / 60)}h {lifecycleStatus.timeUntilAutoTransition % 60}m
              </p>
            )}
          </div>
          {lifecycleStatus.canAutoTransition && (
            <Button
              variant="outline"
              onClick={handleAutoTransitionCheck}
              disabled={loading}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Auto-Transition
            </Button>
          )}
        </div>

        {/* Next Possible Actions */}
        {lifecycleStatus.nextPossibleStatuses.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Available Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lifecycleStatus.nextPossibleStatuses.map((status: Booking['status']) => {
                const config = getStatusConfig(status);
                const isSupervisorAction = lifecycleStatus.requiresSupervisorApproval;
                const canPerformAction = !isSupervisorAction || (currentUser?.role === 'supervisor');

                return (
                  <Card key={status} className="border-2 border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <config.icon className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                          {isSupervisorAction && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Shield className="w-3 h-3 mr-1" />
                              Supervisor Required
                            </Badge>
                          )}
                        </div>
                        {status === 'pending_review' || (status === 'completed' && booking.status === 'pending_review') ? (
                          showReviewDialog ? (
                            <div className="absolute top-0 left-0 right-0 bg-background border rounded-lg p-4 shadow-lg z-10">
                              <h4 className="font-medium mb-2">
                                {status === 'pending_review' ? 'Submit for Supervisor Review' : 'Approve Service Completion'}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {status === 'pending_review'
                                  ? 'Add any notes for the supervisor before submitting this service for review.'
                                  : 'Add approval notes to complete this service.'
                                }
                              </p>
                              <Textarea
                                placeholder={status === 'pending_review' ? 'Notes for supervisor...' : 'Approval notes...'}
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="mb-3"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleStatusChange(status)}
                                  disabled={loading}
                                  size="sm"
                                >
                                  {status === 'pending_review' ? 'Submit for Review' : 'Approve & Complete'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowReviewDialog(false)}
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowReviewDialog(true)}
                              disabled={loading || !canPerformAction}
                            >
                              {status === 'pending_review' ? 'Submit for Review' : 'Approve'}
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(status)}
                            disabled={loading || !canPerformAction}
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {config.label}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Flow Visualization */}
        <div>
          <h4 className="font-medium mb-3">Service Flow</h4>
          <div className="relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted"></div>
            <div className="relative flex justify-between">
              {[
                { key: 'new', label: 'New' },
                { key: 'contacted', label: 'Contacted' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
                { key: 'pending_review', label: 'Review' }
              ].map((step, index) => {
                const isCompleted = ['new', 'contacted', 'confirmed', 'in_progress', 'completed', 'pending_review'].indexOf(lifecycleStatus.currentStatus) >= index;
                const isCurrent = lifecycleStatus.currentStatus === step.key;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isCurrent
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-3 max-w-16">
                      <p className={`text-xs font-medium ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
