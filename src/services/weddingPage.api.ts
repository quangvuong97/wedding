import { getSubdomain, EImageStoreType } from "./api";
import useFetch from "./common";

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
  // Ví dụ POST
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
