import request from 'supertest';
import * as dotenv from 'dotenv';
import { app } from '../../../../../server/express/app';
import mongoose from 'mongoose';
import { authPath } from '../../../../../server/express/routes/auth.router';
import { user_1_token } from '../../mock/useres-for-login';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base, id, me } = authPath;

describe('/me', () => {
    // let newBlog: Nullable<IBlogSchema> = null;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        // await clearMongoCollections();
    });

    it('GET me', async () => {
        const { status, body } = await request(app)
            .get(`${base}/${me}`)
            .set(
                'authorization',
                'Bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJlMTRkNmJmMjA2ZDgzNWU4ZjI5MzUiLCJkZXZpY2VJZCI6IjBhMGE5OTM4LTBmNzEtNDBkOC04Nzg5LWE5NzA4YzFjMTE2MiIsImlhdCI6MTcwNjk2MzY3MDM3NiwiZXhwIjoxLjAwMDAwMDAwMDE3MDY5NjRlKzIyfQ.ODvuaZ-zpmozrxVNBirINM-H2Eg6EBOq8RsHLLrgwdY',
            )
            .set('Cookie', [`refreshToken=${user_1_token}`]);

        console.log(status);
        console.log(body);
    });
});
