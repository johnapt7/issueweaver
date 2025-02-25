
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Users } from "lucide-react";

interface VotingAreaProps {
  issueId: string;
}

type Vote = {
  user: string;
  value: number;
};

const POINTS = [1, 2, 3, 5, 8, 13, 21];

export function VotingArea({ issueId }: VotingAreaProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("room") || "default";
  const userId = crypto.randomUUID(); // In a real app, this would come from authentication

  useEffect(() => {
    const channel = supabase.channel(`room_${roomId}`)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const currentVotes = Object.values(state).flat().map((presence: any) => ({
          user: presence.user,
          value: presence.vote
        }));
        setVotes(currentVotes);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user: userId,
            vote: selectedPoint,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userId, selectedPoint]);

  const handleVote = async (point: number) => {
    setSelectedPoint(point);
    setRevealed(false);
  };

  const average = revealed && votes.length > 0
    ? votes.reduce((sum, vote) => sum + (vote.value || 0), 0) / votes.length
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {votes.length} participant{votes.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setRevealed(true)}
          disabled={votes.length === 0}
        >
          Reveal Votes
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {POINTS.map((point) => (
          <Button
            key={point}
            variant={selectedPoint === point ? "default" : "outline"}
            className="h-16 text-lg"
            onClick={() => handleVote(point)}
          >
            {point}
          </Button>
        ))}
      </div>

      {revealed && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Votes</span>
              <span className="text-sm text-gray-500">
                Average: {average?.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {votes.map((vote, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2 text-sm"
                >
                  <span className="text-gray-500">User {index + 1}</span>
                  <span className="font-medium">{vote.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
