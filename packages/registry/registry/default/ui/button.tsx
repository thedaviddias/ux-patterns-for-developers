"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  Children,
  cloneElement,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
  type ReactElement
} from "react";
import * as Motion from "motion/react-client";
import type { HTMLMotionProps } from "motion/react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/* ================= Loading Components ================= */
const Spinner = ({ className, ...props }: HTMLAttributes<HTMLOutputElement>) => (
  <output
    className={cn(
      "inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
      className
    )}
    {...props}
  >
    <span className="sr-only">Loading...</span>
  </output>
);

const Dots = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("inline-flex gap-1", className)} {...props}>
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></span>
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></span>
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"></span>
  </span>
);

/* ================= Configuration Objects ================= */
const HAPTIC_PATTERNS = {
  light: 10,
  medium: 20,
  heavy: 30
} as const;

const SOUND_CONFIGS = {
  subtle: { frequency: 400, gain: 0.03, duration: 0.05 },
  click: { frequency: 600, gain: 0.05, duration: 0.05 }
} as const;

/* ================= Utility Functions ================= */
const triggerHaptics = (intensity: "off" | "light" | "medium" | "heavy") => {
  if (intensity === "off" || typeof navigator === "undefined") return;

  if ('vibrate' in navigator) {
    navigator.vibrate(HAPTIC_PATTERNS[intensity]);
  }
};

const playSound = (type: "off" | "subtle" | "click") => {
  if (type === "off" || typeof window === "undefined") return;

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const config = SOUND_CONFIGS[type];

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = config.frequency;
    gainNode.gain.value = config.gain;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);
  } catch {
    // Silently fail if Web Audio API is not available
  }
};

/* ================= Custom Hooks ================= */
/**
 * Hook to manage ripple effect animation
 */
const useRippleEffect = (enabled: boolean) => {
  const [rippleKey, setRippleKey] = useState<string | null>(null);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const triggerRipple = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (!enabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipplePosition({ x, y });
    setRippleKey(`${x}-${y}-${Date.now()}`);
  }, [enabled]);

  const RippleElement = rippleKey ? (
    <Motion.span
      key={rippleKey}
      className="absolute rounded-full pointer-events-none bg-white dark:bg-black"
      initial={{ scale: 0, opacity: 0.4 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        left: ripplePosition.x,
        top: ripplePosition.y,
        width: "100px",
        height: "100px",
        transform: "translate(-50%, -50%)"
      }}
      onAnimationEnd={() => setRippleKey(null)}
    />
  ) : null;

  return { triggerRipple, RippleElement };
};

/**
 * Hook to manage long press interactions
 */
const useLongPress = (config?: { duration?: number; onLongPress?: () => void }) => {
  const [pressTimer, setPressTimer] = useState<number | null>(null);

  const startLongPress = useCallback(() => {
    if (!config?.onLongPress) return;
    const id = window.setTimeout(() => config.onLongPress?.(), config.duration ?? 500);
    setPressTimer(id);
  }, [config]);

  const clearLongPress = useCallback(() => {
    if (pressTimer) window.clearTimeout(pressTimer);
    setPressTimer(null);
  }, [pressTimer]);

  return { startLongPress, clearLongPress };
};

/* ================= Type Definitions ================= */
export type ButtonState = "idle" | "loading" | "success" | "error" | "disabled";
export type ButtonClickEffect = "none" | "scale" | "ripple" | "pulse" | "spring";
export type ButtonHoverEffect = "none" | "glow" | "shine" | "shimmer" | "lift";
export type LoadingType = "spinner" | "dots";

/* ================= Button Variants Configuration ================= */
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 transition-[background,shadow,transform] select-none",
	{
		variants: {
			variant: {
				solid:
					"bg-primary text-primary-foreground shadow hover:enabled:bg-primary/90 aria-disabled:hover:bg-primary",
				outline:
					"border-2 border-primary/50 bg-transparent hover:enabled:bg-primary/5 hover:enabled:border-primary/70 aria-disabled:hover:bg-transparent aria-disabled:hover:border-primary/50",
				ghost: "hover:enabled:bg-accent hover:enabled:text-accent-foreground aria-disabled:hover:bg-transparent aria-disabled:hover:text-current",
				link: "text-primary hover:enabled:text-primary/80",
        soft:
          "bg-primary/10 text-primary hover:enabled:bg-primary/20 aria-disabled:hover:bg-primary/10",
        danger:
          "bg-red-600 text-white hover:enabled:bg-red-700 aria-disabled:hover:bg-red-600 focus-visible:ring-red-500",
        success:
          "bg-emerald-600 text-white hover:enabled:bg-emerald-700 aria-disabled:hover:bg-emerald-600 focus-visible:ring-emerald-500",
        warning:
          "bg-amber-500 text-black hover:enabled:bg-amber-600 aria-disabled:hover:bg-amber-500 focus-visible:ring-amber-500"
			},
			size: {
        xs: "h-7 min-w-[2.5rem] gap-1.5 px-2 text-[0.78rem]",
        sm: "h-8 min-w-[3rem] gap-1.5 px-3 text-[0.85rem]",
        md: "h-10 min-w-[4rem] gap-2 px-4 text-[0.925rem]",
        lg: "h-12 min-w-[4.5rem] gap-2 px-5 text-[1rem]"
      },
      clickEffect: {
        none: "",
        scale: "active:scale-[0.98]",
        ripple: "relative overflow-hidden",
        pulse: "",
        spring: ""
      },
      hoverEffect: {
        none: "",
        glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]",
        shine: "relative overflow-hidden",
        shimmer: "relative overflow-hidden",
        lift: "hover:-translate-y-0.5 transition-transform"
      },
      wide: { true: "w-full", false: "" },
      rounded: {
        default: "rounded-[var(--btn-radius,0.55rem)]",
        pill: "rounded-full"
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        colored: ""
      }
		},
    defaultVariants: {
      variant: "solid",
      size: "md",
      clickEffect: "scale",
      hoverEffect: "none",
      wide: false,
      rounded: "default",
      shadow: "none"
    },
    compoundVariants: [
      {
        variant: "danger",
        shadow: "colored",
        className: "shadow-lg shadow-red-500/25"
      },
      {
        variant: "success",
        shadow: "colored",
        className: "shadow-lg shadow-emerald-500/25"
      },
      {
        variant: "warning",
        shadow: "colored",
        className: "shadow-lg shadow-amber-500/25"
      },
      {
        variant: "solid",
        shadow: "colored",
        className: "shadow-lg shadow-primary/25"
      }
    ]
	},
);

/* ================= Button Props Interface ================= */
/**
 * Enhanced button component with motion effects, haptic feedback, and advanced state management.
 * Extends HTML button with Framer Motion support and interactive features.
 */
export type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Visual and interactive state of the button */
    state?: ButtonState;
    /** Loading indicator style (spinner or dots) */
    loadingType?: LoadingType;
    /** Text displayed during loading state */
    loadingText?: string;
    /** Text displayed on success */
    successText?: string;
    /** Text displayed on error */
    errorText?: string;
    preventDoubleClick?: boolean;
    /** Long press configuration for desktop and mobile */
    longPress?: { duration?: number; onLongPress?: () => void };
    tooltipWhenDisabled?: string;
    preserveWidth?: boolean;
    /** Haptic feedback intensity (mobile devices with vibration API) */
    haptics?: "off" | "light" | "medium" | "heavy";
    /** Audio feedback on interaction */
    sound?: "off" | "subtle" | "click";
    announceChanges?: boolean;
    analytics?: { event: string; payload?: Record<string, unknown> };
    onAction?: () => Promise<void> | void;
    /** Enable console debugging for button interactions */
    debug?: boolean;
    /** Force native HTML disabled attribute instead of aria-disabled */
    forceNativeDisabled?: boolean;
  };

/* ================= Motion Animation Helpers ================= */
const getMotionProps = (clickEffect?: ButtonClickEffect | null, hoverEffect?: ButtonHoverEffect | null): any => {
  const props: any = {};

  // Click effect animations
  switch (clickEffect) {
    case "scale":
      props.whileTap = { scale: 0.98 };
      props.transition = { duration: 0.1 };
      break;
    case "pulse":
      // Pulse effect handled by click state
      break;
    case "spring":
      props.whileTap = { scale: 0.95 };
      props.transition = { type: "spring", stiffness: 400, damping: 17 };
      break;
  }

  // Hover effect animations
  switch (hoverEffect) {
    case "glow":
      props.whileHover = {
        boxShadow: "0 0 25px rgba(var(--primary-rgb, 59,130,246), 0.5)"
      };
      if (!props.transition) props.transition = { duration: 0.3 };
      break;
    case "shine":
      // Shine effect handled by Motion.div overlay
      break;
    case "shimmer":
      // Shimmer effect handled by Motion.div overlay
      break;
  }

  return props;
};

/* ================= Main Button Component ================= */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      clickEffect,
      hoverEffect,
      wide,
      rounded,
      shadow,
      asChild = false,
      state = "idle",
      loadingType = "spinner",
      loadingText = "Working…",
      successText = "Done",
      errorText = "Try again",
      preventDoubleClick = true,
      longPress,
      tooltipWhenDisabled,
      preserveWidth = true,
      haptics: hapticPref = "off",
      sound: soundPref = "off",
      announceChanges,
      analytics,
      onAction,
      debug,
      disabled,
      forceNativeDisabled = false,
      type = "button",
      onClick,
      onMouseDown,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    /* ========== Internal State Management ========== */
    const btnRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement);

    const [minWidth, setMinWidth] = useState<number>();
    const [isClicking, setIsClicking] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const effectiveDisabled = disabled || state === "disabled";

    /* ========== Custom Hooks ========== */
    const { triggerRipple, RippleElement } = useRippleEffect(clickEffect === "ripple");
    const { startLongPress, clearLongPress } = useLongPress(longPress);

    /* ========== Width Preservation ========== */
    useLayoutEffect(() => {
      if (!preserveWidth || !btnRef.current) return;
      const el = btnRef.current;
      const capture = () => setMinWidth((w) => w ?? el.offsetWidth);
      el.addEventListener("mousedown", capture, { once: true });
      el.addEventListener("touchstart", capture, { once: true, passive: true });
      return () => {
        el.removeEventListener("mousedown", capture);
        el.removeEventListener("touchstart", capture);
      };
    }, [preserveWidth]);

    /* ========== Event Handlers ========== */
    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (effectiveDisabled || state === "loading") return;
      if (preventDoubleClick && isClicking) return;

      // Trigger pulse animation
      if (clickEffect === "pulse") {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000); // Stop after 2 seconds (1 pulse)
      }

      // Double-click prevention
      if (preventDoubleClick) {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
      }

      // Analytics tracking
      if (analytics?.event && process.env.NODE_ENV !== "test") {
        queueMicrotask(() => {
          window.dispatchEvent(
            new CustomEvent("uxp:analytics", { detail: { component: "button", ...analytics } })
          );
        });
      }

      // Interactive feedback
      triggerHaptics(hapticPref);
      playSound(soundPref);
      triggerRipple(e);

      if (onAction) await onAction();
    };

    const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(e);
      if (e.defaultPrevented) return;
      startLongPress();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if ((e.key === " " || e.key === "Enter") && longPress) startLongPress();
    };

    /* ========== Content Generation ========== */
    const label =
      state === "loading"
        ? loadingText
        : state === "success"
        ? successText
        : state === "error"
        ? errorText
        : children;

    const LoadingVisual = state === "loading" ? (
      loadingType === "dots" ? (
        <Dots aria-hidden className="-ml-1" />
      ) : (
        <Spinner aria-hidden className="-ml-1" />
      )
    ) : null;

    /* ========== AsChild Pattern Handling ========== */
    if (asChild) {
      const child = Children.only(children) as ReactElement<any>;
      return cloneElement(child, {
        className: cn(
          buttonVariants({ variant, size, clickEffect, hoverEffect, wide }),
          debug && "outline outline-dashed outline-2 outline-fuchsia-500/40",
          className,
          child.props.className
        ),
        "aria-busy": state === "loading" || undefined,
        "aria-live": announceChanges ? "polite" : undefined,
        "aria-disabled": !forceNativeDisabled && effectiveDisabled ? true : undefined,
        disabled: forceNativeDisabled && (disabled || state === "disabled") ? true : undefined,
        "data-state": state,
        style: { ...(child.props.style || {}), minWidth },
        onClick: (e: MouseEvent) => {
          child.props?.onClick?.(e);
          handleClick(e as MouseEvent<HTMLButtonElement>);
        },
        onMouseDown: (e: MouseEvent) => {
          child.props?.onMouseDown?.(e);
          handleMouseDown(e as MouseEvent<HTMLButtonElement>);
        },
        onMouseUp: (e: MouseEvent) => {
          child.props?.onMouseUp?.(e);
          clearLongPress();
        },
        onMouseLeave: (e: MouseEvent) => {
          child.props?.onMouseLeave?.(e);
          clearLongPress();
        },
        onKeyDown: (e: KeyboardEvent) => {
          child.props?.onKeyDown?.(e);
          handleKeyDown(e as KeyboardEvent<HTMLButtonElement>);
        },
        onKeyUp: (e: KeyboardEvent) => {
          child.props?.onKeyUp?.(e);
          clearLongPress();
        },
        ref: ref,
        children: (
          <>
            {RippleElement}
            {LoadingVisual}
            <span className="sr-only" aria-live={announceChanges ? "polite" : undefined} />
            {state === "loading" ? loadingText : child.props.children}
          </>
        )
      } as any);
    }

    /* ========== Main Button Render ========== */
    const Comp = asChild ? Slot : Motion.button;

    return (
      <Comp
        ref={btnRef}
        type={asChild ? undefined : type}
        className={cn(
          buttonVariants({ variant, size, clickEffect, hoverEffect, wide, rounded, shadow }),
          debug && "outline outline-dashed outline-2 outline-fuchsia-500/40",
          className
        )}
        aria-busy={state === "loading" || undefined}
        aria-live={announceChanges ? "polite" : undefined}
        aria-disabled={!forceNativeDisabled && effectiveDisabled ? true : undefined}
        disabled={forceNativeDisabled && (disabled || state === "disabled") ? true : undefined}
        data-state={state}
        style={{
          minWidth,
          position: "relative",
          // Only apply overflow hidden for effects that need it
          ...(clickEffect === "ripple" || hoverEffect === "shine" || hoverEffect === "shimmer"
            ? { overflow: "hidden" }
            : {})
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={clearLongPress}
        onMouseLeave={clearLongPress}
        onKeyDown={handleKeyDown}
        onKeyUp={clearLongPress}
        {...getMotionProps(clickEffect, hoverEffect)}
        {...props}
      >
        {/* Hover effect overlays */}
        {hoverEffect === "shine" && (
          <Motion.div
            className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-[inherit]"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
              width: "100%"
            }}
          />
        )}
        {hoverEffect === "shimmer" && (
          <Motion.div
            className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-[inherit]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              width: "200%"
            }}
            initial={{ x: "-200%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1
            }}
          />
        )}


        {/* Pulse effect */}
        {isPulsing && clickEffect === "pulse" && (
          <>
            <Motion.span
              className="absolute inset-0 rounded-[inherit] pointer-events-none dark:hidden"
              initial={{ boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.3)" }}
              animate={{ boxShadow: "0 0 0 15px rgba(0, 0, 0, 0)" }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
            />
            <Motion.span
              className="absolute inset-0 rounded-[inherit] pointer-events-none hidden dark:block"
              initial={{ boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.3)" }}
              animate={{ boxShadow: "0 0 0 15px rgba(255, 255, 255, 0)" }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
            />
          </>
        )}

        {/* Ripple effect */}
        {RippleElement}

        {/* Button content */}
        {LoadingVisual}
        <span className="sr-only" aria-live={announceChanges ? "polite" : undefined} />
        {label}
      </Comp>
    );
  }
);

Button.displayName = "Button";
