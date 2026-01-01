import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "border-border hover:bg-muted/50",
          className
        )}
        {...props}
      />
    )
  }
)
SecondaryButton.displayName = "SecondaryButton"
