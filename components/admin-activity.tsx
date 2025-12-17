"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockAPI, ActivityLog } from "@/lib/mock-api";

export function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await MockAPI.getActivityLogs(50);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    try {
      await MockAPI.createActivityLog({ bookingId: '0', action: 'Manual note', user: 'Staff', details: note });
      setNote('');
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Recent actions and system logs</p>
        </div>
        <div>
          <Button onClick={load}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={submitNote} className="flex gap-2">
            <Input placeholder="Add a manual note to the activity log" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {logs.map(log => (
          <Card key={log.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{log.action}</div>
                  <div className="text-sm text-muted-foreground">{log.details}</div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  <div>{log.user}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
