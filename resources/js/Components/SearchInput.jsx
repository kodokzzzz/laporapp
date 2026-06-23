/**
 * SearchInput Component
 *
 * A search text input with a magnifier icon on the left and a clear
 * button that appears when there is text. Supports an optional debounce
 * delay so the parent's onChange callback isn't fired on every keystroke.
 *
 * @param {string} value - Current search value
 * @param {function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text (default: "Cari...")
 * @param {function} onClear - Callback when clear button is clicked
 * @param {number} debounceMs - Debounce delay in ms (0 = no debounce)
 * @param {string} className - Additional CSS classes
 */

import { useState, useEffect, useRef } from 'react';

export default function SearchInput({
    value = '',
    onChange,
    placeholder = 'Cari...',
    onClear,
    debounceMs = 0,
    className = '',
}) {
    const [internalValue, setInternalValue] = useState(value);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);

    /* Sync internal state when parent value changes */
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    /* Cleanup debounce timer on unmount */
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        if (debounceMs > 0) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                onChange?.(newValue);
            }, debounceMs);
        } else {
            onChange?.(newValue);
        }
    };

    const handleClear = () => {
        setInternalValue('');
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        onClear?.();
        onChange?.('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    };

    return (
        <div className={`search-input ${className}`.trim()}>
            {/* Magnifier icon */}
            <span className="search-input-icon" aria-hidden="true">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </span>

            <input
                ref={inputRef}
                type="text"
                className="search-input-field"
                value={internalValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={placeholder}
            />

            {/* Clear button — only visible when there is text */}
            {internalValue && (
                <button
                    type="button"
                    className="search-input-clear"
                    onClick={handleClear}
                    aria-label="Hapus pencarian"
                    title="Hapus pencarian"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}
