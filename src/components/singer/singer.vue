<template>
  <div>
    <my-scroll></my-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  import myScroll from 'base/scroll/myScroll'

  export default {
    data () {
      return {
        data: [
          1, 2, 3, 4, 5, 6, 7, 8
        ]
      }
    },
    components: {
      myScroll
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>
