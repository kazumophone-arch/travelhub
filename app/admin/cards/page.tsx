import { notFound } from "next/navigation";

export const metadata = {
  title: "Card editor | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCardsPage() {
  notFound();
}
