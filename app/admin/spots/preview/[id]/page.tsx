import { notFound } from "next/navigation";

export const metadata = {
  title: "Spot preview | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewSpotPage() {
  notFound();
}
