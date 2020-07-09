<template>
    <div id='map'></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
// console.dir(mapboxgl)

export default {
  name: 'map',
  components: { },
  data () {
    return {
      accessToken: 'pk.eyJ1IjoicGF0Y29kZTkiLCJhIjoiY2s3ZHpveHUxMDNkeDNmbnQwdTI2endtayJ9.i1H09eCL94SDtw4BBeOtpw',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      targetLong: null,
      targetLat: null
    }
  },
  mounted () {
    this.init()
      .then(this.createMap())
      .then(this.getLocation())
  },
  methods: {
    init () {
      return new Promise((resolve, reject) => {
        const start = true
        if (start) {
          resolve()
        } else {
          reject()
        }
      })
    },
    createMap () {
      mapboxgl.accessToken = this.accessToken

      // init the map
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.mapStyle,
        minzoom: 1.3,
        center: [125.6134, 7.0846],
        /* center: [-96, 37.8], */
        zoom: 12,
        attributionControl: false
      })

      /* const geocoder = new MapboxGeocoder({
        accessToken: this.accessToken,
        marker: {
          color: 'red'
        },
        mapboxgl: mapboxgl
      }) */

      /* this.map.addControl(
        new MapboxGeocoder({
          accessToken: this.accessToken,
          localGeocoder: [125.4553, 7.1907],
          zoom: 4,
          placeholder: [125.4553, 7.1907],
          mapboxgl: mapboxgl
        })
      ) */

      // make a marker for each feature and add to the map
      this.map.addControl(new mapboxgl.Navigation())
      /* this.map.addControl(geocoder) */
      /* document.getElementById('map').appendChild(geocoder.onAdd('geocoder')) */
    },
    getLocation () {
      /* this.$axios.get() */
      /* let geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
          },
          properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.414, 37.776]
          },
          properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
          }
        }]
      } */

      /* geojson.features.forEach(function (marker) {
        // create a HTML element for each feature
        const el = document.createElement('div')
        el.className = 'marker'

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map)
      }) */
    }
  }
}
</script>

<style scoped lang="stylus">
  #map
    width: 100%
    height: 88vh
    outline: #ffbe00 solid 2px

  /*.marker {
    background-image: url('../davaologo.png');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }*/
</style>
