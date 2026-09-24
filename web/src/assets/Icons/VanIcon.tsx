import { cn } from "@/shared/utils/cn";

interface props {
    className?: string;
}
const VanIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("block size-6 shrink-0", className)}>
            <path d="M17 6.5H20.9919C21.1413 6.49993 21.2874 6.54451 21.4113 6.62803C21.5353 6.71155 21.6315 6.8302 21.6875 6.96875L23 10.25" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12.5H17" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.75 19.25C18.9926 19.25 20 18.2426 20 17C20 15.7574 18.9926 14.75 17.75 14.75C16.5074 14.75 15.5 15.7574 15.5 17C15.5 18.2426 16.5074 19.25 17.75 19.25Z" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.25 19.25C8.49264 19.25 9.5 18.2426 9.5 17C9.5 15.7574 8.49264 14.75 7.25 14.75C6.00736 14.75 5 15.7574 5 17C5 18.2426 6.00736 19.25 7.25 19.25Z" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 10.25H23V16.25C23 16.4489 22.921 16.6397 22.7803 16.7803C22.6397 16.921 22.4489 17 22.25 17H20" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 17H2.75C2.55109 17 2.36032 16.921 2.21967 16.7803C2.07902 16.6397 2 16.4489 2 16.25V5.75C2 5.55109 2.07902 5.36032 2.21967 5.21967C2.36032 5.07902 2.55109 5 2.75 5H17V14.8784" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export default VanIcon;