import React, { useState } from "react";

const EditModal = ({
    visible,
    onClose,
    title,
    placeholder,
    submitLabel,
    endpoint,
    fieldName,
    onSuccess
}) => {
    const [value, setValue] = useState("");

    if (!visible) return null;

    const submit = async () => {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [fieldName]: value }),
        });

        const data = await res.json();
        if (data.success) {
            onSuccess(data);
            onClose();
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <h2>{title}</h2>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                />

                <div className="modal-buttons">
                    <button onClick={submit}>{submitLabel}</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;