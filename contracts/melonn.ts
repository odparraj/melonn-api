declare module '@ioc:Melonn/ShippingMethodRepository' {
  import BaseRepositoryInterface from 'Modules/Base/Interfaces/BaseRepositoryInterface'
  import ShippingMethod from 'Modules/ShippingMethod/Models/ShippingMethod'

  const ShippingMethodRepository: BaseRepositoryInterface<ShippingMethod>

  export default ShippingMethodRepository
}

declare module '@ioc:Melonn/SellOrderRepository' {
  import BaseRepositoryInterface from 'Modules/Base/Interfaces/BaseRepositoryInterface'
  import SellOrder from 'Modules/SellOrder/Models/SellOrder'

  const SellOrderRepository: BaseRepositoryInterface<SellOrder>

  export default SellOrderRepository
}
