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
  BOOK_NOT_FOUND: {
    code: 4,
    message: 'Book not found!'
  },
  AUTHOR_NOT_FOUND: {
    code: 5,
    message: 'Author not found!'
  },
  PUBLISHER_NOT_FOUND: {
    code: 6,
    message: 'Publisher not found!'
  },
  BOOK_CATEGORY_NOT_FOUND: {
    code: 7,
    message: 'Book category not found!'
  },
  FILM_CATEGORY_NOT_FOUND: {
    code: 7,
    message: 'FILM category not found!'
  },
};

export function getError(error: string) {
  throw new Error('this function is no longer supported');
}
