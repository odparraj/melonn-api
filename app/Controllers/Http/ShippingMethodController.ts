import ShippingMethodRepository from '@ioc:Melonn/ShippingMethodRepository'

export default class ShippingMethodController {
  public async index() {
    return ShippingMethodRepository.list()
  }

  public async show({ params }) {
    return ShippingMethodRepository.find(params.id)
  }
}
