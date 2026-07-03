interface props {
    className?: string;
}
const NosepinsTabIcon = ({ className }: props) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M20 13.125V35.625" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20 33.75C20.9205 33.75 21.6667 33.0038 21.6667 32.0833C21.6667 31.1628 20.9205 30.4166 20 30.4166C19.0796 30.4166 18.3334 31.1628 18.3334 32.0833C18.3334 33.0038 19.0796 33.75 20 33.75Z" fill="currentColor" />
            <path d="M16.25 7.76786L20 4.375L23.75 7.76786V12.8571L20 16.25L16.25 12.8571V7.76786Z" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.25 8.125H23.75" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20 4.375V16.25" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
export default NosepinsTabIcon;