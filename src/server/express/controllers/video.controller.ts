import { Request, Response } from 'express';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { AVAILABLE_RESOLUTIONS, mongo } from '../../db/mongo';
import { AddVideoDto, VideoUpdateDto } from '../types/video/input';
import { VideoType } from '../types/video/output';
import { ErrorType } from '../common/errors/interface/custom-error.interface';

class VideoController {
    async getAllVideo(req: Request, res: Response) {
        res.status(200).send(mongo.videos);
    }

    async getVideoById(req: Request<{ id: string }>, res: Response) {
        const errors: ErrorType = {
            errorsMessages: [],
        };
        const id = +req.params.id;

        if (Number.isNaN(id)) {
            errors.errorsMessages.push({ message: 'Invalid id', field: 'id' });
        }

        if (errors.errorsMessages.length) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(errors);
            return;
        }

        const video = mongo.videos.find((v) => v.id === id);

        if (!video) {
            res.status(404).send();
            // .send({ error: 'Not found' });
            return;
        }
        res.status(200).send(video);
    }

    async addVideo(req: Request<{}, {}, AddVideoDto>, res: Response) {
        let { title, author, availableResolutions } = req.body;

        const errors: ErrorType = {
            errorsMessages: [],
        };

        if (!title || !title.trim() || title.trim().length > 40) {
            errors.errorsMessages.push({ message: 'title is required', field: 'title' });
        }

        if (!author.trim() || author.trim().length > 20) {
            errors.errorsMessages.push({ message: 'author is required', field: 'author' });
        }

        if (Array.isArray(availableResolutions)) {
            const result: boolean = availableResolutions.every((r) => AVAILABLE_RESOLUTIONS.includes(r));
            if (!result) {
                errors.errorsMessages.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });
            }
        } else {
            availableResolutions = [];
        }

        if (errors.errorsMessages.length) {
            res.status(400).send(errors);
            return;
        }

        const createAt = new Date();
        const publicationDate = new Date();

        publicationDate.setDate(createAt.getDate() + 1);

        const newVideo: VideoType = {
            id: +new Date(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions,
        };

        mongo.videos.push(newVideo);

        res.status(201).send(newVideo);
    }

    async updateVideoById(req: Request<{ id: string }, {}, VideoUpdateDto>, res: Response) {
        let { title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded } = req.body;
        const id: number = +req.params.id;

        const errors: ErrorType = {
            errorsMessages: [],
        };

        if (!title || !title.trim() || title.trim().length > 40) {
            errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
        }

        if (!author.trim() || author.trim().length > 20) {
            errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
        }

        if (Array.isArray(availableResolutions)) {
            const result: boolean = availableResolutions.every((r) => AVAILABLE_RESOLUTIONS.includes(r));
            if (!result) {
                errors.errorsMessages.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });
            }
        }

        if (typeof canBeDownloaded !== 'boolean') {
            errors.errorsMessages.push({ message: 'Invalid canBeDownloaded', field: 'canBeDownloaded' });
        }

        if (!canBeDownloaded) {
            canBeDownloaded = false;
        }

        if (minAgeRestriction !== null && (minAgeRestriction < 1 || minAgeRestriction > 18)) {
            errors.errorsMessages.push({ message: 'Invalid minAgeRestriction', field: 'minAgeRestriction' });
        }

        if (typeof minAgeRestriction === undefined) {
            minAgeRestriction = null;
        }

        if (typeof publicationDate !== 'string') {
            errors.errorsMessages.push({ message: 'Invalid publicationDate', field: 'publicationDate' });
        }

        const index: -1 | number = mongo.videos.findIndex((v) => v.id === id);
        if (index === -1) {
            res.status(HttpStatusCodes.NOT_FOUND).send();
            // .send({ errorMessages: [{ messages: 'Not Found', field: '' }] });
            return;
        }

        if (errors.errorsMessages.length) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(errors);
            return;
        }

        const video: VideoType = mongo.videos[index];

        const newVideo: VideoType = {
            id,
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            createdAt: video.createdAt,
            publicationDate: publicationDate,
            availableResolutions: availableResolutions ? availableResolutions : video.availableResolutions,
        };

        mongo.videos.splice(index, 1, newVideo);

        res.status(HttpStatusCodes.NO_CONTENT).send();
    }

    async removeVideo(req: Request<{ id: string }>, res: Response) {
        const errors: ErrorType = {
            errorsMessages: [],
        };
        const id = +req.params.id;

        if (Number.isNaN(id)) {
            errors.errorsMessages.push({ message: 'Invalid id', field: 'id' });
        }

        if (errors.errorsMessages.length) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(errors);
            return;
        }

        const index = mongo.videos.findIndex((v) => v.id === id);
        if (index === -1) {
            res.status(HttpStatusCodes.NOT_FOUND).send();
            // .send({ errorMessages: [{ messages: 'Not Found', field: '' }] });
            return;
        }

        mongo.videos.splice(index, 1);

        res.status(HttpStatusCodes.NO_CONTENT).send();
    }
}

export const videoController = new VideoController();
