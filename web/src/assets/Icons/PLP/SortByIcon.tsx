interface props {
    className?: string;
}
const SortByIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M19 9L12.5 15.5L6 9" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export default SortByIcon;


