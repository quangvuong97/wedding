import { useState } from "react";
import { getSubdomain, EImageStoreType } from "./api";
import useFetch from "./common";

export interface UserConfig {
  storageKey: { urlEndpoint: string };

  groomName: string;

  brideName: string;

  brideAccountName: string;

  brideAccountNumber: string;

  brideAddress: string;

  brideGgAddress: string;

  groomAccountName: string;

  groomAccountNumber: string;

  groomAddress: string;

  groomGgAddress: string;

  solarDate: Date;

  lunarDate: string;

  weddingHours: string;

  dataGroomQR: string;

  dataBrideQR: string;

  logoBankGroom: string;

  logoBankBride: string;

  guestSlug?: string;

  guestName?: string;

  guestOf?: "groom" | "bride";
}

export interface ConfirmAttendanceRequest {
  isAttendance: "attendance" | "not_attendance";
  guestSlug?: string;
  guestOf?: "groom" | "bride";
  name?: string;
}

export const WeddingPageApi = {
  useGetCarousel: () =>
    useFetch<string[]>(
      `v1/public/${getSubdomain()}/images?type=${EImageStoreType.CAROUSEL}`
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

    const confirm = async (body: ConfirmAttendanceRequest) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/v1/public/${username}/confirm-attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        setResponse(json);
        return json;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return { confirm, loading, response, error };
  },
  // V�� dụ POST
  // useCreateGuest: () => {
  //   const config = {
  //     url: "v1/guests",
  //     method: "POST",
  //     buildOptions: (data: any) => ({
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     }),
  //   };
  //   return useFetch(config.url, config.buildOptions({}));
  // },
  // // Ví dụ endpoint động
  // getImageById: (id: string) => ({
  //   url: `v1/images/${id}`,
  //   method: "GET",
  // }),
};
