interface props {
    className?: string;
}
const DiamondIcon = ({ className }: props) => {
    return (
        <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M15.4286 24L26.8571 11.1429L22.5714 4H8.28571L4 11.1429L15.4286 24ZM15.4286 24V4.47619" stroke="currentColor" strokeWidth="0.952381" />
        </svg>

    )
}
export default DiamondIcon;