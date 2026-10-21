"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder,
    disabled,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    const isSearchable = options.length > 5;
    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase()),
    );

    const close = () => {
        setIsOpen(false);
        setSearch("");
        setActiveIndex(-1);
    };

    const select = (option: string) => {
        onChange(option);
        close();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                setActiveIndex(0);
                return;
            }
            setActiveIndex((prev) => {
                if (filteredOptions.length === 0) return prev;
                const direction = event.key === "ArrowDown" ? 1 : -1;
                return (prev + direction + filteredOptions.length) % filteredOptions.length;
            });
        } else if (event.key === "Enter") {
            if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
                event.preventDefault();
                select(filteredOptions[activeIndex]);
            } else if (!isOpen) {
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex(0);
            }
        } else if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            close();
        } else if (event.key === "Tab") {
            close();
        }
    };

    useEffect(() => {
        const list = listRef.current;
        const item = list?.children[activeIndex] as HTMLElement | undefined;
        if (!list || !item) return;
        const listRect = list.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < listRect.top) {
            list.scrollTop += itemRect.top - listRect.top;
        } else if (itemRect.bottom > listRect.bottom) {
            list.scrollTop += itemRect.bottom - listRect.bottom;
        }
    }, [activeIndex]);

    return (
        <div className="w-full relative" onKeyDown={handleKeyDown}>
            <div
                tabIndex={disabled ? -1 : 0}
                onClick={() => {
                    if (disabled) return;
                    if (isOpen) close();
                    else setIsOpen(true);
                }}
                className={`input flex items-center justify-between cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <span className={`truncate ${value ? "text-graphite" : "text-neutral-gray"}`}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 stroke-graphite transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={close} />
                    <div className="absolute z-20 top-full mt-1 w-full rounded-xl border border-border-gray bg-white shadow-md">
                        {isSearchable && (
                            <div className="p-2 border-b border-border-gray">
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setActiveIndex(0);
                                    }}
                                    placeholder="Buscar..."
                                    className="w-full rounded-lg border border-border-gray px-2.5 py-1.5 text-400-14 outline-none focus:border-primary-blue"
                                />
                            </div>
                        )}

                        <ul ref={listRef} className="flex flex-col max-h-52 overflow-y-auto py-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option}
                                        onClick={() => select(option)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`flex items-center justify-between mx-1 px-2.5 py-2 rounded-lg text-400-14 cursor-pointer select-none ${index === activeIndex ? "bg-aqua-light" : ""} ${option === value ? "text-primary-blue" : "text-graphite"}`}
                                    >
                                        {option}
                                        {option === value && (
                                            <Check className="h-4 w-4 stroke-primary-blue" />
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="px-3 py-2 text-center text-400-14 text-neutral-gray">
                                    Nenhum resultado
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
