import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-xl border-2 px-2.5 py-0.5 text-xs font-extrabold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-150 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-[var(--accent-border)] shadow-[0_3px_0_var(--accent-border)]",
        secondary:
          "bg-secondary text-secondary-foreground border-[color-mix(in_srgb,var(--secondary)_60%,transparent)] shadow-[0_3px_0_color-mix(in_srgb,var(--secondary)_40%,transparent)]",
        destructive:
          "bg-destructive text-white border-[color-mix(in_srgb,var(--destructive)_60%,transparent)] shadow-[0_3px_0_color-mix(in_srgb,var(--destructive)_40%,transparent)]",
        outline:
          "bg-card text-foreground border-border shadow-[0_3px_0_var(--border)]",
        success:
          "bg-emerald-500 text-white border-emerald-700 shadow-[0_3px_0_theme(colors.emerald.700)]",
        warning:
          "bg-amber-400 text-amber-900 border-amber-600 shadow-[0_3px_0_theme(colors.amber.600)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
