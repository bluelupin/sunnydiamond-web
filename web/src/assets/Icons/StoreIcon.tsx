import { cn } from "@/shared/utils/cn";

interface props {
    className?: string;
}
const StoreIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("block size-6 shrink-0", className)}>
            <path d="M4.5 13.3364V20.4999H19.5V13.3364" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.0625 4H18.9375C19.1004 4.00003 19.2589 4.05311 19.389 4.15122C19.519 4.24932 19.6136 4.38711 19.6584 4.54375L21 9.25H3L4.34438 4.54375C4.38904 4.38757 4.48321 4.25012 4.61272 4.15206C4.74222 4.054 4.90006 4.00064 5.0625 4Z" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9.25V10.75C9 11.5456 8.68393 12.3087 8.12132 12.8713C7.55871 13.4339 6.79565 13.75 6 13.75C5.20435 13.75 4.44129 13.4339 3.87868 12.8713C3.31607 12.3087 3 11.5456 3 10.75V9.25" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 9.25V10.75C15 11.5456 14.6839 12.3087 14.1213 12.8713C13.5587 13.4339 12.7956 13.75 12 13.75C11.2044 13.75 10.4413 13.4339 9.87868 12.8713C9.31607 12.3087 9 11.5456 9 10.75V9.25" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 9.25V10.75C21 11.5456 20.6839 12.3087 20.1213 12.8713C19.5587 13.4339 18.7956 13.75 18 13.75C17.2044 13.75 16.4413 13.4339 15.8787 12.8713C15.3161 12.3087 15 11.5456 15 10.75V9.25" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}
export default StoreIcon;