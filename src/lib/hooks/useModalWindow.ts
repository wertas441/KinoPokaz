import { useCallback, useState } from "react";

export function useModalWindow() {

    const [isModalWindowOpen, setIsModalWindowOpen] = useState<boolean>(false);

    const toggleModalWindow = useCallback(() => setIsModalWindowOpen(prevState => !prevState), []);

    return { isModalWindowOpen, toggleModalWindow };
}
