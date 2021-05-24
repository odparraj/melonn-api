export default interface BaseRepositoryInterface<T> {
  list(): Promise<T[]>

  add(model: T): Promise<T>

  find(id: string | number): Promise<T>
}
