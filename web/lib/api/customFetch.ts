import { getDeviceId } from "./deviceId";

const resolveBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "development") return "http://localhost:5043";
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is required in non-development builds."
  );
};

const BASE_URL = resolveBaseUrl();

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "X-Device-ID": getDeviceId(),
      },
    });
  } catch {
    return {
      data: { error: "Network error" },
      status: 0,
      headers: new Headers(),
    } as T;
  }

  const data = await response
    .json()
    .catch(() => ({ error: response.statusText }));

  return { data, status: response.status, headers: response.headers } as T;
};
