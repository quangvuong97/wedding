const Gallery: React.FC = () => {
  const images = [
    "https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/story/4.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/7.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/8.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/9.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/10.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/11.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/12.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-2.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-3.jpg",
  ];
  return (
    <section className="py-[120px] maxMd:py-[90px] maxLg:py-[80px]">
      <div className="w-full px-3 mx-auto">
        <div className="flex flex-wrap -mx-3 -mt-0">
          <div className="mb-[60px] text-center maxLg:mb-[40px] flex-shrink-0 w-full max-w-full px-3 mt-0">
            <img
              src="https://wpocean.com/html/tf/loveme/assets/images/section-title2.png"
              alt=""
              className="max-w-full align-middle inline"
            />
            <h2 className="text-[40px] leading-[55px] my-[15px] relative uppercase font-[Futura_PT] font-medium text-[#002642] maxLg:text-[32px] maxLg:leading-[40px] maxSsm:text-[22px]">
              Sweet Moments
            </h2>
            <div
              className="max-w-[200px] mx-auto relative
            [&::before]:absolute [&::before]:left-[-70px] [&::before]:top-1/2 [&::before]:-translate-y-1/2 [&::before]:content-[''] [&::before]:w-[144px] [&::before]:h-[1px] [&::before]:bg-[#86a0b6]
            [&::after]:absolute [&::after]:right-[-70px] [&::after]:top-1/2 [&::after]:-translate-y-1/2 [&::after]:content-[''] [&::after]:w-[144px] [&::after]:h-[1px] [&::after]:bg-[#86a0b6]"
            >
              <div className="absolute left-1/2 w-[15px] h-[15px] border border-[#86a0b6] rounded-full -translate-x-1/2 -top-[5px]"></div>
            </div>
          </div>
        </div>
        <div data-v-3b25e534="" className="columns-[16rem]">
          {images.map((image) => {
            return (
              <div className="relative text-[14px] box-border">
                <img
                  alt=""
                  className="w-full h-auto align-middle box-border mb-4 max-w-full block"
                  src={image}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white bg-[rgba(0,0,0,0.5)] cursor-pointer opacity-0 transition-opacity duration-300">
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis px-1 box-border">
                    <span
                      aria-label="eye"
                      className="me-1 inline-block text-inherit font-normal leading-none text-center no-underline align-[-0.125em] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]"
                    >
                      <svg
                        focusable="false"
                        data-icon="eye"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        viewBox="64 64 896 896"
                      >
                        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                      </svg>
                    </span>
                    Preview
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
