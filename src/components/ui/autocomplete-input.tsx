"use client";

import React, { useState, useRef, useCallback, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { BomMasterCategory } from "@/lib/hooks/useBomMaster";

interface AutocompleteInputProps {
    value: string;
    onChange: (val: string) => void;
    onBlur?: () => void;
    suggestions: string[];                  // 외부에서 필터링된 후보 목록
    onSuggestionSelect?: (val: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
}

// ─── 자동완성 Input 컴포넌트 ──────────────────────────────────────
export function AutocompleteInput({
    value,
    onChange,
    onBlur,
    suggestions,
    onSuggestionSelect,
    placeholder,
    className,
    inputClassName,
    disabled = false,
}: AutocompleteInputProps) {
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFocus = () => {
        if (!disabled && suggestions.length > 0) setOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setOpen(true);
        setActiveIdx(-1);
    };

    const handleSelect = useCallback(
        (item: string) => {
            onChange(item);
            onSuggestionSelect?.(item);
            setOpen(false);
            setActiveIdx(-1);
        },
        [onChange, onSuggestionSelect]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter" && activeIdx >= 0) {
            e.preventDefault();
            handleSelect(suggestions[activeIdx]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const hasSuggestions = suggestions.length > 0;

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    "w-full h-7 px-2 text-xs bg-transparent border-0 border-b border-slate-200 dark:border-slate-700",
                    "focus:outline-none focus:border-ocean-teal focus:ring-0",
                    "placeholder:text-slate-300 text-slate-800 dark:text-slate-100",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    inputClassName
                )}
            />

            {/* 자동완성 드롭다운 */}
            {open && hasSuggestions && (
                <div className="absolute left-0 top-full z-50 w-full min-w-[140px] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg max-h-[180px] overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <button
                            key={item}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault(); // blur 방지
                                handleSelect(item);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-1.5 text-xs hover:bg-ocean-teal/10 transition-colors",
                                "text-slate-700 dark:text-slate-200",
                                idx === activeIdx && "bg-ocean-teal/10 font-semibold"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
