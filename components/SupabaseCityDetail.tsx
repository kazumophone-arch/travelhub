import { CityDetailView } from "@/components/CityDetailView";
import { ScrollyCityStory } from "@/components/ScrollyCityStory";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getCountryChapterContext } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";

type Props = {
  city: SupabasePublicCity;
  tracking?: TrackingParams;
};

export async function SupabaseCityDetail({ city, tracking }: Props) {
  if (city.slug === "kyoto") {
    const spots = await getPublishedSupabaseSpotsForCity(city.slug);
    return <ScrollyCityStory city={city} spots={spots} tracking={tracking} />;
  }

  const [spots, chapterContext] = await Promise.all([
    getPublishedSupabaseSpotsForCity(city.slug),
    getCountryChapterContext(city),
  ]);

  return (
    <CityDetailView
      city={city}
      spots={spots}
      tracking={tracking}
      chapterNumber={chapterContext.chapterNumber}
      chapterTotal={chapterContext.chapterTotal}
      nextCity={chapterContext.nextCity}
      nearbyCities={chapterContext.nearbyCities}
    />
  );
}
