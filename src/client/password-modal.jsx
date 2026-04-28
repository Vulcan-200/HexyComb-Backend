import React, { useState } from "react";

const PasswordModal = ({ visible, onClose }) => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");
    const [error, setError] = useState("");

    if (!visible) return null;

    const submit = async () => {
        setError("");

        const res = await fetch("/account/password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                oldPass,
                newPass,
                newPass2,
            }),
        });

        const data = await res.json();

        if (data.error) {
            setError(data.error);
            return;
        }

        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <h2>Change Password</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <input
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Old password"
                />

                <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="New password"
                />

                <input
                    type="password"
                    value={newPass2}
                    onChange={(e) => setNewPass2(e.target.value)}
                    placeholder="Confirm new password"
                />

                <div className="modal-buttons">
                    <button onClick={submit}>Change Password</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;