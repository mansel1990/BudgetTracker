"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RequestCard from "./RequestCard";
import { approveTradeSignalAccess } from "../../signals/_actions/tradeSignals";
import { denyRequest, getPendingRequests } from "../_actions/adminActions";

export default function PendingRequests() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["pendingRequests"],
    queryFn: getPendingRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveTradeSignalAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const denyMutation = useMutation({
    mutationFn: denyRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] }),
  });

  if (isLoading)
    return (
      <p className="text-center text-muted-foreground">Loading requests...</p>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Pending Requests
      </h2>

      {requests?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={{
                id: request.id,
                account: {
                  name: request.user?.name ?? "Unknown",
                  email: request.user?.email ?? "Unknown",
                },
              }}
              onApprove={(id: number) =>
                approveMutation.mutate({ targetUserId: id, days: 30 })
              }
              onDeny={(id: number) => denyMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No pending requests.
        </p>
      )}
    </div>
  );
}
