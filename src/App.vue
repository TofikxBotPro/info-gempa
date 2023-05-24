<script setup>
  import HereMap from './components/HereMap.vue'
  import { onMounted, ref, watch } from 'vue'
  const maps = ref({})
  const gempaTerbaru = ref(null)
  const dataGempa = ref({
    terkini: null,
    dirasakan: null,
  })
  const isFeltTab = ref(false)
  const loading = ref(false)
  onMounted(async () => {
    gempaTerbaru.value = (await (await fetch('https://bmkg-gempa-api.vercel.app/gempa')).json())
    dataGempa.value.terkini = (await (await fetch('https://bmkg-gempa-api.vercel.app/terkini')).json())
  })
  watch(isFeltTab, async isFelt => {
    if (isFelt) {
      if (!dataGempa.value.dirasakan) {
        loading.value = true
        dataGempa.value.dirasakan = (await (await fetch('https://bmkg-gempa-api.vercel.app/dirasakan')).json())
        loading.value = false
      }
    } else {
      if (!dataGempa.value.terkini) {
        loading.value = true
        dataGempa.value.terkini = (await (await fetch('https://bmkg-gempa-api.vercel.app/terkini')).json())
        loading.value = false
      }
    }
  })
  function toTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
</script>

<template>
  <HereMap :center="{lat: gempaTerbaru.Lat, lng: gempaTerbaru.Lng}" v-if="gempaTerbaru" />
  <div class="w-full md:w-[550px] mx-auto md:shadow" v-if="gempaTerbaru">
    <div class="py-6 px-5 md:px-4">
      <div class="flex flex-wrap justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Gempa Bumi</h1>
          <p class="text-gray-700 mt-1">{{ gempaTerbaru.Wilayah }}</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold md:text-right">{{ gempaTerbaru.Magnitude }}</h2>
          <p class="text-gray-700 md:text-right mt-1">Skala Richter</p>
        </div>
      </div>
      <div class="py-4 flex gap-2 flex-wrap">
        <div class="basis-3/5">
          <div>
            <div class="flex items-center gap-2">
              <fa-icon icon="fa-solid fa-crosshairs"/> Koordinat
            </div>
            <p class="mt-1 text-gray-600">{{ gempaTerbaru.Lintang }}, {{ gempaTerbaru.Bujur }}</p>
          </div>
          <div class="mt-2">
            <div class="flex items-center gap-2">
              <fa-icon icon="fa-solid fa-clock"/> Waktu
            </div>
            <p class="mt-1 text-gray-600">{{ gempaTerbaru.Tanggal }}, {{ gempaTerbaru.Jam }}</p>
          </div>
        </div>
        <div>
          <div>
            <div class="flex items-center gap-2">
              <fa-icon icon="fa-solid fa-ruler"/> Kedalaman
            </div>
            <p class="mt-1 text-gray-600">{{ gempaTerbaru.Kedalaman }}</p>
          </div>
          <div class="mt-2">
            <div class="flex items-center gap-2">
              <fa-icon icon="fa-solid fa-house-tsunami"/> Tsunami
            </div>
            <p class="mt-1 text-gray-600">{{ gempaTerbaru.Potensi?.toLowerCase() == 'berpotensi tsunami' ? 'Berpotensi Tsunami' : 'Tidak Berpotensi' }}</p>
          </div>
        </div>
        <div class="mt-2">
          <div class="flex items-center gap-2">
            <fa-icon icon="fa-solid fa-mountain-sun"/> Wilayah yang dirasakan
          </div>
          <p class="mt-1 text-gray-600">{{ gempaTerbaru.Dirasakan || '-' }}</p>
        </div>
      </div>
      <p class="mt-1 text-gray-600">Sumber Data: BMKG</p>
    </div>
    <hr>
    <div>
      <div class="tab-menu flex w-full">
        <div class="w-1/2 flex-shrink p-3 text-center cursor-pointer hover:bg-gray-100" :class="{'border-b-2 border-b-sky-500 bg-gray-100': !isFeltTab, 'border-b border-b-gray-200': isFeltTab}" @click="isFeltTab = false">Magnitudo 5.0+</div>
        <div class="w-1/2 flex-shrink p-3 text-center cursor-pointer hover:bg-gray-100" :class="{'border-b-2 border-b-sky-500 bg-gray-100': isFeltTab, 'border-b border-b-gray-200': !isFeltTab}" @click="isFeltTab = true">Dirasakan</div>
      </div>
      <ul class="terkini" v-if="!isFeltTab">
        <li class="p-4 border-b border-b-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-100" :class="{'bg-gray-100 border-l-2 border-l-sky-600': gempa.DateTime == gempaTerbaru.DateTime && gempa.Coordinates == gempaTerbaru.Coordinates}" v-for="gempa in dataGempa.terkini" @click="gempaTerbaru = gempa; toTop()">
          <div class="flex flex-wrap md:flex-nowrap gap-2 sm:gap-5">
            <div class="flex-grow">
              <h3 class="text-xl font-semibold">{{ gempa.Magnitude }} Skala Richter</h3>
              <p class="text-gray-700 text-sm">{{ gempa.Wilayah }}</p>
            </div>
            <div class="w-44">
              <p class="text-gray-700 md:text-right"><fa-icon icon="fa-solid fa-calendar" class="mr-1" /> {{ gempa.Tanggal }} <span><fa-icon icon="fa-solid fa-clock" class="mr-1" /> {{ gempa.Jam }}</span></p>
            </div>
          </div>
          <span class="inline-block px-2 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded mt-2 md:mt-1">{{ gempa.Potensi }}</span>
        </li>
      </ul>
      <ul class="dirasakan" v-if="isFeltTab">
        <li class="p-4 border-b border-b-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-100" :class="{'bg-gray-100 border-l-2 border-l-sky-600': gempa.DateTime == gempaTerbaru.DateTime && gempa.Coordinates == gempaTerbaru.Coordinates}" v-for="gempa in dataGempa.dirasakan" @click="gempaTerbaru = gempa; toTop()">
          <div class="flex flex-wrap md:flex-nowrap gap-2 sm:gap-5">
            <div class="flex-grow">
              <h3 class="text-xl font-semibold">{{ gempa.Magnitude }} Skala Richter</h3>
              <p class="text-gray-700 text-sm">{{ gempa.Wilayah }}</p>
            </div>
            <div class="w-44">
              <p class="text-gray-700 md:text-right"><fa-icon icon="fa-solid fa-calendar" class="mr-1" /> {{ gempa.Tanggal }} <span><fa-icon icon="fa-solid fa-clock" class="mr-1" /> {{ gempa.Jam }}</span></p>
            </div>
          </div>
          <span v-if="gempa.Potensi" class="inline-block px-2 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded mt-2 md:mt-1">{{ gempa.Potensi }}</span>
        </li>
      </ul>
      <div class="loading text-center py-12" v-if="loading">
        <fa-icon icon="fa-solid fa-spinner" size="3x" class="animate-spin text-center mx-auto" />
      </div>
    </div>
    <footer class="px-6 py-5 bg-gray-50">Sumber Data: <a href="https://github.com/madeaditya02/bmkg-gempa-api" class="text-sky-500 hover:underline">API</a> melalui data <a href="https://data.bmkg.go.id/gempabumi" class="text-sky-500 hover:underline">BMKG</a></footer>
  </div>
</template>