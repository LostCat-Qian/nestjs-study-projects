import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import * as path from 'path';

@Injectable()
export class SpiderService {
  async downloadAll() {
    const urls: string[] = [];
    const baseUrl = 'http://www.jpmn5.top';
    let index = 0;

    const getPics = async () => {
      const body = await axios
        .get(
          `http://www.jpmn5.top/Xgyw/Xgyw24303${index ? '_' + index : ''}.html`,
          // `${url.slice(0, -5)}${index ? '_' + index : ''}.html`,
        )
        .then(async (res) => res.data);

      const $ = cheerio.load(body);

      // 获取分页
      const page = $('.pagination').eq(0).find('a');
      const pageArray = page
        .map(function () {
          return $(this).text();
        })
        .toArray(); // 通过 toArray() 方法将 cheerio 对象转换为数组

      // 如果依然存在 ‘下一页’ 按钮，则进行递归
      if (pageArray.includes('下一页')) {
        // 获取每张图片的 url 后缀
        $('.article-content p img').each(function () {
          urls.push(baseUrl + $(this).attr('src'));
          // 获取到之后让索引+1
        });
        index++;
        await getPics();
      }
    };

    // 调用函数
    await getPics();

    // console.log(urls);

    // 调用写入文件的函数
    this.writeFile(urls);

    return 'pic';
  }

  writeFile(urls: string[]) {
    urls.forEach(async (url) => {
      const buffer = await axios
        .get(url, { responseType: 'arraybuffer' })
        .then((res) => res.data);

      const ws = createWriteStream(
        path.join(__dirname, '../images/' + new Date().getTime() + '.jpg'),
      );

      ws.write(buffer);
    });
  }
}
