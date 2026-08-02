interface props {
    className?: string;
}
const BanglesTabIcon = ({ className }: props) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M20 32.0834C28.2843 32.0834 35 28.6432 35 24.3995C35 20.1559 28.2843 16.7157 20 16.7157C11.7157 16.7157 5 20.1559 5 24.3995C5 28.6432 11.7157 32.0834 20 32.0834Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 23.701C28.2843 23.701 35 20.2609 35 16.0172C35 11.7735 28.2843 8.33337 20 8.33337C11.7157 8.33337 5 11.7735 5 16.0172C5 20.2609 11.7157 23.701 20 23.701Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 16.0172V24.3996" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 16.0172V24.3996" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export default BanglesTabIcon;