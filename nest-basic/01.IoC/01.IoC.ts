// IoC 控制反转，具体定义是高层模块不应该依赖低层模块，二者都应该依赖其抽象；
// 抽象不应该依赖细节；细节应该依赖抽象

// 以下的代码，耦合性非常高
// class A {
//   name: string
//   constructor() {
//     this.name = 'fizzDog'
//   }
// }

// class B {
//   a: any
//   constructor() {
//     this.a = new A().name
//   }
// }

// class C {
//   a: any
//   constructor() {
//     this.a = new A().name
//   }
// }

// 为了解决以上的问题，引入了依赖注入和控制反转
class A {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class C {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

// 创建一个容器（调度器）用来收集引用
class Container {
  module: any
  constructor() {
    this.module = {}
  }

  provide(key: string, module: any) {
    this.module[key] = module
  }

  get(key: string) {
    return this.module[key]
  }
}

const module = new Container()
module.provide('a', new A('fizzDog Hello!'))
module.provide('c', new C('fizzDog Hi~'))

// 在引入 IoC 容器之后， B 与 A 已经解耦，可以单独拓展其功能，也可以方便的加入其它模块 C
// 所以在面对复杂的后端逻辑中，引入 IoC 可以降低组件之间的耦合度，实现系统各层的解耦
class B {
  a: any
  c: any
  constructor(module: Container) {
    // 这样的写法，就让 B 类和 A 类没有了依赖关系，解耦合
    // 类似于发布-订阅者模式
    this.a = module.get('a')
    this.c = module.get('c')
  }
}
