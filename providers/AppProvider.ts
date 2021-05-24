import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import SellOrderRepository from 'Modules/SellOrder/Repositories/SellOrderRepository'
import ShippingMethodRepository from 'Modules/ShippingMethod/Repositories/ShippingMethodRepository'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton(
      'Melonn/ShippingMethodRepository',
      () => new ShippingMethodRepository()
    )
    this.app.container.singleton('Melonn/SellOrderRepository', () => new SellOrderRepository())
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
