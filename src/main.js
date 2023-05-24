import { createApp } from 'vue'
import './index.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCrosshairs, faClock, faRuler, faHouseTsunami, faMountainSun, faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faCrosshairs, faClock, faRuler, faHouseTsunami, faMountainSun, faCalendar, faSpinner)

createApp(App).component('fa-icon', FontAwesomeIcon).mount('#app')
