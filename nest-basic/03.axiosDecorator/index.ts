/**
 * @title 通过装饰器实现一个 get 请求
 */

import axios from 'axios'

// 设计状态接口
interface State {
  status: number
  success: boolean
}

// 设计返回值数据类型接口
interface ListType {
  id: number
  title: string
  userName: string
  userPic: string
  coverUrl: string
  playUrl: string
  duration: string
}

const Get = (url: string): Function => {
  // 函数柯里化
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor): void => {
    const func = descriptor.value
    axios
      .get(url)
      .then((res) => {
        func(res.data.result.list, {
          status: 200,
          success: true
        })
      })
      .catch((err) => {
        func(err, {
          status: 500,
          success: false
        })
      })
  }
}

class Controller {
  constructor() {}

  @Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
  getList(list: ListType, state: State) {
    console.log(list, state)
  }
}
