interface props {
    className?: string;
}
const AllTabIcon = ({ className }: props) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M17 5.5V17H5.5V5.5H17Z" stroke="currentColor" />
            <path d="M34.5 5.5V17H23V5.5H34.5Z" stroke="currentColor" />
            <path d="M16.9998 23.0002V34.5002H5.49976V23.0002H16.9998Z" stroke="currentColor" />
            <path d="M34.5 23V34.5H23V23H34.5Z" stroke="currentColor" />
        </svg>

    )
}
export default AllTabIcon;