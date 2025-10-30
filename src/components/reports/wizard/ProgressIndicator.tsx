import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  steps: Step[];
}

export function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step.status === 'current'
                      ? 'bg-gradient-to-r from-bol-pink to-bol-orange text-white animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check size={24} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step.status === 'current'
                    ? 'text-bol-purple'
                    : step.status === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 -mt-6">
                <div
                  className={`h-full transition-all duration-300 ${
                    steps[index + 1].status === 'completed' || step.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
