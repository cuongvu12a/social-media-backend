import { ErrorMap, ERROR } from './error';

export class Exception extends Error {
  constructor(error: ErrorMap) {
    super();
    this.message = JSON.stringify(error);
  }

  static handle(error: Error) {
    let exception: Exception;
    const defaultError: ErrorMap = ERROR.UNKNOWN_ERROR;

    if (!(error instanceof Exception)) {
      exception = new Exception(defaultError);
    } else exception = error;
    throw exception;
  }
}
