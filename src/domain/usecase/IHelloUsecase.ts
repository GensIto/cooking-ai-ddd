export interface IHelloUsecase {
  execute(name: string): Promise<void>;
}
