interface Props {
    className?: string;
    fill?: string;
    stroke?: string;
}

const RightArrow = ({
    className,
    fill = "currentColor",
    stroke = "currentColor",
}: Props) => {
    return (
        <svg
            width="30"
            height="17"
            viewBox="0 0 30 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M21.5382 16.4746L20.4776 15.4141L26.7276 9.16406L0.250106 9.16406L0.250106 7.66406L26.7276 7.66406L20.4776 1.41406L21.5382 0.353515L29.5987 8.41406L21.5382 16.4746Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.3"
            />
        </svg>

    )
}
export default RightArrow;