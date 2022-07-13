
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum FileCategory {
    MAIN_PHOTO = "MAIN_PHOTO"
}

export class SignInInput {
    email: string;
    password: string;
}

export class SignUpInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthday?: Nullable<DateTime>;
    phoneNumber?: Nullable<string>;
    accountName?: Nullable<string>;
}

export abstract class IQuery {
    abstract getAccountInfo(): string | Promise<string>;
}

export abstract class IMutation {
    abstract signIn(data: SignInInput): AuthResponse | Promise<AuthResponse>;

    abstract signUp(data: SignUpInput): AuthResponse | Promise<AuthResponse>;

    abstract singleUpload(file: Upload): UploadFileResponse | Promise<UploadFileResponse>;

    abstract multipleUpload(files: Upload[]): UploadFileResponse[] | Promise<UploadFileResponse[]>;
}

export class AccountResponse {
    id: string;
    identityNumber?: Nullable<string>;
    accountName?: Nullable<string>;
    firstName: string;
    lastName: string;
    email: string;
    birthday?: Nullable<DateTime>;
    phoneNumber?: Nullable<string>;
    role: Role;
    isActive: boolean;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    deletedAt?: Nullable<DateTime>;
}

export class Token {
    accessToken: string;
    refreshToken?: Nullable<string>;
}

export class AuthResponse {
    account: AccountResponse;
    token: Token;
}

export class UploadFileResponse {
    filename: string;
    mimetype: string;
}

export type DateTime = Date;
export type Upload = any;
type Nullable<T> = T | null;
