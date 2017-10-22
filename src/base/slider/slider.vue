<template>
  <div class='slider' ref='slider'>
    <div class='slider-group' ref='sliderGroup'>
      <slot></slot>
    </div>
    <div v-show='showDots' class='dots'>
      <span class='dot' :class="{'active': currentPageIndex === index}" v-for='(item, index) in dots'></span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    showDots: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      currentPageIndex: 0,
      dots: []
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this.showDots && this._initDots()
      this._initSlider()
      this.autoPlay && this._play()
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return
      }
      clearTimeout(this.resizerTimer)
      this.resizerTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._handleScrollEnd()
        } else {
          this.autoPlay && this._play()
        }
        this._refresh()
      }, 60)
    })
  },
  activated() {
    if (!this.slider) {
      return
    }
    this.slider.enable()
    let pageIndex = this.slider.getCurrentPage().pageX
    if (pageIndex > this.dots.length) {
      pageIndex = pageIndex % this.dots.length
    }
    this.slider.goToPage(pageIndex, 0, 0)
    this.loop && (pageIndex -= 1)
    this.currentPageIndex = pageIndex
    this.autoPlay && this._play()
  },
  deactivated() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let sliderWidth = this.$refs.slider.clientWidth
      let width = 0
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      if (this.showDots) {
        this.dots = new Array(this.children.length)
      }
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: this.click
      })
      this.slider.on('scrollEnd', this._handleScrollEnd)
      this.slider.on('beforeScrollStart', () => {
        this.autoPlay && clearTimeout(this.timer)
      })
      this.slider.on('touchEnd', () => {
        this.autoPlay && this._play()
      })
    },
    _handleScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.loop && (pageIndex -= 1)
      this.currentPageIndex = pageIndex
      this.autoPlay && this._play()
    },
    _play() {
      let nextPageIndex = this.currentPageIndex + 1
      this.loop && (nextPageIndex += 1)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.goToPage(nextPageIndex, 0, 400)
      }, this.interval)
    },
    _refresh() {
      this._handleScrollEnd(true)
      this.slider.refresh()
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable'

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
