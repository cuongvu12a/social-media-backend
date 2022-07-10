import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminService } from './admin.service';

@Resolver('Admin')
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}
}
