import { useState, useId, useActionState } from "react";
import { useNavigate } from "react-router";

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}

export function UploadPage({ authToken }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputId = useId();
    const navigate = useNavigate();

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const dataUrl = await readAsDataURL(file);
            setPreviewUrl(dataUrl);
        } else {
            setPreviewUrl(null);
        }
    }

    const [result, submitAction, isPending] = useActionState(
        async (_previousResult, formData) => {
            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const body = await response.json().catch(() => ({}));
                    setPreviewUrl(null);
                    return body.message || `Upload failed (${response.status})`;
                }

                const body = await response.json();
                navigate(`/images/${body.id}`);
                return null;
            } catch {
                setPreviewUrl(null);
                return "Could not connect to the server.";
            }
        },
        null
    );

    return (
        <>
            <h2>Upload</h2>
            <form action={submitAction}>
                <div>
                    <label htmlFor={fileInputId}>Choose image to upload: </label>
                    <input
                        id={fileInputId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        disabled={isPending}
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending} />
                    </label>
                </div>

                {previewUrl && (
                    <div>
                        <img style={{width: "20em", maxWidth: "100%"}} src={previewUrl} alt="" />
                    </div>
                )}

                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
            {result && <p aria-live="assertive" style={{color: "red"}}>{result}</p>}
        </>
    );
}