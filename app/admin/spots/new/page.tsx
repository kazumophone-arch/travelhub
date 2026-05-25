import { AdminSpotCreator } from "@/components/AdminSpotCreator";
import { cities } from "@/data/cities";
import type { City } from "@/data/types";

export const metadata = {
  title: "Create spot | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewSpotPage() {
  const cityList = Object.values(cities) as City[];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8faf7",
        color: "#17202a",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 16px 64px",
        }}
      >
        <AdminSpotCreator cities={cityList} />
      </section>
    </main>
  );
}
