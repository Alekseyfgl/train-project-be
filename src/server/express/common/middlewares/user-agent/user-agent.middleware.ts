import { NextFunction, Request, Response } from 'express';
import UAParser, { IResult } from 'ua-parser-js';
import { Nullable, Optional } from '../../interfaces/optional.types';
import { HttpStatusCodes } from '../../constans/http-status-codes';
import geoip, { Lookup } from 'geoip-lite';
import { IAgentInfo, UserBrowserType, UserLocationType, UserOsType } from '../../../types/auth/input';

export const setUserAgentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip: string = req.networkInfo.ip;

    const parser = new UAParser();
    const ua: Optional<string> = req.headers['user-agent']; // Get the user-agent string from headers
    if (!ua) {
        res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).send(`You should set up user-agent for headers`);
        return;
    }
    const agen: IResult = parser.setUA(ua).getResult(); // Parse the user-agent string

    const geo: Nullable<Lookup> = geoip.lookup(ip);

    const loc: UserLocationType = geo ? `Country:${geo.country}, city:${geo.city}` : 'Unknown';
    const browser: UserBrowserType = geo ? `Browser:${agen.browser.name}, version:${agen.browser.version}` : 'Unknown';
    const os: UserOsType = agen.os.name ? agen.os.name : 'Unknown';
    const type = agen.device.type;

    const agentInfo: IAgentInfo = { browser, ip, loc, os };
    req.networkInfo = agentInfo;
    next();
};
