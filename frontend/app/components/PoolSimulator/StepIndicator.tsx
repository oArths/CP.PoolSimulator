import { STEPS } from "./steps";

export default function StepIndicator({ currentIndex }: { currentIndex: number }) {
    return (
        <div className="flex flex-row gap-2.5 w-fit items-center py-5">
            {STEPS.map((step, index) => (
                <div key={step}>

                    <div className="hidden lg:flex flex-row items-center gap-1 lg:gap-2">
                        {index > 0 && <div className=" w-5 lg:w-7 h-0.5 bg-neutral-gray/30" />}
                        <div className="flex flex-row items-center gap-2">
                            <div
                                className={` h-5 lg:h-7 aspect-square rounded-full ${index <= currentIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                            />
                            <span className="text-graphite text-400-12 lg:text-400-14">{step}</span>
                        </div>
                    </div>
                    {(index === currentIndex|| index === currentIndex + 1) && (

                        <div className="flex lg:hidden flex-row items-center gap-1 lg:gap-2">
                            {(index > 0 && index !== currentIndex)  && <div className=" w-5 lg:w-7 h-0.5 bg-neutral-gray/30" />}
                            <div className="flex flex-row items-center gap-2">
                                <div
                                    className={` h-5 lg:h-7 aspect-square rounded-full ${index <= currentIndex ? "bg-cp-life-cyan" : "border border-neutral-gray/30"}`}
                                />
                                <span className="text-graphite text-400-12 lg:text-400-14">{step}</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
