import request from 'supertest';

import dotenv from 'dotenv';

import { MongoClient } from 'mongodb';

import { HttpStatusCodes } from '../server/express/common/constans/codes';
import { Nullable } from '../server/express/common/types/optional.types';
import { videos, VideoType } from '../server/express/repositories/video.repository';
import { app } from '../server/express/settings';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

describe('/videos', () => {
    let newVideo: Nullable<VideoType> = null;
    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    it('GET products = []', async () => {
        await request(app).get('/videos/').expect([]);
    });

    it('- POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post('/videos/')
            .send({ title: '', author: '' })
            .expect(HttpStatusCodes.BAD_REQUEST, {
                errorsMessages: [
                    { message: 'title is required', field: 'title' },
                    { message: 'author is required', field: 'author' },
                ],
            });

        const res = await request(app).get('/videos/');
        expect(res.body).toEqual([]);
    });

    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/videos/helloWorld').expect(HttpStatusCodes.BAD_REQUEST);
    });
    it('+ GET product by ID with correct id', async () => {
        const { status, body } = await request(app)
            .post('/videos/')
            .send({
                title: 'hello',
                author: 'alex',
                availableResolutions: ['P144'],
            })
            .expect(HttpStatusCodes.CREATED);
        newVideo = body;

        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(HttpStatusCodes.OK, newVideo);
    });

    it('- PUT product by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(HttpStatusCodes.NOT_FOUND);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual(newVideo);
    });

    it('+ PUT product by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + newVideo!.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(HttpStatusCodes.NO_CONTENT);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual({
            ...newVideo,
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z',
        });
        newVideo = res.body[0];
    });

    it('- DELETE product by incorrect ID', async () => {
        await request(app).delete('/videos/876328').expect(HttpStatusCodes.NOT_FOUND);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual(newVideo);
    });
    it('+ DELETE product by correct ID, auth', async () => {
        await request(app)
            .delete('/videos/' + newVideo!.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HttpStatusCodes.NO_CONTENT);

        const res = await request(app).get('/videos/');
        expect(res.body.length).toBe(0);
    });

    it('test', async () => {
        await request(app).delete('/testing/all-data').set('authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCodes.NO_CONTENT);

        expect(videos).toHaveLength(0);
    });
});
