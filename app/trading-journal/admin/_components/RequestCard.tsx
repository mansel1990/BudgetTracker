import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Props {
  request: {
    id: number; // Changed from string to number
    account: {
      name: string | null; // Name can be null in Account
      email: string; // Clerk user ID (userId)
    };
  };
  onApprove: (id: number) => void; // id should be number
  onDeny: (id: number) => void; // id should be number
}

export default function RequestCard({ request, onApprove, onDeny }: Props) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">{request.account.name}</h2>
        <p className="text-gray-400 text-sm">{request.account.email}</p>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          variant="outline"
          className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 w-full sm:w-auto"
          onClick={() => onApprove(request.id)}
        >
          Approve ✅
        </Button>
        <Button
          variant="outline"
          className="border-red-500 bg-red-950 text-white hover:bg-red-700 w-full sm:w-auto"
          onClick={() => onDeny(request.id)}
        >
          Deny ❌
        </Button>
      </CardContent>
    </Card>
  );
}
