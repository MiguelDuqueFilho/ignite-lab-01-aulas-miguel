import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../../http/auth/authorization.guard';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { PurchasesService } from '../../services/purchases.services';
import { Purchase } from '../models/purchase';

import { ProductsService } from '../../services/products.services';

import { CreatePurchaseInput } from '../imputs/create-purchase-input';
import { AuthUser, CurrentUser } from '../../http/auth/current-user';

import { CustomersService } from '../../services/customers.service';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchaseService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}
  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchase() {
    return this.purchaseService.listAllPurchases();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productsService.getProductById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    let customer = await this.customersService.getCustomerByAuthUserId(
      user.sub,
    );

    if (!customer) {
      customer = await this.customersService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.purchaseService.createPurchase({
      customerId: customer.id,
      productId: data.productId,
    });
    return null;
  }
}
