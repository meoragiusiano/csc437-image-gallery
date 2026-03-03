import express from "express";
import { ObjectId } from "mongodb";

const MAX_NAME_LENGTH = 100;

function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
    app.get("/api/images", async (req, res) => {
        await waitDuration(1000);
        try {
            const images = await imageProvider.getAllImages();
            res.json(images);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch images" });
        }
    });

    app.get("/api/images/:id", async (req, res) => {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(404).send({
                error: "Not Found",
                message: "No image with that ID"
            });
            return;
        }

        try {
            const image = await imageProvider.getOneImage(id);
            if (!image) {
                res.status(404).send({
                    error: "Not Found",
                    message: "No image with that ID"
                });
                return;
            }
            res.json(image);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch image" });
        }
    });

    app.patch("/api/images/:id", async (req, res) => {
        const { id } = req.params;
        const { name } = req.body || {};

        if (name === undefined || name === null || typeof name !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing or invalid 'name' field in request body"
            });
            return;
        }

        if (name.trim() === "") {
            res.status(400).send({
                error: "Bad Request",
                message: "Image name cannot be empty"
            });
            return;
        }

        if (name.length > MAX_NAME_LENGTH) {
            res.status(422).send({
                error: "Unprocessable Entity",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
            return;
        }

        if (!ObjectId.isValid(id)) {
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
            return;
        }

        try {
            const matchedCount = await imageProvider.updateImageName(id, name);
            if (matchedCount === 0) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update image" });
        }
    });
}