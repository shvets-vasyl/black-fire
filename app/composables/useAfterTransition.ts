export function useAfterTransition(fn: () => void) {
  const preloaderDone = useState("preloader-done", () => false)
  const transitionDone = useState("transition-done", () => false)

  let started = false

  const run = async () => {
    if (started) return
    started = true

    await document.fonts.ready
    fn()
  }

  watch([preloaderDone, transitionDone], ([preloader, transition]) => {
    if (preloader || transition) void run()
  })

  onMounted(() => {
    if (preloaderDone.value || transitionDone.value) void run()
  })
}
