import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as mdiicon from '@mdi/font/css/materialdesignicons.css'

import *  as fsicom from '@fortawesome/fontawesome-free/css/all.css'


// Components
import App from './App.vue'

const vuetify = createVuetify({
    components,
    directives,
    mdiicon,
    fsicom
})

createApp(App).use(vuetify).mount('#app')
