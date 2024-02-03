import { NextFunction, Request, Response, Router } from 'express';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';
import { testController } from '../controllers/test.controller';
import { clearMongoCollections } from '../../../tests/common/clearMongoCollections/clearMongoCollections';
import UAParser, { IResult } from 'ua-parser-js';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import geoip, { Lookup } from 'geoip-lite';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { DeviceSessionModel } from '../models/device-session.model';

export const videoPath = {
    base: '/testing',
    id: ':id',
    all_data: 'all-data',
    sessions: 'sessions',
};

const { base, id, all_data, sessions } = videoPath;
export const testRouter: Router = Router();

testRouter.get(`${base}`, testController.getRequestCounter);
testRouter.get(`${base}/drop`, testController.dropApp);

testRouter.delete(`${base}/${all_data}`, async (req: any, res: Response, next: NextFunction) => {
    await clearMongoCollections();
    new ApiResponse(res).send(HttpStatusCodes.NO_CONTENT);
});

testRouter.delete(`${base}/${all_data}/${sessions}`, async (req: any, res: Response, next: NextFunction) => {
    await DeviceSessionModel.deleteMany({});
    new ApiResponse(res).send(HttpStatusCodes.NO_CONTENT);
});

testRouter.get(`${base}/${all_data}/agent`, (req: Request, res: Response, next: NextFunction) => {
    const parser = new UAParser();
    const ua: Optional<string> = req.headers['user-agent']; // Get the user-agent string from headers
    if (!ua) {
        res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).send(`You should set up user-agent for headers`);
        return;
    }
    const agen: IResult = parser.setUA(ua).getResult(); // Parse the user-agent string
    // Предполагаем, что req.headers['x-forwarded-for'] может быть string или string[].
    const xForwardedFor = req.headers['x-forwarded-for'];
    let clientIp: Optional<string>;

    if (typeof xForwardedFor === 'string') {
        // Если это строка, то используем split для получения первого IP-адреса.
        clientIp = xForwardedFor.split(',')[0];
    } else if (Array.isArray(xForwardedFor)) {
        // Если это массив строк, просто берем первый элемент массива.
        clientIp = xForwardedFor[0];
    } else {
        // Если заголовок не установлен или его значение не является строкой или массивом строк,
        // то используем IP-адрес, предоставленный Express.js.
        clientIp = req.ip;
    }

    if (!clientIp) {
        res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).send(`You should set up x-forwarded-for for headers`);
        return;
    }

    const geo: Nullable<Lookup> = geoip.lookup(clientIp);
    const city = geo?.city || 'Not found';
    const country = geo?.country || 'Not found';

    res.send(`
      <p>Браузер: ${agen.browser.name}, версия браузера: ${agen.browser.version}</p>
      <p>Операционная система: ${agen.os.name} ${agen.os.version}</p>
      <p>Устройство: ${agen.device?.model || 'computer'}</p>
      <p>Страна: ${country}, Город: ${city}</p>
      <p>Ip: ${clientIp}</p>
    `);
});

testRouter.get(`${base}/samurai`, (req: any, res: Response, next: NextFunction) => {
    // throw new Error('This is a standard error');
    // new CustomError(401).add('one', 'one').add('two', 'two').throw();
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});
