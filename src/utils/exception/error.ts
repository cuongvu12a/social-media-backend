export type ErrorMap = {
  code: number;
  message: string;
};

export const ERROR = {
  UNKNOWN_ERROR: {
    code: -1,
    message: 'Unknown error!',
  },
  UPLOAD_FILE_ERROR: {
    code: 0,
    message: 'Upload file error!',
  },
  ACCOUNT_NOT_FOUND: {
    code: 1,
    message: 'Account not found!'
  },
  PASSWORD_NOT_VALID: {
    code: 2,
    message: 'Password not valid!'
  },
  ACCOUNT_EXIST: {
    code: 3,
    message: 'Account info exist!'
  },
};

export function getError(error: string) {
  throw new Error('this function is no longer supported');
}
