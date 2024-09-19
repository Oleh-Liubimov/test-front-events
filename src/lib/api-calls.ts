import { RegistrantData } from "@/types";

const baseUrl = "http://localhost:3000";

export async function getEvents(page: number = 1, limit: number = 10) {
  const response = await fetch(`${baseUrl}/events?page=${page}&limit=${limit}`);
  return response.json();
}

export async function registerForEvent(
  eventId: string,
  registrantData: RegistrantData
) {
  const response = await fetch(`${baseUrl}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrantData),
  });
  return response.json();
}

export async function getRegistrants(eventId: string) {
  const response = await fetch(`${baseUrl}/events/${eventId}/registrants`);
  return response.json();
}
