"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getEvents, registerForEvent } from "@/lib/api-calls";

import { EventsResponse, RegistrantData } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import React, { useState } from "react";

import EventCard from "@/components/EventCard";
import RegistrationForm from "@/components/RegistrationForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const { data, error, isLoading } = useQuery<EventsResponse>({
    queryKey: ["events", page],
    queryFn: () => getEvents(page, limit),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRegisterClick = (eventId: string) => {
    setSelectedEvent(eventId);
    setIsDialogOpen(!isDialogOpen);
    console.log(eventId);
    console.log(isDialogOpen);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  async function onSubmit(values: RegistrantData) {
    try {
      const response = await registerForEvent(selectedEvent, values);
      setIsDialogOpen(!isDialogOpen);
      toast("Successfully registered for event");

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) return <Loader2 className="size-5 animate-spin" />;
  if (error) return <p>Something gone wrong. Try again.</p>;

  return (
    <main className="">
      <h1 className="text-center text-3xl mb-5">Events</h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {data?.data.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegisterClick={handleRegisterClick}
          />
        ))}
      </div>
      <Pagination className="my-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
              className={
                page <= 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => handlePageChange(page - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={data?.hasMore === false}
              tabIndex={page <= 1 ? -1 : undefined}
              className={
                data?.hasMore === false
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={() => handlePageChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <RegistrationForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={onSubmit}
      />
    </main>
  );
}
