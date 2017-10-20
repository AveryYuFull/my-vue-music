<template>
  <div id='app'>
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- <player></player> -->
  </div>
</template>

<script type='text/ecmascript-6'>
  import MyHeader from 'components/my-header/MyHeader'
  import Tab from 'components/tab/Tab'
  // import Player from 'components/player/player'

  export default {
    components: {
      MyHeader,
      Tab
      // Player
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import 'common/stylus/variable'

  #app
    color: $color-theme
</style>
