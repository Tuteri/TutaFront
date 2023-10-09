import _ from 'lodash';
import qs from 'qs'
export function getFileName(fileName: string, ext = false): string {
  const reg = /([^<>/\\\|:""\*\?]+)\.\w+$/
  let fileNameArr = fileName.match(reg)
  if (fileNameArr) {
    return fileNameArr[ext ? 0 : 1]
  }
  return '';

}

export function log(item: any) {
  console.log(item)
}

export function cascader(options: any): any {
  return cascaderHanlde(options.data, options.id, options.key, options.value);
}
// 父子级节点
export function cascaderHanlde(data: any, id: any = false, key: string = "title", value: string = "id"): any {
  const arr: any = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const obj = {
      label: item[key],
      value: item[value] + "",
      children: [],
      lastNode: false,
      disabled: item.id == id,
    }
    arr.push(obj);
    if (item.children && item.children.length > 0 && !obj.disabled) {
      obj.children = cascaderHanlde(item.children, id, key, value)
    }else{
      obj.lastNode = true;
    }
  }
  return arr;
}
export function menusCascader(data: any, id: any = null): Array<any> {
  return [{
    label: '根目录',
    value: 0,
    children: [...cascader({ data, id })],
  }]
}
// 字符串下划线转驼峰
export const formatToHump = (value: string) => {
  return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
}

// 字符串驼峰转下划线
export const formatToLine = (value: string) => {
  return value.replace(/([A-Z])/g, '_$1').toLowerCase()
}
/**
 * 将对象属性 下划线与小驼峰转换
 * @param data 数据对象
 * @param type 转换方式 hump=驼峰 line=下划线
 * @returns 
 */
export const formatHumpLineTransfer = (datas: any, type = 'hump') => {
  let hump = ''

  let data = Object.assign({}, datas)
  // 转换对象中的每一个键值为驼峰的递归
  const formatTransferKey = (data: any) => {
    if (data instanceof Array) {
      data.forEach(item => formatTransferKey(item))
    } else if (data instanceof Object) {
      for (const key in data) {
        hump = type === 'hump' ? formatToHump(key) : formatToLine(key)
        data[hump] = data[key]
        if (key !== hump) {
          delete data[key]
        }
        if (data[hump] instanceof Object) {
          formatTransferKey(data[hump])
        }
      }
    } else if (typeof data === 'string') {
      data = type === 'hump' ? formatToHump(data) : formatToLine(data)
    }
  }
  formatTransferKey(data)
  return data
}
/**
 * 树形结构扁平化
 * @param treeNode 树形结构
 */
export const treeNodeToArray = (treeNode: Array<any>) => {
  var res: any = []
  for (const item of treeNode) {
    const { children, ...i } = item
    res.push(i)
    if (children && children.length) {
      res = res.concat(treeNodeToArray(children))
    }
  }
  return res
}
// 节流函数
export const throttle = (fn: any, time = 2000) => {
  return _.throttle(fn, time, { 'trailing': false })
};
export const treeNodeClass = (data: any, node: any): any => {
  if(data.lastNode){
    return 'is-penultimate'
  }
  
  return false;
}


export const findParent = (data: any, id: any, result: any[]) => {
  for (let item of data) {
    if (item.value == id) {
      //将查找到的目标数据加入结果数组中
      //可根据需求unshift(item.value)或unshift(item)
      // result.unshift(item.value)
      return true
    }
    if (item.children && item.children.length > 0) {
      //根据查找到的结果往上找父级节点
      let isFind = findParent(item.children, id, result)
      if (isFind) {
        result.unshift(item.value)
        return true
      }
    }
  }
  //走到这说明没找到目标
  return false
}

export const findTreeParents = (data: any, id: any) => {
  let result: any[] = [];
  findParent(data, id, result);
  return result;
}

// 深克隆
export const deepClone = (obj: any): any => {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel();
    port1.postMessage(obj);
    port2.onmessage = (msg) => {
      resolve(msg.data);
    }
  })
}

export const queryString = (url: string, data: any): string => {
  return url + "?" + qs.stringify(data)
}

// 过滤对象值为false/undefined/''/null的属性
export const filterObject = (obj: any) => {
  const filter: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const item = obj[key];
      if (!item) continue;
      if (_.isArray(item) && item.length < 0) continue;
      filter[key] = item;
    }
  }

  return filter;
}