interface Props {
    className?: string;
    fill?: string;
    stroke?: string;
}

const LeftArrow = ({
    className,
    fill = "currentColor",
    stroke = "currentColor",
}: Props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M20.25 12H3.75" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default LeftArrow;