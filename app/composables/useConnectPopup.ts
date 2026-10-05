export function useConnectPopup() {
  const route = useRoute()
  const router = useRouter()
  const isOpen = useState("connect-popup-open", () => false)

  const open = () => {
    isOpen.value = true
    if (!import.meta.client) return

    useLockScroll(true)
    if (route.query.form !== undefined) return

    router.push({
      path: route.path,
      query: { ...route.query, form: null },
      hash: route.hash,
    })
  }

  const close = () => {
    isOpen.value = false
    if (!import.meta.client) return

    useLockScroll(false)
    if (route.query.form === undefined) return

    const query = { ...route.query }
    delete query.form
    router.replace({ path: route.path, query, hash: route.hash })
  }

  return { isOpen, open, close }
}
