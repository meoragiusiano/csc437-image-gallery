import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, onNameChanged, authToken }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
    }

    async function handleSubmitPressed() {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ name: nameInput })
            });

            if (!response.ok) {
                let message = `HTTP ${response.status} ${response.statusText}`;
                try {
                    const body = await response.json();
                    if (body.message) {
                        message = body.message;
                    }
                } catch {
                    // default msg
                }
                throw new Error(message);
            }

            onNameChanged(nameInput);
            setIsEditingName(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name
                    <input
                        required
                        style={{ marginLeft: "0.5em" }}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <button disabled={nameInput.length === 0 || isLoading} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                <div aria-live="polite">
                    {isLoading && <p>Renaming image...</p>}
                    {error && <p style={{ color: "red" }}>Error: {error}</p>}
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}
