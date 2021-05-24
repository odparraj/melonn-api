import ShippingMethodRepository from '@ioc:Melonn/ShippingMethodRepository'
import { getShippingMethods } from 'App/Api/Melonn'

const loadData = async () => {
  try {
    const { data } = await getShippingMethods()

    data.forEach((element) => {
      ShippingMethodRepository.add(element)
    })
  } catch (error) {
    throw error
  }
}

loadData()
