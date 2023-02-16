import { getLocationData } from "../lib/geocode";
import { UseScraper } from "../lib/scrape";

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

export async function getClubData(club: Club): Promise<Club> {
  const scraper = new UseScraper(club.owner_url);
  club.owner = "https://ra.co/";
  club.city_name = await scraper.getByJquery(
    ".Text-sc-1t0gn2o-0.Link__StyledLink-k7o46r-0.dxNiKF.Breadcrumb__StyledLink-fnbmus-0.heeKjO"
  );
  const capacity = await scraper.getByJquery(".Text-sc-1t0gn2o-0.fILZhg");
  club.capacity = capacity ? +capacity : null;

  let $ = await scraper.getSouped();

  const most_listed_artists: {
    name: string;
    url: string;
  }[] = [];

  $("span.Text-sc-1t0gn2o-0.Link__StyledLink-k7o46r-0.kvupNG").each(
    (_, elem) => {
      most_listed_artists.push({
        name: $(elem).text().trim(),
        url: "https://ra.co" + $(elem).attr("href"),
      });
    }
  );

  club.most_listed_artists = most_listed_artists;

  club.phone_number = await scraper.getByJquery(
    "li.Column-sc-18hsrnn-0.bdYlQW>div.Box-omzyfs-0.Alignment-sc-1fjm9oq-0.hzzyNm>span.Text-sc-1t0gn2o-0.esJZBM"
  );
  club.phone_number = club.phone_number
    ? club.phone_number.replaceAll(" ", "")
    : club.phone_number;
  $(
    "div.Box-omzyfs-0.Alignment-sc-1fjm9oq-0.jpNEPl>a.Link__AnchorWrapper-k7o46r-1.iRSXcp"
  ).each((_, elem) => {
    if ($(elem).text().trim() == "Website") {
      club.club_website = $(elem).attr("href");
    }
    if ($(elem).text().trim() == "Maps") {
      club.google_map = encodeURI($(elem).attr("href"));
    }
  });

  club.ra_followers = +(await scraper.getByJquery(
    "span.Text-sc-1t0gn2o-0.dHaoUU"
  ));
  club.ra_venue_description = {
    text: await scraper.getByJquery(
      "span.Text-sc-1t0gn2o-0.CmsContent__StyledText-g7gf78-0.icTUBR"
    ),
    external_link: club.club_website,
  };
  const locationData = await getLocationData(club.location);
  club.venue_latitude = locationData?.latitude;
  club.venue_longitude = locationData?.longitude;
  return club;
}
