import { Request, Response } from 'express';
import { AVAILABLE_RESOLUTIONS, videos, VideoType } from '../repositories/video.repository';
import { ErrorType } from '../common/types/error.types';
import { HttpStatusCodes } from '../common/constans/codes';
import { AddVideoDto, VideoUpdateDto } from '../dto/video.dto';

class VideoController {
    async getAllVideo(req: Request, res: Response) {
        res.status(200).send(videos);
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

        const video = videos.find((v) => v.id === id);

        if (!video) {
            res.status(404).send({ error: 'Not found' });
            return;
        }
        res.status(200).send(video);
    }

    async addVideo(req: Request<{}, {}, AddVideoDto>, res: Response) {
        let { title, author, availableResolutions } = req.body;

        const errors: ErrorType = {
            errorsMessages: [],
        };

        if (!title.trim() || title.trim().length > 40) {
            errors.errorsMessages.push({ message: 'title is required', field: 'title' });
        }

        if (!author.trim() || author.trim().length > 40) {
            errors.errorsMessages.push({ message: 'author is required', field: 'author' });
        }

        if (Array.isArray(availableResolutions)) {
            const result: boolean = availableResolutions.every((r) => AVAILABLE_RESOLUTIONS.includes(r));
            console.log(result);
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

        videos.push(newVideo);

        res.status(201).send(newVideo);
    }

    async updateVideoById(req: Request<{ id: string }, {}, VideoUpdateDto>, res: Response) {
        let { title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded } = req.body;
        const id: number = +req.params.id;

        const errors: ErrorType = {
            errorsMessages: [],
        };

        if (!title.trim() || title.trim().length > 40) {
            errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
        }

        if (!author.trim() || author.trim().length > 40) {
            errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
        }

        if (Array.isArray(availableResolutions)) {
            const result: boolean = availableResolutions.every((r) => AVAILABLE_RESOLUTIONS.includes(r));
            if (!result) {
                errors.errorsMessages.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });
            }
        }

        if (!canBeDownloaded) {
            canBeDownloaded = false;
        }

        if (minAgeRestriction !== undefined || (typeof minAgeRestriction === 'number' && ((minAgeRestriction < 1 && minAgeRestriction) || minAgeRestriction > 18))) {
            errors.errorsMessages.push({ message: 'Invalid minAgeRestriction', field: 'minAgeRestriction' });
        } else {
            minAgeRestriction = null;
        }

        if (errors.errorsMessages.length) {
            res.status(HttpStatusCodes.BAD_REQUEST).send(errors);
            return;
        }

        const index: -1 | number = videos.findIndex((v) => v.id === id);
        if (index === -1) {
            res.status(HttpStatusCodes.NOT_FOUND).send({ errorMessages: [{ messages: 'Not Found', field: '' }] });
            return;
        }
        const video: VideoType = videos[index];

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

        videos.splice(index, 1, newVideo);

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

        const index = videos.findIndex((v) => v.id === id);
        if (index === -1) {
            res.status(HttpStatusCodes.NOT_FOUND).send({ errorMessages: [{ messages: 'Not Found', field: '' }] });
            return;
        }

        videos.splice(index, 1);

        res.status(HttpStatusCodes.NO_CONTENT).send();
    }
}

export const videoController = new VideoController();
