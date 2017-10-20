<template>
  <div ref='wrapper'>
    <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'

export default {
  props: {
    /**
         * 1 滚动的时候会派发scroll事件，会截流。
         * 2 滚动的时候实时派发scroll事件，不会截流。
         * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
         */
    probeType: {
      type: Number,
      default: 1
    },
    /**
         * 点击列表是否派发click事件
         */
    click: {
      type: Boolean,
      default: false
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullDown: {
      type: Boolean,
      default: false
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, this.refreshDelay)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY
      })

      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pullDown) {
        this.scroll.on('touchEnd', pos => {
          if (pos.y > 50) {
            this.$emit('pullDown')
          }
        })
      }
      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
