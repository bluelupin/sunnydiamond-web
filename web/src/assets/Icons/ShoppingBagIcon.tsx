interface props {
    className?: string;
}
const ShoppingBagIcon = ({ className }: props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M19.2609 9.69589L20.6455 18.6959C20.8319 19.9074 19.8945 21 18.6688 21H5.33124C4.10547 21 3.16811 19.9074 3.3545 18.6959L4.73911 9.69589C4.88922 8.72022 5.72872 8 6.71586 8H17.2842C18.2713 8 19.1108 8.72022 19.2609 9.69589Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
            <path d="M14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5} />
        </svg>

    )
}
export default ShoppingBagIcon;