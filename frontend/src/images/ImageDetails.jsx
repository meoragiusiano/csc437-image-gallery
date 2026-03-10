import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor.jsx";

export function ImageDetails({ authToken }) {
    const { imageId } = useParams();
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch(`/api/images/${imageId}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setImage(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImage();
    }, [imageId, authToken]);

    function handleNameChanged(newName) {
        setImage(prev => ({ ...prev, name: newName }));
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!image) {
        return <h2>Image not found</h2>;
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor
                imageId={image._id}
                initialValue={image.name}
                onNameChanged={handleNameChanged}
                authToken={authToken}
            />
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    );
}
