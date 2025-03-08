import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  id: string;
  errors?: string[] | null;
  className?: string;
};

export function ErrorMessage({ id, errors, className }: ErrorMessageProps) {
  // Define base classes that will always be applied
  const baseClasses =
    "min-h-[20px] duration-800 text-sm text-red-600 ease-out animate-in fade-in-0 slide-in-from-left-1";

  // If no errors, just render an empty container with the minimum height
  if (!errors) {
    return <div id={id} className={cn(baseClasses, className)}></div>;
  }

  // Handle only one error message
  if (errors.length === 1) {
    return (
      <p id={id} className={cn(baseClasses, className)}>
        {errors[0]}
      </p>
    );
  }

  // For multiple error messages
  if (errors.length > 0) {
    return (
      <div id={id} className={cn(baseClasses, className)}>
        <p>Password must:</p>
        <ul className="ml-2">
          {errors.map((error) => (
            <li key={error}>- {error}</li>
          ))}
        </ul>
      </div>
    );
  }
  // If we have an empty array, render an empty container
  return <div id={id} className={cn(baseClasses, className)}></div>;
}
