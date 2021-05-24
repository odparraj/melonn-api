import { Rules } from "./Rules"

export default class ShippingMethod {
  public id: number
  public name: string
  public descripcion: string
  public code: string
  public shipping_type: string
  public rules: Rules
}
