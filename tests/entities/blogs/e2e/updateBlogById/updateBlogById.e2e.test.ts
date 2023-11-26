import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { updateBlogDto_valid, updateBlogMock } from '../../mock/updateBlog/updateBlog.mock';
import { mongo } from '../../../../../src/server/db/mongo';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

describe('/blogs', () => {
    let newBlog: Nullable<IBlog> = null;

    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(() => {
        mongo.blogs = [];
    });

    it('+ update blog with correct data', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${body.id}`, updateBlogDto_valid);
            expect(status).toBe(HttpStatusCodes.NO_CONTENT);
            expect(newBlog!.name).toBe(addMockBlogDto_valid.name);
            expect(newBlog!.description).toBe(addMockBlogDto_valid.description);
            expect(newBlog!.websiteUrl).toBe(addMockBlogDto_valid.websiteUrl);
        }
    });

    it('- update not existing blog', async () => {
        const { status } = await updateBlogMock('1234', updateBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it('- update with incorrect name', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                name: '',
                description: 'string',
                websiteUrl: 'https://www.guru99.com/',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with without name', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                description: 'string',
                websiteUrl: 'https://www.guru99.com/',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with incorrect description', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                name: 'string',
                description: '',
                websiteUrl: 'https://www.guru99.com/',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with without description', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                name: 'string',
                websiteUrl: 'https://www.guru99.com/',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with incorrect websiteUrl', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                name: 'string',
                description: '',
                websiteUrl: 'ht   ://www.guru99.com/',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with without websiteUrl', async () => {
        const { status, body } = await createBlogMock(addMockBlogDto_valid);
        expect(status).toBe(HttpStatusCodes.CREATED);
        newBlog = body;
        {
            const { status } = await updateBlogMock(`${newBlog!.id}`, {
                name: 'string',
                description: 'description',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });
});
