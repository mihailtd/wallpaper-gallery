<template>
  <nav>
    <a href="#" class="button" @click="getRecentPictures"><icon name="refresh" scale="1"></icon> New Photos</a>
    <a href="#" class="button" @click="randomImage"><icon name="random" scale="1"></icon> Random</a>
    <a href="#" class="button" @click="showStarred"><icon name="star" scale="1"></icon> Starred</a>
    <a href="#" class="button" @click="showLocalItems"><icon name="floppy-o" scale="1"></icon> Local Photos</a>
    <a href="#" class="button"><icon name="cog" scale="1"></icon> Settings</a>
  </nav>
</template>

<script>
export default {
  name: 'navigation',
  components: {
    'icon': require('vue-awesome')
  },
  methods: {
    showStarred () {
      this.$emit('showStarred')
    },
    getRecentPictures () {
      this.$emit('getRecentPictures')
    },
    randomImage () {
      this.$emit('randomImage')
    },
    showLocalItems () {
      this.$emit('showLocalItems')
    }
  }
}
</script>

<style scoped>
nav {
  min-height: 8vh;
  background-color: #230C0F;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: center;
  position: relative;
  z-index: 99;
}

.button {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 150px;
  margin: 2vh 0 2vh 0;
  border: 0;
  text-decoration: none;
  background-color: #EAC435;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.button svg {
  margin-right: 5px;
}

.button:hover {
  cursor: pointer;
}

.button:active {
  border-style: outset;
}

.button:focus {
  outline: 0;
}

</style>
