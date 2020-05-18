export class ApiService {
  async parseResponseError(response: Response | Error) {
    if (isError(response)) {
      return response;
    }
    try {
      const body = await response.json();
      return body?.error ?? body;
    } catch {
      return {
        message: 'Server unreachable',
      };
    }
  }
}

function isError(e?: Response | Error): e is Error {
  if (!e) {
    return false;
  }
  return !!(e as Error).message;
}
