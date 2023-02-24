export type Venue = {
  venue_name: string;
  venue_address: string;
  google_map_url: string;
  owner_url: string;
  venue_latitude: number;
  venue_longitude: number;
  venue_type: string;
};

export type ClubShort = {
  id: number;
  venue_opening_status: boolean;
  owner_url: string;
  venue_activity: boolean;
};

export interface Club {
  readonly id: string;
  readonly venue_name: string;
  readonly owner_url: string;
  readonly location: string;
  city_name?: string;
  phone_number?: string;
  club_website?: string;
  google_map?: string;
  ra_followers?: number;
  capacity?: number;
  owner?: string;
  most_listed_artists?: {
    name: string;
    url: string;
  }[];
  ra_venue_description?: {
    text: string;
    external_link: string;
  };
  venue_latitude?: number | undefined;
  venue_longitude?: number | undefined;
}
