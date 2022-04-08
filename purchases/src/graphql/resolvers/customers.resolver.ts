import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../../http/auth/authorization.guard';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Customer } from '../models/customer';
import { CustomersService } from '../../services/customers.service';
import { AuthUser, CurrentUser } from '../../http/auth/current-user';
import { PurchasesService } from '../../services/purchases.services';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => Customer)
  async me(@CurrentUser() user: AuthUser) {
    return await this.customersService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id);
  }
}
