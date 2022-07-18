
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum OrderByType {
    DESC = "DESC",
    ASC = "ASC"
}

export enum GetListBookOrderBy {
    IDENTITY_NUMBER = "IDENTITY_NUMBER",
    TITLE = "TITLE",
    NUMBER_OF_PAGES = "NUMBER_OF_PAGES",
    RELEASE_AT = "RELEASE_AT",
    AUTHOR = "AUTHOR",
    PUBLISHER = "PUBLISHER",
    CATEGORY = "CATEGORY",
    CREATED_AT = "CREATED_AT"
}

export enum GetListPostOrderBy {
    IDENTITY_NUMBER = "IDENTITY_NUMBER",
    TITLE = "TITLE",
    AUTHOR = "AUTHOR",
    CREATED_AT = "CREATED_AT"
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum FileCategory {
    THUMBNAIL_BOOK = "THUMBNAIL_BOOK",
    EBOOK = "EBOOK",
    MEDIA = "MEDIA",
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

export class CreateAuthorInput {
    name: string;
    avatar?: Nullable<ObjFileInput>;
}

export class GetListBookCondition {
    orderType?: Nullable<OrderByType>;
    orderBy?: Nullable<GetListBookOrderBy>;
    searching?: Nullable<string>;
    publishIds?: Nullable<Nullable<string>[]>;
    authorIds?: Nullable<Nullable<string>[]>;
    categoryIds?: Nullable<Nullable<string>[]>;
}

export class CreateBookInput {
    title: string;
    content: string;
    numberOfPages?: Nullable<number>;
    authorId?: Nullable<string>;
    publishId?: Nullable<string>;
    categoryId?: Nullable<string>;
    releaseAt?: Nullable<DateTime>;
    thumbnail?: Nullable<ObjFileInput>;
    ebook?: Nullable<ObjFileInput>;
}

export class CreateBookCategoryInput {
    name: string;
}

export class ObjFileInput {
    filename: string;
    mimetype: string;
    fileCategory: FileCategory;
}

export class PaginationInput {
    page?: Nullable<number>;
    size?: Nullable<number>;
}

export class CreatePostInput {
    title: string;
    content: string;
    medias?: Nullable<Nullable<ObjFileInput>[]>;
    authorId: string;
}

export class GetListPostCondition {
    orderType?: Nullable<OrderByType>;
    orderBy?: Nullable<GetListPostOrderBy>;
    searching?: Nullable<string>;
    authorIds?: Nullable<Nullable<string>[]>;
}

export class CreatePublisherInput {
    name: string;
}

export abstract class IQuery {
    abstract getAccountInfo(): string | Promise<string>;

    abstract getListBook(pagination?: Nullable<PaginationInput>, condition?: Nullable<GetListBookCondition>): GetListBookResponse | Promise<GetListBookResponse>;

    abstract getBookById(bookId: string): GetBookByIdResponse | Promise<GetBookByIdResponse>;

    abstract getListPost(pagination?: Nullable<PaginationInput>, condition?: Nullable<GetListPostCondition>): GetListPostResponse | Promise<GetListPostResponse>;
}

export abstract class IMutation {
    abstract signIn(data: SignInInput): AuthResponse | Promise<AuthResponse>;

    abstract signUp(data: SignUpInput): AuthResponse | Promise<AuthResponse>;

    abstract createAuthor(data: CreateAuthorInput): boolean | Promise<boolean>;

    abstract createBook(data: CreateBookInput): boolean | Promise<boolean>;

    abstract createBookCategory(data: CreateBookCategoryInput): boolean | Promise<boolean>;

    abstract createPost(data: CreatePostInput): boolean | Promise<boolean>;

    abstract createPublisher(data: CreatePublisherInput): boolean | Promise<boolean>;

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

export class Author {
    id: string;
    name: string;
    avatar?: Nullable<ObjFileOutput>;
}

export class GetListBookResponse {
    data: BookForGetListBookResponse[];
    pagination: Pagination;
}

export class BookForGetListBookResponse {
    id: string;
    identityNumber: string;
    title?: Nullable<string>;
    releaseAt?: Nullable<DateTime>;
    author?: Nullable<Author>;
    publisher?: Nullable<Publisher>;
    category?: Nullable<BookCategory>;
    thumbnail?: Nullable<ObjFileOutput>;
}

export class GetBookByIdResponse {
    id: string;
    identityNumber: string;
    title?: Nullable<string>;
    releaseAt?: Nullable<DateTime>;
    author?: Nullable<Author>;
    publisher?: Nullable<Publisher>;
    category?: Nullable<BookCategory>;
    thumbnail?: Nullable<ObjFileOutput>;
    content?: Nullable<string>;
    numberOfPages?: Nullable<number>;
    ebook?: Nullable<ObjFileOutput>;
}

export class BookCategory {
    id: string;
    name: string;
    parentId?: Nullable<string>;
    parentName?: Nullable<string>;
}

export class ObjFileOutput {
    id: string;
    filename: string;
    mimetype: string;
    fileCategory: FileCategory;
}

export class Pagination {
    page?: Nullable<number>;
    size?: Nullable<number>;
    totalData?: Nullable<number>;
}

export class GetListPostResponse {
    data: PostForGetListPostResponse[];
    pagination: Pagination;
}

export class PostForGetListPostResponse {
    id: string;
    identityNumber: string;
    title?: Nullable<string>;
    content?: Nullable<string>;
    author?: Nullable<Author>;
    medias?: Nullable<Nullable<ObjFileOutput>[]>;
}

export class Publisher {
    id: string;
    name: string;
}

export class UploadFileResponse {
    filename: string;
    mimetype: string;
}

export type DateTime = Date;
export type Upload = any;
type Nullable<T> = T | null;
