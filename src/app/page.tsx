"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getEvents } from "@/lib/api-calls";
import { cn } from "@/lib/utils";
import { EventsResponse, RegistrantData } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  howFind: z.string({
    required_error: "Required",
  }),
});

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = React.useState<Date>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
      date: new Date(),
    },
  });

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

  async function onSubmit(values: RegistrantData) {}

  if (isLoading) return <Loader2 className="size-5 animate-spin" />;
  if (error) return <p>Something gone wrong. Try again.</p>;

  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <h1 className="text-center text-3xl mb-5">Events</h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {data?.data.map((event) => (
          <div key={event.id} className="w-80">
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
                <Button onClick={() => handleRegisterClick(event.id)}>
                  Register
                </Button>
                <Button>View</Button>
              </CardFooter>
            </Card>
          </div>
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

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Event registration</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Fullname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={() => setDate(field.value)}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="howFind"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Where did you hear about this event ?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={"friends"}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Social media
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mentions" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Friends
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Found myself
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
