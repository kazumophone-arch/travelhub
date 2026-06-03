export type TrackingSearchParams = {
  src?: string | string[];
  v?: string | string[];
};

export type TrackingParams = {
  src?: string;
  v?: string;
};

export function getTrackingParams(searchParams: TrackingSearchParams): TrackingParams {
  return {
    src: readSingleParam(searchParams.src),
    v: readSingleParam(searchParams.v),
  };
}

function readSingleParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const trimmed = rawValue?.trim();
  return trimmed || undefined;
}
