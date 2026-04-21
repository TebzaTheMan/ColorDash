import { getDeviceId } from "./deviceId";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5043";

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "X-Device-ID": getDeviceId(),
    },
  });

  const data = await response.json().catch(() => ({ error: response.statusText }));

  if (!response.ok) {
    throw data;
  }

  return { data, status: response.status, headers: response.headers } as T;
};
