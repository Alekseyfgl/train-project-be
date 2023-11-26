import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../src/server/express/types/blog/output';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { updateBlogDto_valid, updateBlogMock } from '../../mock/updateBlog/updateBlog.mock';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import { blogPath } from '../../../../../src/server/express/routes/blog.router';
import { mockNotExistMongoId } from '../../../../common/notExistMongoId/notExistMongoId';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base, id } = blogPath;

describe(`${base}`, () => {
    let newBlog: Nullable<IBlogModel> = null;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await clearMongoCollections();
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
        const { status } = await updateBlogMock(mockNotExistMongoId, updateBlogDto_valid);
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
            } as any);
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
            } as any);
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
            } as any);
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });
});
