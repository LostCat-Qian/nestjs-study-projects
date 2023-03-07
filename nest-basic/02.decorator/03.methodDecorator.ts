/**
 * @title 方法装饰器
 */

const mDoc: MethodDecorator = (target: any, key: string | symbol, descriptor: any) => {
  // 此时，target 依旧是原型对象
  // key 是方法名称
  // descriptor 是方法的可配置项
  console.log(target, key, descriptor)

  // descriptor 对象所包含的属性
  // 可写：writable
  // 可枚举：enumerable
  // 可配置：configurable
}

class FizzDog3 {
  public name: string

  constructor() {
    this.name = 'fizzDog'
  }

  @mDoc
  getName() {}
}
