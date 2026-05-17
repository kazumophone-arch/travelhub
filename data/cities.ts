import type { City } from "./types";

import { amsterdamNl } from "./city-data/amsterdam-nl";
import { barcelonaEs } from "./city-data/barcelona-es";
import { dubrovnikHr } from "./city-data/dubrovnik-hr";
import { edinburghUk } from "./city-data/edinburgh-uk";
import { florenceIt } from "./city-data/florence-it";
import { kyotoJp } from "./city-data/kyoto-jp";
import { parisFr } from "./city-data/paris-fr";
import { pragueCz } from "./city-data/prague-cz";
import { romeIt } from "./city-data/rome-it";
import { satoharuJp } from "./city-data/satoharu-jp";
import { veniceIt } from "./city-data/venice-it";
import { viennaAt } from "./city-data/vienna-at";

const cityList: City[] = [
  amsterdamNl,
  barcelonaEs,
  dubrovnikHr,
  edinburghUk,
  florenceIt,
  kyotoJp,
  parisFr,
  pragueCz,
  romeIt,
  satoharuJp,
  veniceIt,
  viennaAt,
];

export const cities: Record<string, City> = Object.fromEntries(
  cityList.map((city) => [city.slug, city])
);
