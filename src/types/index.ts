export enum HowYouFindUs {
  SOCIAL_MEDIA = "social media",
  FRIENDS = "friends",
  FOUND_MYSELF = "found myself",
}

export interface RegistrantData {
  id?: string;
  name: string;
  email: string;
  birthDate?: Date | string | null;
  howDidYouFindUs: HowYouFindUs;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  organizer: string;
}

export interface EventsResponse {
  data: Event[];
  hasMore: boolean;
  page: string;
  limit: string;
}

export interface User extends RegistrantData {
  eventId: string;
}

export type GetRegistrantsResponse = User[];

export interface RegisterForEventParams {
  eventId: string;
  values: RegistrantData;
}
