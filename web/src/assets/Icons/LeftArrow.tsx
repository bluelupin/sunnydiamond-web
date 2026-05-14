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
        <svg
            width="31"
            height="17"
            viewBox="0 0 31 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8.67578 16.4795L9.77539 15.4131L3.77441 9.59375L3.33106 9.16406L30.6387 9.16406L30.6387 7.66406L3.33106 7.66406L3.77441 7.23437L9.77539 1.41309L8.67578 0.347656L0.358399 8.41406L8.67578 16.4795Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.3"
            />
        </svg>
    );
};

export default LeftArrow;