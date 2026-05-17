import { cities } from "@/data/cities";
import { CityExplorer } from "@/components/CityExplorer";

export default function Home() {
  return <CityExplorer cities={Object.values(cities)} />;
}