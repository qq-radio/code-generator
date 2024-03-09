import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`
  })
)

export default store
