<template>
  <div ref='wrapper' class='list-wrapper'>
    <div class='slot-content'>
      <slot>
        <ul ref='list' class='list-content'>
          <li @click='clickItem($event, item)' v-for='(item, index) in data' class='list-item' :key='index'>
            {{ item }}
          </li>
        </ul>
      </slot>
      <slot name='pullup' :pullUpLoad='pullUpLoad' 
        :isPullUpLoad='isPullUpLoad'>
        <div class='pullup-wrapper' v-if='pullUpLoad'>
          <div class='before-trigger' v-if='!isPullUpLoad'>
            <span v-text='pullUpTxt'></span>
          </div>
          <div class='after-trigger' v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name='pulldown' 
        :pullDownRefresh='pullDownRefresh'
        :beforePullDown='beforePullDown'
        :pulling='pulling'
        :pullDownStyle='pullDownStyle'>
      <div class='pulldown-wrapper' ref='pulldown' :style='pullDownStyle' v-if='pullDownRefresh'>
        <div class='before-trigger' v-if='beforePullDown'>
          <img :src='pullDownIcon' />
        </div>
        <div class='after-trigger' v-else>
          <div v-if='pulling'>
            <loading></loading>
          </div>
          <div v-else>
            <span v-text='refreshTxt'></span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type='text/ecmascript-6'>
import loading from '../loading/loading'
import BScroll from 'better-scroll'
import pullDownIcon from '../../common/image/pullDown.png'
import pullUpIcon from '../../common/image/pullUp.png'

const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: false
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollbar: {
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      beforePullDown: true,
      pulling: false,
      isPullUpload: false,
      pullUpDirty: true,
      pullDownStyle: '',
      pullDownIcon: pullDownIcon,
      pullUpIcon: pullUpIcon
    }
  },
  computed: {
    pullUpTxt () {
      const moreTxt =
        (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) ||
        'Have load some txt'
      const noMoreTxt =
        (this.pullUpLoad &&
          this.pullUpLoad.txt &&
          this.pullUpLoad.txt.noMore) ||
        'No more txt to load'
      return this.pullUpDirty ? moreTxt : noMoreTxt
    },
    refreshTxt () {
      return (
        (this.pullDownRefresh && this.pullDownRefresh.txt) ||
        'Have refresh some new txt'
      )
    }
  },
  created () {
    this.pullDownInitTop = -50
  },
  mounted () {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  methods: {
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      const options = {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.direction === DIRECTION_H,
        scrollY: this.direction === DIRECTION_V,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
      if (this.listenBeforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScrollStart')
        })
      }
      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.handlePullDown()
        })
      }
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.handlePullUp()
        })
      }
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scrollToElement.apply(this.scroll, arguments)
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    finishPullDown () {
      this.scroll && this.scroll.finishPullDown()
    },
    destroy () {
      this.scroll && this.scroll.destroy()
    },
    handlePullDown () {
      this.beforePullDown = false
      this.pulling = true
      this.$emit('pullingDown')
    },
    handlePullUp () {
      this.isPullUpLoad = true
      this.$emit('pullingUp')
    },
    handleRebound () {
      const { stopTime = 600 } = this.pullingDownRefresh
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    afterRebound () {
      setTimeout(() => {
        this.pullDownStyle = `top: ${this.pullDownInitTop}`
        this.beforePullDown = true
        this.refresh()
      }, this.scroll.options.bounceTime)
    },
    forceUpdate (dirty) {
      if (this.pullDownRefresh && this.pulling) {
        this.pulling = false
        this.handleRebound().then(() => {
          this.afterRebound()
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.pullUpDirty = dirty
        this.isPullUpLoad = false
        this.refresh()
      } else {
        this.refresh()
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    }
  },
  components: {
    loading
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .list-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .list-content
      position: relative
      z-index: 10
      background: #fff
    .list-item
      height: 60px
      line-height: 60px
      font-size: 18px
      padding-left: 20px
      border-bottom: 1px solid #e5e5e5
    .pulldown-wrapper
      position: absolute
      width: 100%
      left: 0
      display: flex
      justify-content center
      align-items center
      transition: all
      .after-trigger
        margin-top: 10px
    .pullup-wrapper
      width: 100%
      display: flex
      justify-content: center
      align-items: center
      padding: 16px 0
</style>
