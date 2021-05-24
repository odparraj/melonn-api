import ArrayRepository from 'Modules/Base/Repositories/ArrayRepository'
import SellOrder from 'Modules/SellOrder/Models/SellOrder'

export default class SellOrderRepository extends ArrayRepository<SellOrder> {
    protected primaryKey: string = 'internalOrderNumber'
}
