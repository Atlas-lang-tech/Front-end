import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-150",
  {
    variants: {
      variant: {
        default:
          "bg-card-secondary border border-border text-secondary",
        secondary:
          "bg-card-secondary border border-border text-secondary",
        destructive:
          "bg-status-error/10 border border-status-error text-status-error",
        outline:
          "bg-transparent border border-border text-secondary",
        success:
          "bg-status-success/10 border border-status-success text-status-success",
        warning:
          "bg-status-pending/10 border border-status-pending text-status-pending",
        active:
          "bg-status-success/10 border border-status-success text-status-success",
        pending:
          "bg-status-pending/10 border border-status-pending text-status-pending",
        canceled:
          "bg-status-error/10 border border-status-error text-status-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
