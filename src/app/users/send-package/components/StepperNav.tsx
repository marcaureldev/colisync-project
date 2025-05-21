import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Step {
  id: number;
  name: string;
  Icon: LucideIcon;
}

interface StepperNavProps {
  currentStep: number;
  steps: Step[];
}

const StepperNav: React.FC<StepperNavProps> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              "relative flex-1 flex justify-center"
            )}
          >
            {stepIdx < steps.length - 1 ? (
              <div
                className={cn(
                  "absolute h-0.5 w-full top-4/12 -translate-y-1/2",
                  "left-[calc(50%+1.5rem)] right-0 max-w-[calc(100%-3rem)]",
                  currentStep > step.id
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
                aria-hidden="true"
              ></div>
            ) : null}
            <div
              className={cn(
                "relative flex flex-col items-center z-10 p-2 sm:p-0",
                currentStep > step.id
                  ? "text-blue-600 dark:text-blue-400"
                  : currentStep === step.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2",
                  currentStep > step.id
                    ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
                    : currentStep === step.id
                      ? "border-blue-600 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600"
                )}
              >
                <step.Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6",
                    currentStep > step.id ? "text-white" : ""
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-center">
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepperNav;

// StepperNav.tsx amélioré
// import React from "react";
// import { cn } from "@/lib/utils";
// import { LucideIcon } from "lucide-react";

// interface Step {
//   id: number;
//   name: string;
//   Icon: LucideIcon;
// }

// interface StepperNavProps {
//   currentStep: number;
//   steps: Step[];
// }

// const StepperNav: React.FC<StepperNavProps> = ({ currentStep, steps }) => {
//   return (
//     <div className="bg-white dark:bg-white/5 dark:backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg px-6 pt-6 pb-4 shadow-lg mb-6">
//       <nav aria-label="Progress">
//         <ol
//           role="list"
//           className="flex items-center justify-between max-w-5xl mx-auto"
//         >
//           {steps.map((step, stepIdx) => (
//             <li
//               key={step.name}
//               className={cn(
//                 "relative",
//                 stepIdx !== steps.length - 1 ? "flex-1" : ""
//               )}
//             >
//               {stepIdx < steps.length - 1 ? (
//                 <div
//                   className={cn(
//                     "absolute inset-0 top-1/2 -translate-y-1/2 flex items-center",
//                     stepIdx === 0
//                       ? "left-[calc(50%+1rem)]"
//                       : "left-[calc(50%+1rem)] sm:left-[calc(50%+1.5rem)]",
//                     stepIdx === steps.length - 2
//                       ? "right-[calc(50%+1rem)]"
//                       : "right-[calc(50%+1rem)] sm:right-[calc(50%+1.5rem)]"
//                   )}
//                   aria-hidden="true"
//                 >
//                   <div
//                     className={cn(
//                       "h-0.5 w-full",
//                       currentStep > step.id
//                         ? "bg-blue-600 dark:bg-blue-500"
//                         : "bg-gray-300 dark:bg-gray-600"
//                     )}
//                   ></div>
//                 </div>
//               ) : null}
//               <div
//                 className={cn(
//                   "relative flex flex-col items-center p-2 sm:p-0",
//                   currentStep > step.id
//                     ? "text-blue-600 dark:text-blue-400"
//                     : currentStep === step.id
//                       ? "text-blue-600 dark:text-blue-400"
//                       : "text-gray-500 dark:text-gray-400"
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2",
//                     currentStep > step.id
//                       ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
//                       : currentStep === step.id
//                         ? "border-blue-600 dark:border-blue-400"
//                         : "border-gray-300 dark:border-gray-600"
//                   )}
//                 >
//                   <step.Icon
//                     className={cn(
//                       "h-5 w-5 sm:h-6 sm:w-6",
//                       currentStep > step.id
//                         ? "text-white dark:text-gray-900"
//                         : ""
//                     )}
//                     aria-hidden="true"
//                   />
//                 </div>
//                 <span className="mt-2 text-xs sm:text-sm font-medium text-center w-20 sm:w-auto">
//                   {step.name}
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default StepperNav;
