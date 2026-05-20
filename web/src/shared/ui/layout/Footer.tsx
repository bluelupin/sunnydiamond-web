import Link from "next/link";
import { siteConfig } from "@/shared/lib/siteConfig";
import SDTextLogo from "@/assets/Icons/SDTextLogo";
import { paymentLogoMap } from "@/shared/ui/PaymentLogos";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_254_542_instagram)">
      <path d="M12 2.16094C15.2063 2.16094 15.5859 2.175 16.8469 2.23125C18.0188 2.28281 18.6516 2.47969 19.0734 2.64375C19.6313 2.85938 20.0344 3.12188 20.4516 3.53906C20.8734 3.96094 21.1313 4.35938 21.3469 4.91719C21.5109 5.33906 21.7078 5.97656 21.7594 7.14375C21.8156 8.40937 21.8297 8.78906 21.8297 11.9906C21.8297 15.1969 21.8156 15.5766 21.7594 16.8375C21.7078 18.0094 21.5109 18.6422 21.3469 19.0641C21.1313 19.6219 20.8687 20.025 20.4516 20.4422C20.0297 20.8641 19.6313 21.1219 19.0734 21.3375C18.6516 21.5016 18.0141 21.6984 16.8469 21.75C15.5813 21.8062 15.2016 21.8203 12 21.8203C8.79375 21.8203 8.41406 21.8062 7.15313 21.75C5.98125 21.6984 5.34844 21.5016 4.92656 21.3375C4.36875 21.1219 3.96563 20.8594 3.54844 20.4422C3.12656 20.0203 2.86875 19.6219 2.65313 19.0641C2.48906 18.6422 2.29219 18.0047 2.24063 16.8375C2.18438 15.5719 2.17031 15.1922 2.17031 11.9906C2.17031 8.78438 2.18438 8.40469 2.24063 7.14375C2.29219 5.97187 2.48906 5.33906 2.65313 4.91719C2.86875 4.35938 3.13125 3.95625 3.54844 3.53906C3.97031 3.11719 4.36875 2.85938 4.92656 2.64375C5.34844 2.47969 5.98594 2.28281 7.15313 2.23125C8.41406 2.175 8.79375 2.16094 12 2.16094ZM12 0C8.74219 0 8.33438 0.0140625 7.05469 0.0703125C5.77969 0.126563 4.90313 0.332812 4.14375 0.628125C3.35156 0.9375 2.68125 1.34531 2.01563 2.01562C1.34531 2.68125 0.9375 3.35156 0.628125 4.13906C0.332812 4.90313 0.126563 5.775 0.0703125 7.05C0.0140625 8.33437 0 8.74219 0 12C0 15.2578 0.0140625 15.6656 0.0703125 16.9453C0.126563 18.2203 0.332812 19.0969 0.628125 19.8563C0.9375 20.6484 1.34531 21.3188 2.01563 21.9844C2.68125 22.65 3.35156 23.0625 4.13906 23.3672C4.90313 23.6625 5.775 23.8687 7.05 23.925C8.32969 23.9812 8.7375 23.9953 11.9953 23.9953C15.2531 23.9953 15.6609 23.9812 16.9406 23.925C18.2156 23.8687 19.0922 23.6625 19.8516 23.3672C20.6391 23.0625 21.3094 22.65 21.975 21.9844C22.6406 21.3188 23.0531 20.6484 23.3578 19.8609C23.6531 19.0969 23.8594 18.225 23.9156 16.95C23.9719 15.6703 23.9859 15.2625 23.9859 12.0047C23.9859 8.74688 23.9719 8.33906 23.9156 7.05938C23.8594 5.78438 23.6531 4.90781 23.3578 4.14844C23.0625 3.35156 22.6547 2.68125 21.9844 2.01562C21.3188 1.35 20.6484 0.9375 19.8609 0.632812C19.0969 0.3375 18.225 0.13125 16.95 0.075C15.6656 0.0140625 15.2578 0 12 0Z" fill="currentColor" />
      <path d="M12 5.83594C8.59688 5.83594 5.83594 8.59688 5.83594 12C5.83594 15.4031 8.59688 18.1641 12 18.1641C15.4031 18.1641 18.1641 15.4031 18.1641 12C18.1641 8.59688 15.4031 5.83594 12 5.83594ZM12 15.9984C9.79219 15.9984 8.00156 14.2078 8.00156 12C8.00156 9.79219 9.79219 8.00156 12 8.00156C14.2078 8.00156 15.9984 9.79219 15.9984 12C15.9984 14.2078 14.2078 15.9984 12 15.9984Z" fill="currentColor" />
      <path d="M19.8469 5.59141C19.8469 6.38828 19.2 7.03047 18.4078 7.03047C17.6109 7.03047 16.9688 6.3836 16.9688 5.59141C16.9688 4.79453 17.6156 4.15234 18.4078 4.15234C19.2 4.15234 19.8469 4.79922 19.8469 5.59141Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_254_542_instagram">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_254_547_facebook)">
      <path d="M12 0C5.37264 0 0 5.37264 0 12C0 17.6275 3.87456 22.3498 9.10128 23.6467V15.6672H6.62688V12H9.10128V10.4198C9.10128 6.33552 10.9498 4.4424 14.9597 4.4424C15.72 4.4424 17.0318 4.59168 17.5685 4.74048V8.06448C17.2853 8.03472 16.7933 8.01984 16.1822 8.01984C14.2147 8.01984 13.4544 8.76528 13.4544 10.703V12H17.3741L16.7006 15.6672H13.4544V23.9122C19.3963 23.1946 24.0005 18.1354 24.0005 12C24 5.37264 18.6274 0 12 0Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_254_547_facebook">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18.3263 1.90234H21.6998L14.3297 10.3258L23 21.7883H16.2112L10.894 14.8364L4.80995 21.7883H1.43443L9.31743 12.7784L1 1.90234H7.96111L12.7674 8.25668L18.3263 1.90234ZM17.1423 19.7691H19.0116L6.94539 3.81548H4.93946L17.1423 19.7691Z" fill="currentColor" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_254_542_linkedin)">
      <path d="M12 2.16094C15.2063 2.16094 15.5859 2.175 16.8469 2.23125C18.0188 2.28281 18.6516 2.47969 19.0734 2.64375C19.6313 2.85938 20.0344 3.12188 20.4516 3.53906C20.8734 3.96094 21.1313 4.35938 21.3469 4.91719C21.5109 5.33906 21.7078 5.97656 21.7594 7.14375C21.8156 8.40937 21.8297 8.78906 21.8297 11.9906C21.8297 15.1969 21.8156 15.5766 21.7594 16.8375C21.7078 18.0094 21.5109 18.6422 21.3469 19.0641C21.1313 19.6219 20.8687 20.025 20.4516 20.4422C20.0297 20.8641 19.6313 21.1219 19.0734 21.3375C18.6516 21.5016 18.0141 21.6984 16.8469 21.75C15.5813 21.8062 15.2016 21.8203 12 21.8203C8.79375 21.8203 8.41406 21.8062 7.15313 21.75C5.98125 21.6984 5.34844 21.5016 4.92656 21.3375C4.36875 21.1219 3.96563 20.8594 3.54844 20.4422C3.12656 20.0203 2.86875 19.6219 2.65313 19.0641C2.48906 18.6422 2.29219 18.0047 2.24063 16.8375C2.18438 15.5719 2.17031 15.1922 2.17031 11.9906C2.17031 8.78438 2.18438 8.40469 2.24063 7.14375C2.29219 5.97187 2.48906 5.33906 2.65313 4.91719C2.86875 4.35938 3.13125 3.95625 3.54844 3.53906C3.97031 3.11719 4.36875 2.85938 4.92656 2.64375C5.34844 2.47969 5.98594 2.28281 7.15313 2.23125C8.41406 2.175 8.79375 2.16094 12 2.16094ZM12 0C8.74219 0 8.33438 0.0140625 7.05469 0.0703125C5.77969 0.126563 4.90313 0.332812 4.14375 0.628125C3.35156 0.9375 2.68125 1.34531 2.01563 2.01562C1.34531 2.68125 0.9375 3.35156 0.628125 4.13906C0.332812 4.90313 0.126563 5.775 0.0703125 7.05C0.0140625 8.33437 0 8.74219 0 12C0 15.2578 0.0140625 15.6656 0.0703125 16.9453C0.126563 18.2203 0.332812 19.0969 0.628125 19.8563C0.9375 20.6484 1.34531 21.3188 2.01563 21.9844C2.68125 22.65 3.35156 23.0625 4.13906 23.3672C4.90313 23.6625 5.775 23.8687 7.05 23.925C8.32969 23.9812 8.7375 23.9953 11.9953 23.9953C15.2531 23.9953 15.6609 23.9812 16.9406 23.925C18.2156 23.8687 19.0922 23.6625 19.8516 23.3672C20.6391 23.0625 21.3094 22.65 21.975 21.9844C22.6406 21.3188 23.0531 20.6484 23.3578 19.8609C23.6531 19.0969 23.8594 18.225 23.9156 16.95C23.9719 15.6703 23.9859 15.2625 23.9859 12.0047C23.9859 8.74688 23.9719 8.33906 23.9156 7.05938C23.8594 5.78438 23.6531 4.90781 23.3578 4.14844C23.0625 3.35156 22.6547 2.68125 21.9844 2.01562C21.3188 1.35 20.6484 0.9375 19.8609 0.632812C19.0969 0.3375 18.225 0.13125 16.95 0.075C15.6656 0.0140625 15.2578 0 12 0Z" fill="currentColor" />
      <path d="M12 5.83594C8.59688 5.83594 5.83594 8.59688 5.83594 12C5.83594 15.4031 8.59688 18.1641 12 18.1641C15.4031 18.1641 18.1641 15.4031 18.1641 12C18.1641 8.59688 15.4031 5.83594 12 5.83594ZM12 15.9984C9.79219 15.9984 8.00156 14.2078 8.00156 12C8.00156 9.79219 9.79219 8.00156 12 8.00156C14.2078 8.00156 15.9984 9.79219 15.9984 12C15.9984 14.2078 14.2078 15.9984 12 15.9984Z" fill="currentColor" />
      <path d="M19.8469 5.59141C19.8469 6.38828 19.2 7.03047 18.4078 7.03047C17.6109 7.03047 16.9688 6.3836 16.9688 5.59141C16.9688 4.79453 17.6156 4.15234 18.4078 4.15234C19.2 4.15234 19.8469 4.79922 19.8469 5.59141Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_254_542_linkedin">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Footer = () => {
  const { brand, navigation, social } = siteConfig;
  const { columns, trustSignals, paymentMethods } = navigation.footer;

  const marqueeItems = [...trustSignals, ...trustSignals, ...trustSignals];

  const socialLinks = [
    { icon: InstagramIcon, href: social.instagram, label: "Instagram" },
    { icon: FacebookIcon, href: social.facebook, label: "Facebook" },
    { icon: XIcon, href: "#", label: "Twitter" },
    { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray300">
      {/* Top trust-signals marquee */}
      <div className="overflow-hidden h-16 flex items-center">
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <span
                key={`a-${i}`}
                className="mx-8 inline-flex items-center font-light text-sm tracking-[0.25em] uppercase text-gray500"
              >
                {item}
                <span className="ml-16 h-1 w-1 rounded-full bg-gray600" aria-hidden="true" />
              </span>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 animate-marquee whitespace-nowrap"
          >
            {marqueeItems.map((item, i) => (
              <span
                key={`b-${i}`}
                className="mx-8 inline-flex items-center font-light text-sm tracking-[0.25em] uppercase text-gray500"
              >
                {item}
                <span className="ml-16 h-1 w-1 rounded-full bg-gray600" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-1440 xl:px-20 lg:px-16 md:px-14 sm:px-10 px-5 mx-auto lg:py-30 md:py-24 sm:py-20 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-10 lg:gap-x-8 md:gap-x-6 sm:gap-x-4 gap-x-3 xl:gap-y-16 lg:gap-y-14 md:gap-y-12 sm:gap-y-10 gap-y-9">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col lg:items-start items-center">
          <Link href="/" aria-label={brand.name} className="inline-flex flex-col items-center">
            <SDTextLogo className="sm:text-darkMagenta text-darkblack" />
          </Link>
        </div>

        {/* Nav columns */}
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="md:text-lg sm:text-base text-sm font-medium font-satoshi uppercase text-blackdark md:mb-8 sm-6 mb-4">
              {col.heading}
            </h3>
            <ul className="sm:space-y-4 space-y-3">
              {col.links.map((link, idx) => (
                <li key={`${col.heading}-${idx}`} className="max-w-[14rem]">
                  <Link
                    href={link.to}
                    className="inline-block max-w-full break-words hyphens-auto text-sm leading-relaxed sm:leading-relaxed lg:leading-6 font-normal font-satoshi text-blackdark transition-all duration-500 transform hover:text-darkMagenta hover:underline underline-offset-4 hover:translate-x-2 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkMagenta focus-visible:ring-offset-2 focus-visible:ring-offset-gray300 focus-visible:text-darkMagenta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar: social, payment, copyright */}
      <div className="max-w-1440 xl:px-20 lg:px-16 md:px-14 sm:px-10 px-5 lg:pb-30 md:pb-24 sm:pb-20 pb-16 mx-auto flex items-center xl:justify-between justify-center md:gap-8 sm:gap-6 gap-6 flex-wrap">
        {/* Social */}
        <div className="flex items-center md:gap-7 sm:gap-5 gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 duration-500 transition-all"
            >
              <Icon className="w-6 h-6 sm:text-darkMagenta text-darkblack" />
            </a>
          ))}
        </div>
        {/* Payment methods */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {paymentMethods.map((method) => {
            const entry = paymentLogoMap[method];
            if (!entry) {
              return (
                <span
                  key={method}
                  className="inline-flex items-center justify-center h-7 px-2.5 rounded-sm bg-card border border-border text-[10px] font-semibold tracking-wider uppercase text-foreground/80"
                >
                  {method}
                </span>
              );
            }
            const { Logo, label } = entry;
            return (
              <span
                key={method}
                role="img"
                aria-label={label}
                title={label}
                className="inline-flex items-center justify-center h-7 w-12 px-1.5 rounded-sm bg-white border border-border"
              >
                <Logo className="h-full w-auto max-w-full" />
              </span>
            );
          })}
        </div>
        {/* Copyright */}
        <p className="sm:text-sm text-xs text-nuetral200 font-normal font-satoshi">
          © {new Date().getFullYear()} {brand.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
