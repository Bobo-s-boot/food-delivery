import { useReducedMotion } from "motion/react";

export const landingViewport = { once: true, amount: 0.28 };

export function useLandingMotion() {
  const reduced = useReducedMotion();

  return {
    reduced,
    viewport: landingViewport,
    heroContainer: {
      hidden: reduced ? { opacity: 1 } : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: reduced
          ? { duration: 0 }
          : { staggerChildren: 0.11, delayChildren: 0.12 },
      },
    },
    heroItem: {
      hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      },
    },
    heroCta: {
      hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    },
    heroPanel: {
      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] },
      },
    },
    sectionHeader: {
      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      },
    },
    highlightsLeft: {
      hidden: reduced ? { opacity: 1 } : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: reduced
          ? { duration: 0 }
          : { staggerChildren: 0.14, delayChildren: 0.06 },
      },
    },
    highlightsLeftChild: {
      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
      },
    },
    highlightsStatsGroup: {
      hidden: reduced ? { opacity: 1 } : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: reduced
          ? { duration: 0 }
          : { staggerChildren: 0.1, delayChildren: 0.05 },
      },
    },
    statItem: {
      hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.92 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 24 },
      },
    },
    highlightCard: (index) => ({
      hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: reduced
          ? { duration: 0 }
          : {
              duration: 0.55,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            },
      },
    }),
    gridContainer: {
      hidden: reduced ? { opacity: 1 } : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: reduced
          ? { duration: 0 }
          : { staggerChildren: 0.09, delayChildren: 0.15 },
      },
    },
    gridItem: {
      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    },
    footerRow: {
      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
      },
    },
  };
}
