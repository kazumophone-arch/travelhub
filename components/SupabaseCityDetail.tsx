import { CityDetailView } from "@/components/CityDetailView";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";

type Props = {
  city: SupabasePublicCity;
  tracking?: TrackingParams;
};

export async function SupabaseCityDetail({ city, tracking }: Props) {
  const spots = await getPublishedSupabaseSpotsForCity(city.slug);

  return <CityDetailView city={city} spots={spots} tracking={tracking} />;
}
