const VUEPLAYERCORE = (() => {
  const mstreamModule = {};
  mstreamModule.playlists = [];
  const replayGainPreGainSettings = [
    -15.0, -10.0, -6.0, 0.0
  ];

  let replayGainInfoTimeout;
  new Vue({
    el: '#mstream-player',
    data: {
      playerStats: MSTREAMPLAYER.playerStats,
      playlist: MSTREAMPLAYER.playlist,
      positionCache: MSTREAMPLAYER.positionCache,
      meta: MSTREAMPLAYER.playerStats.metadata,
      curVol: 100, // Manage our own volume
      lastVol: 100,
    },
    computed: {
      albumArtPath: function () {
        if (!this.meta['album-art']) {
          return '/public/img/default.png';
        }
        return `/album-art/${this.meta['album-art']}?token=${MSTREAMPLAYER.getCurrentSong().authToken}`;
      }
    },
    methods: {
      playPause: function() {
        MSTREAMPLAYER.playPause();
      },
      previousSong: function() {
        MSTREAMPLAYER.previousSong();
      },
      nextSong: function() {
        MSTREAMPLAYER.nextSong();
      },
      toggleRepeat: function () {
        MSTREAMPLAYER.toggleRepeat();
      },
      toggleShuffle: function () {
        MSTREAMPLAYER.toggleShuffle();
      },
      toggleAutoDJ: function () {
        MSTREAMPLAYER.toggleAutoDJ();
      },
      toggleVolume: function () {
        if (this.playerStats.volume === 0) {
          MSTREAMPLAYER.changeVolume(this.lastVol);
          this.curVol = this.lastVol;
        } else {
          this.lastVol = this.curVol;
          MSTREAMPLAYER.changeVolume(0);
          this.curVol = 0;
        }
      }
    }
  });

  Vue.component('playlist-item', {
    // We need the positionCache to track the currently playing song
    data: function () {
      return {
        positionCache: MSTREAMPLAYER.positionCache,
      }
    },
    template: `
      <li v-on:click="goToSong($event)"  class="pointer collection-item" v-bind:class="{ playing: (this.index === positionCache.val), playError: (this.songError && this.songError === true) }" >
        {{ comtext }}
          <a v-on:click="downloadSong($event)" class="secondary-content">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>
          </a>
      </li>`,
    props: ['index', 'song'],
    methods: {
      goToSong: function (event) {
        MSTREAMPLAYER.goToSongAtPosition(this.index);
      },
      // removeSong: function (event) {
      //   MSTREAMPLAYER.removeSongAtPosition(this.index, false);
      // },
      downloadSong: function (event) {
        // $("#download-file").attr("href", "/media/" + this.song.filepath + "?token=" + MSTREAMAPI.currentServer.token);
        // document.getElementById('download-file').click();
      }
    },
    computed: {
      comtext: function () {
        var returnThis = this.song.filepath;

        if (this.song.metadata.title) {
          returnThis = this.song.metadata.title;
          if (this.song.metadata.artist) {
            returnThis = this.song.metadata.artist + ' - ' + returnThis;
          }
        }

        return returnThis;
      },
      songError: function () {
        return this.song.error;
      }
    }
  });

  // seek on progress bar click
  // document.getElementById("progress-bar").addEventListener("click", function (event) {
  //   var relativeClickPosition = event.clientX - this.getBoundingClientRect().left;
  //   var totalWidth = this.getBoundingClientRect().width;
  //   var percentage = (relativeClickPosition / totalWidth) * 100;
  //   // Set Player time
  //   MSTREAMPLAYER.seekByPercentage(percentage);
  // });

  // Change spacebar behavior to Play/Pause
  window.addEventListener("keydown", (event) => {
    // Use default behavior if user is in a form
    const element = event.target.tagName.toLowerCase();
    if (element === 'input' || element === 'textarea') {
      return;
    }

    // Check the key
    switch (event.key) {
      case " ": //SpaceBar
        event.preventDefault();
        MSTREAMPLAYER.playPause();
        break;
    }
  }, false);

  return mstreamModule;
})()