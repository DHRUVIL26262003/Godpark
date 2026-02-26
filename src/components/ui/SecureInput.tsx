import * as React from "react";
import { cn } from "@/lib/utils";
import { useSecurity } from "@/contexts/SecurityContext";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    sourceName: string; // e.g., "Login Form", "Contact Name"
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
    ({ className, type, onChange, sourceName, ...props }, ref) => {
        const { detectThreat } = useSecurity();
        const [isCompromised, setIsCompromised] = React.useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const hasThreat = detectThreat(value, sourceName);

            if (hasThreat) {
                setIsCompromised(true);
                // Clear threat status after 2 seconds
                setTimeout(() => setIsCompromised(false), 2000);
            } else {
                setIsCompromised(false);
                if (onChange) {
                    onChange(e);
                }
            }
        };

        return (
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        isCompromised
                            ? "border-red-500 focus-visible:ring-red-500 bg-red-500/10 text-red-500 animate-shake"
                            : "border-input file:text-foreground focus-visible:ring-ring",
                        className
                    )}
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />
                <AnimatePresence>
                    {isCompromised && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-2.5"
                        >
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
SecureInput.displayName = "SecureInput";

export { SecureInput };
