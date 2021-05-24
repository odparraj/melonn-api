import { schema, rules } from '@ioc:Adonis/Core/Validator'
/**
  - seller store (user input)
  - shipping method (list available shipping methods coming from the shipping method api, more details later...) this should be something like a dropdown so the user can select a shipping method.
  - external order number (user input)
  - buyer full name (user input)
  - buyer phone number (user input)
  - buyer email (user input)
  - shipping address (user input)
  - shipping city (user input)
  - shipping region (user input)
  - shipping country (user input)
  - line items (list of items, can add multiple items)
  - product name (user input)
  - product qty (user input)
  - product weight (user input)
*/

const SellOrderShema = schema.create({
  sellerStore: schema.string({ trim: true }),
  shippingMethod: schema.number(),
  externalOrderNumber: schema.string({ trim: true }),
  buyerFullName: schema.string({ trim: true }),
  buyerPhoneMumber: schema.string({ trim: true }),
  buyerEmail: schema.string({ trim: true }, [
    rules.email()
  ]),
  shippingAddress: schema.string({ trim: true }),
  shippingCity: schema.string({ trim: true }),
  shippingRegion: schema.string({ trim: true }),
  shippingCountry: schema.string({ trim: true }),
  lineItems: schema.array().members(schema.object().members({
    productName: schema.string(),
    productQty: schema.number(),
    productWeight: schema.number(),
  })),
})

export default SellOrderShema