import { notFound } from "next/navigation";

export const metadata = {
  title: "Supabase test | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SupabaseTestPage() {
  notFound();
}
