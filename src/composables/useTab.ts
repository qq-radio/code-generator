import { STORAGE_KEY } from '@/constants/storage-key'

export function useTab() {
  const router = useRouter()

  const tabs = transformRoutesToTabs(router.options.routes)

  const activeTab = ref<string>(tabs[0].key)

  watch(
    () => activeTab.value,
    () => {
      router.push({ path: `/${activeTab.value}` })
    },
    { immediate: true }
  )

  watch(
    () => activeTab.value,
    (tab) => {
      window.localStorage.setItem(STORAGE_KEY.CURRENT_TAB, JSON.stringify(tab))
    }
  )

  onMounted(() => {
    const tab = window.localStorage.getItem(STORAGE_KEY.CURRENT_TAB)
    if (tab) {
      activeTab.value = JSON.parse(tab)
    }
  })

  return { tabs, activeTab }
}

function transformRoutesToTabs(routes) {
  const flattedRoutes = routes.flatMap((route) => route.children)

  const sortRoute = flattedRoutes.sort((a, b) => {
    return Number(a?.meta?.sort) - Number(b?.meta?.sort)
  })

  return sortRoute.map((route) => ({ key: route.name.split('/')[1] }))
}
