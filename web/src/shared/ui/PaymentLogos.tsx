import type { ReactElement, SVGProps } from "react";

/**
 * Payment provider logos as inline SVGs.
 * Sized via parent (height/width classes). Backgrounds are white tiles
 * so brand marks stay legible on any footer background.
 */

type LogoProps = SVGProps<SVGSVGElement>;

export const VisaLogo = (props: LogoProps) => (
  <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <text
      x="24"
      y="13"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontStyle="italic"
      fontSize="14"
      fill="#1A1F71"
      letterSpacing="0.5"
    >
      VISA
    </text>
  </svg>
);

export const MastercardLogo = (props: LogoProps) => (
  <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <circle cx="20" cy="16" r="10" fill="#EB001B" />
    <circle cx="28" cy="16" r="10" fill="#F79E1B" />
    <path
      d="M24 8.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z"
      fill="#FF5F00"
    />
  </svg>
);

export const AmexLogo = (props: LogoProps) => (
  <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <rect width="48" height="32" rx="3" fill="#1F72CD" />
    <text
      x="24"
      y="14"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="6"
      fill="#FFFFFF"
      letterSpacing="0.5"
    >
      AMERICAN
    </text>
    <text
      x="24"
      y="22"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="6"
      fill="#FFFFFF"
      letterSpacing="0.5"
    >
      EXPRESS
    </text>
  </svg>
);

export const MaestroLogo = (props: LogoProps) => (
  <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <circle cx="20" cy="16" r="10" fill="#0099DF" />
    <circle cx="28" cy="16" r="10" fill="#ED0006" />
    <path d="M24 8.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z" fill="#6C6BBD" />
  </svg>
);

export const UpiLogo = (props: LogoProps) => (
  <svg viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <text
      x="2"
      y="15"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="13"
      fill="#097939"
    >
      UP
    </text>
    <text
      x="22"
      y="15"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="13"
      fill="#ED752E"
    >
      I
    </text>
    <polygon points="30,4 38,10 30,16" fill="#747474" />
  </svg>
);

export const PaytmLogo = (props: LogoProps) => (
  <svg viewBox="0 0 56 20" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <text
      x="2"
      y="11"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="8"
      fill="#00BAF2"
    >
      pay
    </text>
    <text
      x="2"
      y="18"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="8"
      fill="#002970"
    >
      tm
    </text>
  </svg>
);

export const RupayLogo = (props: LogoProps) => (
  <svg viewBox="0 0 56 20" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
    <text
      x="2"
      y="14"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontStyle="italic"
      fontSize="11"
      fill="#097939"
    >
      Ru
    </text>
    <text
      x="22"
      y="14"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontStyle="italic"
      fontSize="11"
      fill="#1F72CD"
    >
      Pay
    </text>
  </svg>
);

export const paymentLogoMap: Record<
  string,
  { Logo: (props: LogoProps) => ReactElement; label: string }
> = {
  Visa: { Logo: VisaLogo, label: "Visa" },
  Mastercard: { Logo: MastercardLogo, label: "Mastercard" },
  Amex: { Logo: AmexLogo, label: "American Express" },
  Maestro: { Logo: MaestroLogo, label: "Maestro" },
  UPI: { Logo: UpiLogo, label: "UPI" },
  Paytm: { Logo: PaytmLogo, label: "Paytm" },
  RuPay: { Logo: RupayLogo, label: "RuPay" },
};
