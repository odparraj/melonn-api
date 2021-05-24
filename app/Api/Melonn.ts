import service from 'App/Services/MelonnService'
import { AxiosPromise } from 'axios'
import ShippingMethod from 'Modules/ShippingMethod/Models/ShippingMethod'

export const getShippingMethods = (): AxiosPromise<ShippingMethod[]> => service.get<ShippingMethod[]>(`/shipping-methods`)

export const getShippingMethod = (id: number): AxiosPromise<ShippingMethod> => service.get<ShippingMethod>(`/shipping-methods/${id}`)

export const getOffDays = (): AxiosPromise<string[]> => service.get<string[]>(`/off-days`)