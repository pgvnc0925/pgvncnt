import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-primary text-white hover:bg-primary/90 shadow-sm",
          className
        )}
        {...props}
      />
    )
  }
)
PrimaryButton.displayName = "PrimaryButton"
