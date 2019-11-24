/**************
 * pupputeer 操作
 *************/

/**
 * 获得dom对象的rect信息
 * 特别注意：必须在可见状态时(display:block)获取getBoundingClientRect()
 * @param {Page} page 
 * @param {String} selector 
 */
async function getDomRect(page, selector) {
  return await page.$eval(selector, e => {
    const rect = e.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    }
  });
}
/**
 * 隐藏元素
 * @param {*} page 
 * @param {*} selector 
 */
async function hide(page, selector) {
  await page.$eval(selector, e => {
    e.style.display = 'none'
  })
}
/**
 * 显示元素
 * @param {*} page 
 * @param {*} selector 
 */
async function show(page, selector) {
  await page.$eval(selector, e => {
    e.style.display = 'block'
  })
}
/**
 * 检测元素是否显示
 * @param {*} page 
 * @param {*} selector 
 */
async function isDisplay(page, selector) {
  let element = await page.$(selector)
  if (element) {
    let display = await page.$eval(selector, e => {
      var disp = getComputedStyle(e, null).getPropertyValue('display') 
      return disp == 'block'; 
    })
    return display
  }
  return false
}
/**
 * 鼠标拖动
 * @param {*} from 
 * @param {*} to 
 */
async function drag(page, from, to) {
  console.log('drag start:', from);
  console.log('drag end:', to);
  //滑动滑块
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y);
  await page.mouse.up();
  await page.waitFor(800); //增加延时能等页面js响应
  console.log('mouse up')
  return true;
}

module.exports = {
  getDomRect,
  hide,
  show,
  isDisplay,
  drag
}