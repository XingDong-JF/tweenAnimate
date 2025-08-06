/**
 * name: tweenAnimate.js
 * describe: 用于封装动画的方法函数
 * version: 1.0.0
 * time: 2025/8/5 20:19
 * 
 * -- 参数 --
 * arguments[0]: Object -必填 动画实施的对象主体
 * arguments[1]: Object -必填 需要变化的CSS属性与值
 * arguments[2]: Number -必填 动画持续时间
 * arguments[3]: Object -可选 动画的运动函数名和时间函数名
 * arguments[4]: Function -可选 动画结束运行的函数名
 * 
 * -- 返回值 --
 * return 无
 */
// getSprots(box, { left: leftValue, top: topValue, opacity: opacityValue }, 3000, {Type: Mode}, getCallback)
function tweenAnimate(arguments) {

    // 1.判断参数是否合法
    // 1.1 必填参数个数
    if (arguments.length < 3 || arguments.length > 5) throw console.error('请输入正确参数个数！');
    // 1.2 必填参数类型
    if (
        Object.prototype.toString.call(arguments[0]) !== '[object Object]' ||
        Object.prototype.toString.call(arguments[1]) !== '[object Object]' ||
        Object.prototype.toString.call(arguments[2]) !== '[object Number]'
    ) throw console.error('请输入合法参数！');
    // 1.3 长度为4的剩余参数校验
    // 1.3.1定义初始值
    let tweenObj;
    let getCallback;
    if (arguments.length === 4) {
        if (
            !(Object.prototype.toString.call(arguments[3]) === '[object Object]' ||
                Object.prototype.toString.call(arguments[3]) === '[object Function]')
        ) { throw console.error('请输入合法参数！'); }
        else {
            // 1.3.2对应赋值
            if (Object.prototype.toString.call(arguments[3]) === '[object Object]') {
                tweenObj = arguments[3];
            } else {
                getCallback = arguments[3];
            }
        }
    }
    // 1.4 长度为5的剩余参数校验
    if (arguments.length === 5) {
        if (Object.prototype.toString.call(arguments[3]) === Object.prototype.toString.call(arguments[4])) {
            throw console.error('请输入合法参数！');
        }
        else {
            if (
                !(Object.prototype.toString.call(arguments[3]) === '[object Object]' ||
                    Object.prototype.toString.call(arguments[3]) === '[object Function]') ||
                !(Object.prototype.toString.call(arguments[4]) === '[object Object]' ||
                    Object.prototype.toString.call(arguments[4]) === '[object Function]')
            ) { throw console.error('请输入合法参数！'); }
            else {
                // 1.4.1对应赋值
                if (Object.prototype.toString.call(arguments[3]) === '[object Object]') {
                    tweenObj = arguments[3];
                    getCallback = arguments[4];
                } else {
                    tweenObj = arguments[4];
                    getCallback = arguments[3];
                }
            }
        }
    }

    // 2.获取初始值
    const startObj = {};
    for (let k in arguments[1]) {
        startObj[k] = fetchComputedStyle(arguments[0], k);
    }

    // 3.获取变化总值
    const changeObj = {};
    for (let k in arguments[1]) {
        changeObj[k] = arguments[1][k] - startObj[k];
    }

    // 10.设置布长变量
    const stepObj = {};
    for (let k in arguments[1]) {
        stepObj[k] = (arguments[1][k] - startObj[k]) / totalCount;
    }

    // 11.设置中间变量
    const temObj = {};
    for (let k in startObj) {
        temObj[k] = startObj[k];
    }

    // 9.设置锁  --需要外部调用自行上锁
    // 7.定义定时器执行时间，默认设置10，后续优化可修改，得加钱！
    let interval = 10;
    // 4.定义当前时间/次数
    let count = 0;
    // 6.定义总次数
    let totalCount = parseInt(arguments[2] / interval);
    // 8.获取tweenObj的具体值  --Object.getOwnPropertyNames()方法也可以使用
    let tweenKey; // easingType:运动类型
    let tweenValue; // easingMode:时间函数(可以为''/'null')
    if (tweenObj !== undefined) {
        for (let k in tweenObj) {
            tweenKey = k;
            tweenValue = tweenObj[k];
        }
    }

    // 5.定义定时器
    let timer = setInterval(() => {

        count++;
        // 10.中间累加
        for (let k in temObj) {
            temObj[k] += stepObj[k];
        }
        // 5.1 应用变化量
        for (let k in changeObj) {
            // 5.2 判断是否有单位
            if (k === 'opacity') {
                // 5.3 判断是否使用tweenObj
                if (tweenObj === undefined) {
                    // 中间变量直接赋值
                    arguments[0].style[k] = temObj[k];
                } else {
                    // 判断是否为Linear
                    if (tweenKey === 'Linear') {
                        // (当前次数 ，初始值 ，变化总值 ，总次数)
                        arguments[0].style[k] = Math.tween[tweenKey](count, startObj[k], changeObj[k], totalCount);
                    } else {
                        arguments[0].style[k] = Math.tween[tweenKey][tweenValue](count, startObj[k], changeObj[k], totalCount);
                    }
                }
            } else {
                // 5.3 判断是否使用tweenObj
                if (tweenObj === undefined) {
                    // 中间变量直接赋值，避免单位字符串影响 
                    arguments[0].style[k] = temObj[k] + 'px';
                } else {
                    // 判断是否为Linear
                    if (tweenKey === 'Linear') {
                        // (当前次数 ，初始值 ，变化总值 ，总次数)
                        arguments[0].style[k] = Math.tween[tweenKey](count, startObj[k], changeObj[k], totalCount) + 'px';
                    } else {
                        arguments[0].style[k] = Math.tween[tweenKey][tweenValue](count, startObj[k], changeObj[k], totalCount) + 'px';
                    }
                }
            }
        }

        // 5.4判断是否达到总次数
        if (count === totalCount) {
            // 5.5清除定时器
            clearInterval(timer);
            // 5.6 强制终点误差
            for (let k in changeObj) {
                if (k === 'opacity') {
                    arguments[0].style[k] = arguments[1][k];
                } else {
                    arguments[0].style[k] = arguments[1][k] + 'px';
                }
            }
            // 5.7判断是否有完成时执行的回调函数
            if (getCallback !== undefined) {
                getCallback.call(arguments[0]);
            }
            // 9.1解锁
            arguments[0].lock = false;
        }
    }, interval)

}

// 封装获得计算后的样式
function fetchComputedStyle(obj, property) {
    // 验证是否支持
    if (window.getComputedStyle) {
        return parseFloat(window.getComputedStyle(obj)[property]);
    } else {
        return parseFloat(obj.currentStyle[property]);
    }
}

// 封装Tween对象
var Tween = {
    Linear: function (t, b, c, d) { return c * t / d + b; },
    Quad: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function (t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) {
                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}
Math.tween = Tween;