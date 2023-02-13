import { UseScraper } from "./scrape";

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
  };
  ra_venue_description?: {
    text: string;
    external_link: string;
  };
  venue_latitude?: string;
  venue_longitude?: string;
}

export async function getClubData(
  clubId: string,
  venueName: string,
  ownerUrl: string,
  clubLocation: string
) {
  let club: Club = {
    id: clubId,
    venue_name: venueName,
    owner_url: ownerUrl,
    location: clubLocation,
  };

  const scraper = new UseScraper(club.owner_url);
  club.city_name = await scraper.getTextByJquery(
    ".Text-sc-1t0gn2o-0.Link__StyledLink-k7o46r-0.dxNiKF.Breadcrumb__StyledLink-fnbmus-0.heeKjO"
  );

  return club;
}
