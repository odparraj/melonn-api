import LineItem from "./LineItem"
import { Moment } from 'moment'

export default class SellOrder {
    public sellerStore: string
    public shippingMethod: number
    public internalOrderNumber: string
    public externalOrderNumber: string
    public buyerFullName: string
    public buyerPhoneMumber: string
    public buyerEmail: string
    public shippingAddress: string
    public shippingCity: string
    public shippingRegion: string
    public shippingCountry: string
    public lineItems: LineItem[] = []
    public creationDate: Moment
    public packPromiseMin: Moment | null
    public packPromiseMax: Moment | null
    public shipPromiseMin: Moment | null
    public shipPromiseMax: Moment | null
    public deliveryPromiseMin: Moment | null
    public deliveryPromiseMax: Moment | null
    public readyPickupPromiseMin: Moment | null
    public readyPickupPromiseMax: Moment | null

    setData(payload) {
        Object.assign(this, payload)
    }

    get totalWeight(): number {
        return this.lineItems.map((item: LineItem) => item.productQty * item.productWeight).reduce((a, b) => a + b, 0)
    }
}
