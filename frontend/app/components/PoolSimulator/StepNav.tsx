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
            className={`flex flex-row items-center mt-auto ${showBack ? "justify-between" : "justify-end"}`}
        >
            {showBack && (
                <button className="button-outline" onClick={onBack}>
                    Voltar ao {backLabel}
                </button>
            )}
            <button className="button-primary" onClick={onNext}>
                Próximo: {nextLabel}
            </button>
        </div>
    );
}
