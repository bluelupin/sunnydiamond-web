interface props {
    className?: string;
}
const MenuIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 8H21" stroke="currentColor" strokeLinejoin="round" />
            <path d="M3 15H21" stroke="currentColor" strokeLinejoin="round" />
        </svg>
    )
}
export default MenuIcon;