import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import EditModal from "./edit-modal.jsx";
import PasswordModal from "./password-modal.jsx";

const ProfileApp = () => {
    const [modalType, setModalType] = useState(null);

    // Expose modal triggers globally
    window.showNicknameModal = () => setModalType("nickname");
    window.showUsernameModal = () => setModalType("username");
    window.showPasswordModal = () => setModalType("password");

    return (
        <>
            {modalType === "nickname" && (
                <EditModal
                    visible={true}
                    onClose={() => setModalType(null)}
                    title="Change Nickname"
                    placeholder="Enter new nickname"
                    submitLabel="Change Nickname"
                    endpoint="/account/nickname"
                    fieldName="nickname"
                    onSuccess={(data) => {
                        document.getElementById("nickname").innerText = data.nickname;
                    }}
                />
            )}

            {modalType === "username" && (
                <EditModal
                    visible={true}
                    onClose={() => setModalType(null)}
                    title="Change Username"
                    placeholder="Enter new username"
                    submitLabel="Change Username"
                    endpoint="/account/username"
                    fieldName="username"
                    onSuccess={(data) => {
                        document.getElementById("username").innerText = "@" + data.username;
                    }}
                />
            )}

            {modalType === "password" && (
                <PasswordModal
                    visible={true}
                    onClose={() => setModalType(null)}
                />
            )}
        </>
    );
};

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("nickname-modal");
    if (container) {
        const root = createRoot(container);
        root.render(<ProfileApp />);
    }
});
