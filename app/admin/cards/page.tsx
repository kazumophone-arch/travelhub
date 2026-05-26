import { AdminCardEditor } from "@/components/AdminCardEditor";
import type { City } from "@/data/types";
import { cities } from "@/data/cities";

export const metadata = {
  title: "Card editor | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCardsPage() {
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
        <AdminCardEditor cities={cityList} />
      </section>
    </main>
  );
}



