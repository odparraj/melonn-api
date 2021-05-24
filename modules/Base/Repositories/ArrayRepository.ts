import BaseRepositoryInterface from 'Modules/Base/Interfaces/BaseRepositoryInterface'

export default abstract class ArrayRepository<T> implements BaseRepositoryInterface<T> {
  private data: T[] = []
  protected primaryKey: string = 'id'

  async list() {
    return this.data
  }

  async add(model: T) {
    this.data.push(model)
    return model
  }

  async find(id: string | number) {
    const item = this.data.find((item: T) => item[this.primaryKey] == id)
    if (!item) {
      throw new Error('Not Found Exception')
    }
    return item
  }
}
