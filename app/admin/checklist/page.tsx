import { notFound } from "next/navigation";

export const metadata = {
  title: "Checklist | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSubPage() {
  notFound();
}
