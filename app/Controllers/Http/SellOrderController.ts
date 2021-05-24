import SellOrderRepository from '@ioc:Melonn/SellOrderRepository'
import { calculateSellOrderValues } from 'App/Utils'
import SellOrderShema from 'App/Validations/SellOrderShema'
import SellOrder from 'Modules/SellOrder/Models/SellOrder'

export default class SellOrderController {
  public async index() {
    return SellOrderRepository.list()
  }

  public async show({ params }) {
    return SellOrderRepository.find(params.id)
  }

  public async store({ request }) {    
    const payload = await request.validate({ schema: SellOrderShema })
    const sellOrder = new SellOrder()
    sellOrder.setData(payload)

    const calculatedOrderValues = await calculateSellOrderValues(sellOrder)
    sellOrder.setData(calculatedOrderValues)

    return SellOrderRepository.add(sellOrder)
  }
}
