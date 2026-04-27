import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold tracking-wide transition-all duration-150 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 cursor-pointer",
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary-hover',

				destructive:
					'bg-destructive text-white border border-destructive hover:bg-destructive/90 active:bg-[#991b1b]',

				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-[#1d4ed8]',

				ghost:
					'hover:bg-muted-foreground hover:text-foreground active:bg-muted',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-11 px-5 py-3 text-sm',
				sm: 'h-9 px-4 text-xs rounded-md',
				lg: 'h-14 px-8 text-lg rounded-lg',
				icon: 'size-10',
				'icon-sm': 'size-8 rounded-md',
				'icon-lg': 'size-12 rounded-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
