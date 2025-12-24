import * as React from "react"

export const FormEl = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>((props, ref) => {
  return <form ref={ref} {...props} />;
});

FormEl.displayName = "FormEl";
