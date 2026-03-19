import styles from './FIlterInput.module.css'

interface IProps {
    label?: string;
    id: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function FilterInput({label, id, type = 'text', placeholder = '', value, onChange} : IProps) {

    return (
        <div className={styles.filterSection}>

            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}

            <input
                id={id}
                className={styles.input}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}