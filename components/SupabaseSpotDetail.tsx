import { SpotDetailView } from "@/components/SpotDetailView";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import {
  getPublishedSupabaseSpotsForCity,
  type SupabasePublicSpot,
} from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";

type Props = {
  city: SupabasePublicCity;
  spot: SupabasePublicSpot;
  tracking?: TrackingParams;
};

export async function SupabaseSpotDetail({ city, spot, tracking }: Props) {
  const nearbySpots = (await getPublishedSupabaseSpotsForCity(city.slug))
    .filter((nearbySpot) => nearbySpot.slug !== spot.slug)
    .slice(0, 3);

  return (
    <SpotDetailView city={city} spot={spot} nearbySpots={nearbySpots} tracking={tracking} />
  );
}
