import { type SchemaTypeDefinition } from "sanity";
import { shippingAddress, orderItem, order } from "./schemas/order";
import { product } from "./schemas/product";
import { productCategory } from "./schemas/product-category";
import { promotionCampaign } from "./schemas/promotion-campaign";
import { promotionCode } from "./schemas/promotion-codes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCode,
    promotionCampaign,

    productCategory,
    product,

    shippingAddress,
    orderItem,
    order,
  ],
};
