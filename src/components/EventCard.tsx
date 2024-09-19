"use client";
import { EventsResponse, GetRegistrantsResponse } from "@/types";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRegistrants } from "@/lib/api-calls";
import RegistrantCard from "./RegistrantCard";

type Props = {
  event: EventsResponse["data"][0];
  onRegisterClick: (eventId: string) => void;
};

export default function EventCard({ event, onRegisterClick }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const handleViewClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDialogOpen(true);
  };

  const { data, isLoading, error } = useQuery<GetRegistrantsResponse>({
    queryKey: ["registrants", selectedEventId],
    queryFn: () => getRegistrants(selectedEventId),
    enabled: !!selectedEventId,
  });

  console.log(data);
  return (
    <div className="w-80">
      <Card className="w-full h-full flex flex-col bg-card">
        <CardHeader className="flex-grow-0">
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p>{event.eventDate}</p>
        </CardContent>
        <CardContent className="flex-grow">
          <p>{event.organizer}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => onRegisterClick(event.id)}>Register</Button>
          <Button onClick={() => handleViewClick(event.id)}>View</Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-200px)] max-h-[calc(100vh-200px)] overflow-auto mx-auto p-5">
          <DialogHeader>
            <DialogTitle>Event Registrants</DialogTitle>
          </DialogHeader>

          {isLoading && <Loader2 className="size-5 animate-spin" />}
          {error && <p>Something went wrong. Please try again.</p>}

          <div className="flex flex-wrap gap-3 justify-center ">
            {data ? (
              data.map((registrant) => (
                <RegistrantCard key={registrant.id} registrant={registrant} />
              ))
            ) : (
              <p>No registrants found.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
