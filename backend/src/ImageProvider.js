import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("IMAGES_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async getAllImages() {
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        const pipeline = [];

        pipeline.push({
            $lookup: {
                from: usersCollectionName,
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        });

        pipeline.push({
            $unwind: "$author"
        });

        return this.collection.aggregate(pipeline).toArray();
    }
}