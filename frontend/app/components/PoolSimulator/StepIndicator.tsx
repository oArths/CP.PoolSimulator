import { STEPS } from "./steps";

export default function StepIndicator({ currentIndex }: { currentIndex: number }) {
    return (
        <div className="flex flex-row gap-2.5 w-fit items-center py-5">
            {STEPS.map((step, index) => (
                <div key={step} className="flex flex-row items-center gap-2">
                    {index > 0 && <div className="w-7 h-0.5 bg-neutral-gray/30" />}
                    <div className="flex flex-row items-center gap-2">
                        <div
                            className={`h-7 w-7 rounded-full ${index <= currentIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                        />
                        <h3 className="text-graphite text-400-14">{step}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
