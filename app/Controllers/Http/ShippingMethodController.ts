import ShippingMethodRepository from '@ioc:Melonn/ShippingMethodRepository'
import { getShippingMethod } from 'App/Api/Melonn'

export default class ShippingMethodController {
  public async index() {
    return ShippingMethodRepository.list()
  }

  public async show({ params }) {
    return ShippingMethodRepository.find(params.id)
  }

  public async details({ params }) {
    return (await getShippingMethod(params.id)).data
  }
}
