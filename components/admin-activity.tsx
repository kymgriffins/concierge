"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockAPI, ActivityLog } from "@/lib/mock-api";
import DataTable, { Column } from "@/components/ui/data-table/data-table";
import { formatDateTimeUTC } from "@/lib/utils";

export function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    load();
  }, []);

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
      await MockAPI.createActivityLog({
        bookingId: "0",
        action: "Manual note",
        user: "Staff",
        details: note,
      });
      setNote("");
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
          <p className="text-muted-foreground">
            Recent actions and system logs
          </p>
        </div>
        <div>
          <Button onClick={load}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={submitNote} className="flex gap-2">
            <Input
              placeholder="Add a manual note to the activity log"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <DataTable
          columns={
            [
              {
                key: "action",
                header: "Action",
                accessor: (l) => l.action,
                cell: (l) => <div className="font-medium">{l.action}</div>,
                sortable: true,
              },
              {
                key: "details",
                header: "Details",
                accessor: (l) => l.details,
                cell: (l) => <div className="text-sm">{l.details}</div>,
              },
              { key: "user", header: "User", accessor: (l) => l.user },
              {
                key: "time",
                header: "Timestamp",
                accessor: (l) => l.timestamp,
                cell: (l) => formatDateTimeUTC(l.timestamp),
                sortable: true,
              },
            ] as Column<ActivityLog>[]
          }
          data={logs}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>
    </div>
  );
}
