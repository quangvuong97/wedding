import { useState } from "react";
import { getSubdomain, EImageStoreType } from "./api";
import useFetch, { API_URL } from "./common";

export interface UserConfig {
  storageKey: { urlEndpoint: string };

  groomName: string;

  brideName: string;

  brideAccountName: string;

  brideAccountNumber: string;

  brideAddress: string;

  brideGgAddress: string;

  brideIntroduction: string;

  groomIntroduction: string;

  groomAccountName: string;

  groomAccountNumber: string;

  groomAddress: string;

  groomGgAddress: string;

  solarDate: string;

  lunarDate: string;

  weddingHours: string;

  dataGroomQR: string;

  dataBrideQR: string;

  logoBankGroom: string;

  logoBankBride: string;

  guestSlug?: string;

  guestName?: string;

  guestOf?: "groom" | "bride";

  story: {
    title: string;

    date: string;

    description: string;
  }[];

  audio: string;

  brideSolarDate: Date;

  brideLunarDate: string;

  brideWeddingHours: string;
}

export interface ConfirmAttendanceRequest {
  isAttendance: "attendance" | "not_attendance";
  guestSlug?: string;
  guestOf?: "groom" | "bride";
  name?: string;
}

export interface HeartbeatRequest {
  guestId?: string;

  sessionId?: string;

  source?: "zalo" | "facebook" | "others";
}

export const WeddingPageApi = {
  useGetCarousel: () =>
    useFetch<string[]>(
      `v1/public/${getSubdomain()}/images?type=${EImageStoreType.CAROUSEL}`
    ),
  useGetStory: () =>
    useFetch<string[]>(
      `v1/public/${getSubdomain()}/images?type=${EImageStoreType.STORY}`
    ),
  useGetGallery: () =>
    useFetch<string[]>(
      `v1/public/${getSubdomain()}/images?type=${EImageStoreType.SWEET_MOMENTS}`
    ),
  useGetFooter: () =>
    useFetch<string[]>(
      `v1/public/${getSubdomain()}/images?type=${EImageStoreType.FOOTER}`
    ),
  useGetConfig: (guest: string | null) =>
    useFetch<UserConfig>(
      `v1/public/${getSubdomain()}/configs?guest=${guest || ""}`
    ),
  useConfirmAttendance: () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const username = getSubdomain();
    const url = new URL(
      `v1/public/${username}/confirm-attendance`,
      API_URL
    ).toString();

    const confirm = async (body: ConfirmAttendanceRequest) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        setResponse(json);
        return json;
      } catch (err) {
        return;
        // throw err;
      } finally {
        setLoading(false);
      }
    };

    return { confirm, loading, response, error };
  },
  heartbeat: async (request: HeartbeatRequest) => {
    const username = getSubdomain();
    const url = new URL(`v1/public/${username}/heartbeat`, API_URL).toString();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request }),
    });
    const data = await response.json();
    if (data.error || data.statusCode < 200 || data.statusCode > 200) {
      return null;
    }
    return data.data;
  },
};
