/**
 * @title 参数装饰器
 */

const pDoc: ParameterDecorator = (target: any, key: string | symbol, index: any) => {
  // 此时，target 依旧是原型对象
  // key 是方法名
  // index 是参数所在的位置索引
  console.log(target, key, index)
}

class FizzDog4 {
  public name: string

  constructor() {
    this.name = 'fizzDog'
  }

  getName(name: string, @pDoc age: number) {}
}
