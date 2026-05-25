# Sunny Diamonds Tech Stack

## Runtime
- Next.js: 16.2.4
- React: 19.2.6
- React DOM: 19.2.6
- TypeScript: 5.x

## Styling
- Tailwind CSS: 3.4.17
- tailwindcss-animate: 1.0.7
- styled-components: 6.4.1
- tailwind-merge: 3.6.0
- class-variance-authority: 0.7.1
- clsx: 2.1.1

## UI / Components
- Radix UI Checkbox: 1.3.3
- Radix UI Dialog: 1.1.15
- Radix UI Dropdown Menu: 2.1.16
- Radix UI Label: 2.1.8
- Radix UI Popover: 1.1.15
- Radix UI Select: 2.2.6
- Radix UI Slot: 1.2.4
- Radix UI Tooltip: 1.2.8
- Lucide React: 1.14.0
- Next Themes: 0.4.6
- Sonner: 2.0.7
- Vaul: 1.1.2

## Forms / Data / Charts
- React Hook Form: 7.75.0
- React Select: 5.10.2
- Recharts: 3.8.1
- Embla Carousel React: 8.6.0

## Tooling
- ESLint: 9.x
- ESLint Config Next: 16.2.4
- PostCSS: 8.5.6
- Autoprefixer: 10.4.21
- Tailwind CSS: 3.4.17
- postcss-styled-syntax: 0.7.1

## App Scripts
- `npm run dev` -> `next dev`
- `npm run build` -> `next build`
- `npm run start` -> `next start`
- `npm run lint` -> `eslint`

## Notes
- PWA manifest is configured in `public/manifest.json`.
- The home page requests video assets at `/videos/hero-bg.mp4` and `/videos/promise-bg.mp4`.
- If those files are not present in `public/videos/`, the browser will show 404s for those assets.
