import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalWindow.module.css";

export interface IProps {
    isOpen: boolean;

    title: string;
    description: string;

    onClose: () => void;
    onConfirm: () => void;
}

export default function ModalWindow({isOpen, onClose, title, description, onConfirm}: IProps) {

    const panelRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();

            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener("keydown", handleKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (!isOpen) return;

        const t = window.setTimeout(() => {
            panelRef.current?.focus();
        }, 0);

        return () => window.clearTimeout(t);
    }, [isOpen]);

    if (!isOpen) return null;

    const element = (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={panelRef}
                className={styles.panel}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                <h2 id={'modalTitle'} className={styles.title}>
                    {title}
                </h2>

                <p id={'modalDescription'} className={styles.body}>
                    {description}
                </p>

                <div className={styles.footer}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        onClick={onConfirm}
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(element, document.body);
}
