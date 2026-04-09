import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  // Базові стилі: Nunito, закруглення xl, без розмитих тіней, ефект натискання
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold tracking-wide transition-all duration-150 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Помаранчева кнопка з твердою тінню
        default:
          "bg-primary text-primary-foreground  shadow-[0_4px_0_var(--accent-border)] hover:opacity-95 active:translate-y-1 active:shadow-none",

        // Червона кнопка (Error/Destructive)
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_0_var(--destructive-border)] hover:opacity-95 active:translate-y-1 active:shadow-none",

        // Біла/прозора кнопка з рамкою та тінню
        outline:
          "border-2 border-border bg-background text-foreground shadow-[0_4px_0_var(--border)] hover:bg-muted active:translate-y-1 active:shadow-none dark:bg-card",

        // Блакитна кнопка (Secondary)
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_4px_0_var(--secondary-border)] hover:opacity-95 active:translate-y-1 active:shadow-none",

        // Ghost та Link не мають 3D ефекту натискання (згідно з логікою мінімалізму)
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 text-sm rounded-lg shadow-[0_3px_0_var(--border)] active:translate-y-[3px]", // Менша тінь для меншої кнопки
        lg: "h-14 px-8 text-lg rounded-2xl shadow-[0_5px_0_var(--border)] active:translate-y-[5px]", // Більша тінь для масивності
        icon: "size-12",
        "icon-sm": "size-10 rounded-lg",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    // Налаштування тіней для кольорових кнопок у малих/великих розмірах
    compoundVariants: [
      {
        variant: "default",
        size: "sm",
        class: "shadow-[0_3px_0_var(--primary-border)]",
      },
      {
        variant: "default",
        size: "lg",
        class: "shadow-[0_5px_0_var(--primary-border)]",
      },
      {
        variant: "secondary",
        size: "sm",
        class: "shadow-[0_3px_0_var(--secondary-border)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
