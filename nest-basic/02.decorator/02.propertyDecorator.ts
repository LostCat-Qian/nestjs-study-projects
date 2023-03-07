/**
 * @title 属性装饰器
 */

const doc2: PropertyDecorator = (target: any, key: string | symbol) => {
  // 此时，target 就是原型对象，该原型对象就是类的原型对象
  // key 就是指向的属性
  console.log(target, key)
}

class FizzDog2 {
  @doc2
  public name: string

  constructor() {
    this.name = 'fizzDog'
  }
}
