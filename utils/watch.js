// 监听函数
const setWatcher = (page) => {
  let data = page.data; // 获取page 页面data
  let watch = page.watch;
  for(let i in watch){
    let key = i.split('.'); // 将watch中的属性以'.'切分成数组
    let nowData = data; // 将data赋值给nowData
    let lastKey = key[key.length - 1];
    let watchFun = watch[i].handler || watch[i]; // 兼容带handler和不带handler的两种写法
    let deep = watch[i].deep; // 若未设置deep,则为undefine
    observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
  }
  // 监听属性 并执行监听函数
  function observe (obj, key, watchFun, deep, page) {
    let val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      for(let i in val){
        this.observe(val, i, watchFun, deep, page); // 递归调用监听函数
      }
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          observe(obj, key, watchFun, deep, page);
        }
      },
      get: function () {
        return val;
      }
    })
  }
}


module.exports = {
  setWatcher: setWatcher
}