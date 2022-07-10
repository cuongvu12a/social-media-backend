import { Role } from "@prisma/client";

export interface JwtPayload {
  email: string;
  identityNumber: string;
  role: Role
}
