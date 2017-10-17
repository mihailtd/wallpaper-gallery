<template>
  <div class="wrapper">
    <navigation @showLocalItems="showLocalItems"
      @getRecentPictures="getRecentPictures"
      @randomImage="randomImage"
      @showStarred="showStarred"></navigation>
    <div v-if="aciveTab==='gallery'" class="container">
      <div class="frame" @mouseover="hoveredImage=image.id" v-for="image in images" :key="image.id">
        <div class="thumbnails" :style="`background-image: url(${image.urls.small})`">
          <div class="actions" v-if="hoveredImage === image.id || isStarred(image)">
            <a href="#" v-if="!isStarred(image)" @click="starItem(image)"><icon class="star icon" name="star-o" scale="3"></icon></a>
            <a href="#" v-if="isStarred(image)" @click="unStarItem(image)"><icon class="star icon" name="star" scale="3"></icon></a>
            <a href="#" v-if="hoveredImage === image.id" @click="setAsWallpaper(image.urls.full, image.id)"><icon  class="icon" name="picture-o" scale="3"></icon></a>
            <a href="#" v-if="hoveredImage === image.id" @click="view(image)"><icon  class="icon" name="eye" scale="3"></icon></a>
          </div>
        </div>
        <div v-if="image.user" class="captions">Photo by <span class="link" @click="open(image.user.portfolio_url + utm)">{{image.user.name}}</span> / <span class="link" @click="open('https://unsplash.com/' + utm)">Unsplash</span></div>
        <div v-else class="captions">Photo from local hard drive</div>
      </div>
    </div>
    <div v-if="aciveTab==='view'" class="fullScreen" :style="`background-image: url(${selectedImage.urls.full})`">
      <a href="#" @click="aciveTab='gallery'"><icon  class="icon close" name="times-circle" scale="3"></icon></a>
      <a href="#" @click="setAsWallpaper(selectedImage.urls.full, selectedImage.id)"><icon  class="icon" name="picture-o" scale="3"></icon></a>
      <div v-if="selectedImage.user" class="captions">Photo by <span class="link" @click="open(selectedImage.user.portfolio_url + utm)">{{selectedImage.user.name}}</span> / <span class="link" @click="open('https://unsplash.com/' + utm)">Unsplash</span></div>
    </div>
    <div v-if="aciveTab==='error'" class="error">
      <h1>Too many API requests this hour</h1>
    </div>
  </div>
</template>

<script>
  import download from 'download-file'
  import path from 'path'
  import axios from 'axios'
  import fs from 'fs'
  import navigation from './Navigation.vue'
  import wallpaper from 'wallpaper'

  const appDirectory = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

  const instance = axios.create({
    baseURL: 'https://api.unsplash.com/',
    timeout: 5000,
    headers: {'Authorization': 'Client-ID aebba256834d50dd4bac387c4d086491f901fd703b740762e6dfd97da7cb9a47'}
  })

  export default {
    name: 'landing-page',
    components: {
      'navigation': navigation,
      'icon': require('vue-awesome')
    },
    data () {
      return {
        utm: '?utm_source=Wallpaper Gallery&utm_medium=referral&utm_campaign=api-credit',
        images: [],
        errors: [],
        starredItems: [],
        currentWallpaper: '',
        hoveredImage: '',
        selectedImage: '',
        aciveTab: 'gallery'
      }
    },
    async created () {
      await this.getRecentPictures()
    },
    methods: {
      view (image) {
        this.aciveTab = 'view'
        this.selectedImage = image
      },
      async randomImage () {
        this.aciveTab = 'view'
        try {
          const response = await instance.get(`/photos/random`)
          this.selectedImage = response.data
        } catch (e) {
          console.log(e)
          this.aciveTab = 'error'
          this.errors.push(e)
        }
      },
      async getRecentPictures () {
        this.aciveTab = 'gallery'
        try {
          const response = await instance.get(`/photos`)
          this.images = response.data
        } catch (e) {
          console.log(e)
          this.aciveTab = 'error'
          this.errors.push(e)
        }
      },
      showLocalItems () {
        fs.readdir(path.join(appDirectory, '/data'), 'utf8', (err, files) => {
          if (err) return console.log(err)
          this.images = files.map(file => {
            return {
              id: file,
              urls: {
                small: path.join(appDirectory, 'data', file).replace(/\\/g, '\\\\'),
                full: path.join(appDirectory, 'data', file).replace(/\\/g, '\\\\')
              }
            }
          })
          this.aciveTab = 'gallery'
        })
      },
      showStarred () {
        this.view = 'gallery'
        this.images = this.starredItems
      },
      starItem (item) {
        if (this.isStarred(item)) return
        this.starredItems.push(item)
      },
      unStarItem (item) {
        if (!this.isStarred(item)) return
        this.starredItems.splice(this.starredItems.map((img) => { return img.id }).indexOf(item.id), 1)
      },
      isStarred (item) {
        let foundItem = this.starredItems.find((image) => { return image.id === item.id })
        if (!foundItem) return false
        return true
      },
      async setAsWallpaper (url, fileName) {
        const directory = path.join(appDirectory, 'data')
        let options = {
          directory: directory,
          filename: fileName + '.jpg'
        }
        download(url, options, function (err) {
          if (err) return console.log(err)
          wallpaper.set(path.join(options.directory, options.filename))
        })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Indie+Flower');
  @media screen and (max-width: 600px) {
    .frame {
      width: 100%;
      background-color: blue;
    }
    .thumbnails {
      width: 100%;
    }
  }

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: space-around;
    margin-top: 1vh;
    width: 100%;
    height: 100%;
  }

  .frame {
    background-color: white;
    max-width: 25%;
    min-width: 330px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-top: 15px;
    margin-top: 15px;
  }

  .thumbnails {
    max-width: 25%;
    min-width: 300px;
    height: 240px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    box-shadow: 6px 9px 10px -1px rgba(0,0,0,0.76);
  }

  .captions {
    font-family: 'Indie Flower', cursive;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .link {
    color: blue;
    cursor: pointer;
  }

  .fullScreen {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    display: flex;
  }

  .fullscreen a {
    margin-left: 4px;
  }

  .fullScreen .captions {
    background-color: rgba(124, 124, 124, 0.6);
    color: white;
    align-self: flex-end;
    mix-blend-mode: difference;
    margin-left: auto;
  }

  .fullScreen .captions:hover {
    background-color: rgba(124, 124, 124, 1);
  }

  .icon {
    text-decoration: none;
    color: white;
    mix-blend-mode: difference;
    opacity: 0.6;
  }

  .icon:hover {
    cursor: pointer;
    opacity: 1;
  }

  .error {
    color: white;
    text-align: center;
  }
</style>
