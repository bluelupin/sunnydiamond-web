"use client";

import {
    ComponentPropsWithoutRef,
    ElementType,
    useEffect,
    useMemo,
    useState,
    type ComponentType,
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

// Cache motion wrappers so accordion/state updates don't remount siblings.
const motionComponentCache = new Map<ElementType, ComponentType<Record<string, unknown>>>();

function getMotionComponent(tag: ElementType) {
    const cached = motionComponentCache.get(tag);
    if (cached) return cached;

    const created = motion.create(tag) as ComponentType<Record<string, unknown>>;
    motionComponentCache.set(tag, created);
    return created;
}

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
    const [isMounted, setIsMounted] = useState(false);
    const tag = as || "div";
    const Component = useMemo(() => getMotionComponent(tag), [tag]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
            initial={isMounted ? initial : false}
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
