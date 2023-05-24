<template>
  <div id="mapContainer" :data-coords="center.lat+', '+center.lng" class="w-full md:w-[550px] h-[300px] md:h-[350px] mx-auto" ref="hereMap"></div>
</template>

<script>
export default {
  name: "HereMap",
  props: {
    center: Object
    // center object { lat: 40.730610, lng: -73.935242 }
  },
  data() {
    return {
      platform: null,
      apikey: "m0KGicCyWe_7s5QRIo8k9vuFOyHL67Az_WNV88ERya8",
      map: null,
      marker: null
      // You can get the API KEY from developer.here.com
    };
  },
  watch: {
    center(coords, oldCoords) {
      if (coords != oldCoords) {
        this.map.setCenter(coords)
        if (this.marker) {
          this.map.removeObject(this.marker)
        }
        this.marker = this.createIcon(coords)
        this.map.addObject(this.marker)
      }
    }
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.platform = platform;
    this.initializeHereMap();
  },
  methods: {
    initializeHereMap() { // rendering map

      // const mapContainer = this.$refs.hereMap;
      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      this.map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 8,
        center: this.center
        // center object { lat: 40.730610, lng: -73.935242 }
      });

      addEventListener("resize", () => this.map.getViewPort().resize());

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      // add UI
      H.ui.UI.createDefault(this.map, maptypes);
      // End rendering the initial map

      // this.marker = this.createIcon(this.center)
      // this.map.getEngine().addEventListener('render', event => {
      //   if (this.map.getEngine() == event.target && !this.map.getObjects().length) {
      //     this.map.addObject(this.marker);
      //   }
      // })
    },
    createIcon(coords) {
      const animatedSvg =`<div><div class="animate-ping map-marker h-5 w-5 rounded-full bg-red-700 opacity-75 static"></div></div>`;
      const icon = new H.map.DomIcon(animatedSvg)
      return new H.map.DomMarker(coords, {icon: icon});
    }
  }
};
</script>

<!-- <style scoped>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style> -->