import { NextFunction, Response, Router } from 'express';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';
import { testController } from '../controllers/test.controller';
import { clearMongoCollections } from '../../../tests/common/clearMongoCollections/clearMongoCollections';
import UAParser, { IResult } from 'ua-parser-js';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import geoip, { Lookup } from 'geoip-lite';
import { Nullable } from '../common/interfaces/optional.types';

export const videoPath = {
    base: '/testing',
    id: ':id',
    all_data: 'all-data',
};

const { base, id, all_data } = videoPath;
export const testRouter: Router = Router();

testRouter.get(`${base}`, testController.getRequestCounter);
testRouter.get(`${base}/drop`, testController.dropApp);

testRouter.delete(`${base}/${all_data}`, async (req: any, res: Response, next: NextFunction) => {
    await clearMongoCollections();
    new ApiResponse(res).send(HttpStatusCodes.NO_CONTENT);
});

testRouter.get(`${base}/${all_data}/agent`, async (req: any, res: Response, next: NextFunction) => {
    const parser = new UAParser();
    const ua = req.headers['user-agent']; // Get the user-agent string from headers
    const agen: IResult = parser.setUA(ua).getResult(); // Parse the user-agent string
    const ip: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const geo: Nullable<Lookup> = geoip.lookup(ip);
    const city = geo?.city || 'Not found';
    const country = geo?.country || 'Not found';

    res.send(`
      <p>Браузер: ${agen.browser.name}, версия браузера: ${agen.browser.version}</p>
      <p>Операционная система: ${agen.os.name} ${agen.os.version}</p>
      <p>Устройство: ${agen.device?.model || 'computer'}</p>
      <p>Страна: ${country}, Город: ${city}</p>
      <p>Ip: ${ip}</p>
    `);
});

testRouter.get(`${base}/samurai`, (req: any, res: Response, next: NextFunction) => {
    // throw new Error('This is a standard error');
    // new CustomError(401).add('one', 'one').add('two', 'two').throw();
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});
