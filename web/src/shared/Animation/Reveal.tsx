"use client";

import {
    ComponentPropsWithoutRef,
    ElementType,
} from "react";
import { motion } from "motion/react";

type Direction = "up" | "down" | "left" | "right";

type RevealProps<T extends ElementType = "div"> = {
    as?: T;
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    amount?: number;
    margin?: string;
    ease?: "linear" | "easeIn" | "easeOut" | "easeInOut";
} & ComponentPropsWithoutRef<T>;

export default function Reveal<T extends ElementType = "div">({
    as,
    direction = "up",
    delay = 0,
    duration = 0.8,
    distance = 100,
    once = true,
    amount = 0,
    margin = "0px 0px -100px 0px",
    ease = "easeInOut",
    children,
    ...props
}: RevealProps<T>) {
    const Component = motion.create(as || "div");

    const initial = {
        opacity: 0,
        x:
            direction === "left"
                ? -distance
                : direction === "right"
                    ? distance
                    : 0,
        y:
            direction === "up"
                ? distance
                : direction === "down"
                    ? -distance
                    : 0,
    };

    return (
        <Component
            initial={initial}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{
                once,
                amount,
                margin,
            }}
            transition={{
                duration,
                delay,
                ease,
            }}
            {...props}
        >
            {children}
        </Component>
    );
}

// "use client";

// import { motion } from "motion/react";
// import {
//     ComponentPropsWithoutRef,
//     ElementType,
// } from "react";

// type Direction = "up" | "down" | "left" | "right";

// type RevealProps<T extends ElementType> = {
//     as?: T;
//     direction?: Direction;
//     delay?: number;
//     duration?: number;
//     distance?: number;
//     once?: boolean;
//     amount?: number;
// } & ComponentPropsWithoutRef<T>;

// export default function Reveal<T extends ElementType = "div">({
//     as,
//     direction = "up",
//     delay = 0,
//     duration = 0.8,
//     distance = 40,
//     once = true,
//     amount = 0.2,
//     children,
//     ...props
// }: RevealProps<T>) {
//     const Component = motion.create(as || "div");

//     const initial = {
//         opacity: 0,
//         x:
//             direction === "left"
//                 ? -distance
//                 : direction === "right"
//                     ? distance
//                     : 0,
//         y:
//             direction === "up"
//                 ? distance
//                 : direction === "down"
//                     ? -distance
//                     : 0,
//     };

//     return (
//         <Component
//             initial={initial}
//             whileInView={{
//                 opacity: 1,
//                 x: 0,
//                 y: 0,
//             }}
//             viewport={{
//                 once,
//                 amount,
//             }}
//             transition={{
//                 duration,
//                 delay,
//                 ease: "easeInOut",
//             }}
//             {...props}
//         >
//             {children}
//         </Component>
//     );
// }