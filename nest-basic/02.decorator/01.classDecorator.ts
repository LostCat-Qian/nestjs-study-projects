// decorator 其实就是一个函数

/**
 * @title 类装饰器
 */
// 此时的 target 形参就是被装饰的类或函数本身
const doc: ClassDecorator = (target: any) => {
  console.log(target)

  // 可以对其属性做手脚
  // 好处：可以在不破坏原本类结构的情况下，为类添加新的属性和方法
  target.prototype.name = 'fizzDog'
}

@doc
class FizzDog {
  constructor() {}
}

// 用法2：向下兼容
// doc(FizzDog)

const fg: any = new FizzDog()
console.log(fg.name)
