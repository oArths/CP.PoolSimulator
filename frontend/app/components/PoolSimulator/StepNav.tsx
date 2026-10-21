export default function StepNav({
    onBack,
    onNext,
    backLabel,
    nextLabel,
    showBack = true,
}: {
    onBack: () => void;
    onNext: () => void;
    backLabel: string;
    nextLabel: string;
    showBack?: boolean;
}) {
    return (
        <div
            className={`flex flex-col-reverse gap-5 mt-10 sm:flex-row items-center sm:mt-auto ${showBack ? "justify-between" : "justify-end"}`}
        >
            {showBack && (
                <button className="button-outline w-full sm:w-fit" onClick={onBack}>
                    Voltar ao {backLabel}
                </button>
            )}
            <button className="button-primary  w-full sm:w-fit" onClick={onNext}>
                Próximo: {nextLabel}
            </button>
        </div>
    );
}
