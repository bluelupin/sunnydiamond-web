import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import SDTextLogo from "@/assets/Icons/SDTextLogo";
import { paymentLogoMap } from "@/components/shared/PaymentLogos";

type SocialIconProps = React.SVGProps<SVGSVGElement> & {
  label: string;
};

const SocialIconBase = ({
  children,
  label,
  ...props
}: SocialIconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="img"
    aria-label={label}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

const InstagramIcon = ({ label, ...props }: SocialIconProps) => (
  <SocialIconBase label={label} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
  </SocialIconBase>
);

const FacebookIcon = ({ label, ...props }: SocialIconProps) => (
  <SocialIconBase label={label} {...props}>
    <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.2l.8-3H13V9c0-.6.4-1 1-1Z" />
  </SocialIconBase>
);

const XIcon = ({ label, ...props }: SocialIconProps) => (
  <SocialIconBase label={label} {...props}>
    <path d="M5 5l14 14" />
    <path d="M19 5L5 19" />
  </SocialIconBase>
);

const LinkedInIcon = ({ label, ...props }: SocialIconProps) => (
  <SocialIconBase label={label} {...props}>
    <rect x="5" y="9" width="3" height="10" rx="0.75" />
    <path d="M11 19V11" />
    <path d="M11 14c0-1.7 1.2-3 2.8-3 1.5 0 2.2.9 2.2 2.9V19" />
    <circle cx="6.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
  </SocialIconBase>
);

const Footer = () => {
  const { brand, navigation, social } = siteConfig;
  const { columns, trustSignals, paymentMethods } = navigation.footer;

  const marqueeItems = [...trustSignals, ...trustSignals, ...trustSignals];

  const socialLinks = [
    { icon: InstagramIcon, href: social.instagram, label: "Instagram" },
    { icon: FacebookIcon, href: social.facebook, label: "Facebook" },
    { icon: XIcon, href: "#", label: "X" },
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
            <h4 className="md:text-lg sm:text-base text-sm font-medium font-satoshi uppercase text-blackdark md:mb-8 sm-6 mb-4">
              {col.heading}
            </h4>
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
              <Icon strokeWidth={1.5} className="w-6 h-6 sm:text-darkMagenta text-darkblack" label={label} />
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
