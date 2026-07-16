interface props {
    className?: string;
}
const DeleteIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M18.2 6.2H5M11.6 9.13333V15.7333M6.46667 6.2H16.7333L16.3667 18.6667H6.83333L6.46667 6.2ZM9.03333 4H14.1667V6.2H9.03333V4Z" stroke="#0A0A0A" strokeLinecap="square" />
        </svg>
    )
}
export default DeleteIcon;