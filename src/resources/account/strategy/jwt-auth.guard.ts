import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/models';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  
  handleRequest(err, payload, info) {
    // const data = payload as JwtPayload;
    if (err || !payload) {
      throw err || new UnauthorizedException();
    }
    return payload;
  }
}
