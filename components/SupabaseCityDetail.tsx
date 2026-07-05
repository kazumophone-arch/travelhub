import { CityDetailView } from "@/components/CityDetailView";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getPublishedNearbySupabaseCities } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";

type Props = {
  city: SupabasePublicCity;
  tracking?: TrackingParams;
};

export async function SupabaseCityDetail({ city, tracking }: Props) {
  const [spots, nearbyCities] = await Promise.all([
    getPublishedSupabaseSpotsForCity(city.slug),
    getPublishedNearbySupabaseCities(city),
  ]);

  return (
    <CityDetailView
      city={city}
      spots={spots}
      tracking={tracking}
      nearbyCities={nearbyCities}
    />
  );
}
