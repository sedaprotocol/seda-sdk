import { httpFetch, HttpFetchOptions } from '../http';

describe('http', () => {
  it('do a http fetch', () => {
    const options = new HttpFetchOptions();
    const headers = new Map<string, string>();

    headers.set('Content-Type', 'application/json');
    options.headers = headers;

    const result = httpFetch('http://example.com', options);

    expect(result.toString()).toBe("{}");
  });
});
