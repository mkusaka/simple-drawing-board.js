;(function(global, undefined) {
'use strict';

var Util = {
    // 便利メソッドたち
    isTouch:         (isTouch()),
    isTransparent:   isTransparent,
    isDrawableEl:    isDrawableEl,
    getAdjustedRect: getAdjustedRect,

    // shim
    rAF: (rAF()),
    cAF: (cAF()),

    // EA
    Eve: Eve,

    // THE 定数
    Const: {
        settings: {
            lineColor:    '#aaa',
            lineSize:     5,
            boardColor:   'transparent',
            historyDepth: 10
        }
    }
};

/**
 * touchデバイス or NOT
 *
 * @return {Boolean}
 *     isTouchデバイス
 */
function isTouch() {
    if ('process' in global) { return false; }
    return 'ontouchstart' in global.document;
}

/**
 * 透過の背景の場合、消すモードの処理が微妙に変わるので、
 * それをチェックしたい
 *
 * @param {String} color
 *     色
 */
function isTransparent(color) {
    color = color.replace(/\s/g, '');
    if (color === 'transparent')   { return true; }
    // TODO: strict
    if (color === 'rgba(0,0,0,0)') { return true; }
    return false;
}

/**
 * ctx.drawImageできるのは3つ
 *
 * @param {HTMLElement} el
 *     チェックする要素
 * @return {Boolean}
 *     描画できる要素かどうか
 *
 */
function isDrawableEl(el) {
    var isDrawable = [
        'img',
        'canvas',
        'video'
    ].indexOf(el.tagName.toLowerCase()) !== -1;

    return isDrawable;
}

/**
 * スクロールされた状態でリロードすると、位置ズレするっぽいので、
 * スクロール位置も加味してgetBoundingClientRectする
 *
 * @param {HTMLElement} el
 *     チェックする要素
 * @return {Object}
 *     left / topの位置
 *
 */
function getAdjustedRect(el) {
    var elRect = el.getBoundingClientRect();
    return {
      left: elRect.left + global.scrollX,
      top:  elRect.top  + global.scrollY
    };
}

/**
 * requestAnimationFrameのshim
 *
 */
function rAF() {
    return (global.requestAnimationFrame       ||
            global.webkitRequestAnimationFrame ||
            global.mozRequestAnimationFrame    ||
            function(callback) {
                global.setTimeout(callback, 1000 / 60);
            }).bind(global);
}

/**
 * cancelAnimationFrameのshim
 *
 */
function cAF() {
    return (global.cancelAnimationFrame       ||
            global.webkitCancelAnimationFrame ||
            global.mozCancelAnimationFrame    ||
            function(callback) {
                global.clearTimeout(callback);
            }).bind(global);
}

/**
 * Minimal event interface
 * See `https://gist.github.com/leader22/3ab8416ce41883ae1ccd`
 *
 */
function Eve() {
    this._events = {};
}
Eve.prototype = {
    constructor: Eve,
    on: function(evName, handler) {
        var events = this._events;

        if (!(evName in events)) {
            events[evName] = [];
        }
        events[evName].push(handler);
    },
    off: function(evName, handler) {
        var events = this._events;

        if (!(evName in events)) {
            return;
        }
        if (!handler) {
            events[evName] = [];
        }

        var handlerIdx = events[evName].indexOf(handler);
        if (handlerIdx >= 0) {
            events[evName].splice(handlerIdx, 1);
        }
    },
    trigger: function(evName, evData) {
        var events = this._events,
            handler;

        if (!(evName in events)) { return; }

        var i = 0, l = events[evName].length;
        for (; i < l; i++) {
            handler = events[evName][i];
            handler.handleEvent ? handler.handleEvent.call(this, evData)
                                : handler.call(this, evData);
        }
    }
};

// Export
if ('process' in global) {
    module.exports = Util;
}
// for Require.js
else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return Util;
    });
}
else {
    global.SimpleDrawingBoard.util = Util;
}

}(this.self || global));
