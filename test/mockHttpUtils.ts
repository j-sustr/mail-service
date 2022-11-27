/* eslint-disable no-underscore-dangle */
import { Request, Response } from "express";
import httpMocks, { MockRequest, MockResponse, RequestOptions, ResponseOptions } from "node-mocks-http";
// const httpMocks = require('node-mocks-http');

export interface Mocks<T1 extends Request, T2 extends Response> {
  req: MockRequest<T1>;
  res: MockResponse<T2>;
  result: Promise<Array<any>>;
  err: any;
}

// eslint-disable-next-line global-require
httpMocks.createResponse({ eventEmitter: require("events").EventEmitter });

// this wrapper allows to wait for async handlers which is not supported by default
export function createMocksAsync<T1 extends Request = Request, T2 extends Response = Response>(
  reqParams?: RequestOptions,
  resParams?: ResponseOptions
): Mocks<T1, T2> {
  let errResolver;
  const error = new Promise((res) => {
    errResolver = res;
  });

  const { req, res } = httpMocks.createMocks<T1, T2>(reqParams, resParams);

  let dataResolver: (data: object) => void | null;
  const data = new Promise((resolve) => {
    dataResolver = resolve;
  });
  res.on("end", () => dataResolver(res._getData()));

  const result = Promise.race([Promise.all([error, null]), Promise.all([null, data])]);
  return { req, res, err: errResolver, result };
}
