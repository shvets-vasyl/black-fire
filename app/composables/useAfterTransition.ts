export function useAfterTransition(fn: () => void) {
  const preloaderDone = useState("preloader-done", () => false)
  const transitionDone = useState("transition-done", () => true)

  let started = false

  const run = async () => {
    if (started) return
    started = true

    await document.fonts.ready
    fn()
  }

  watch(transitionDone, (ready) => {
    if (ready) void run()
  })

  watch(preloaderDone, (ready) => {
    if (ready) void run()
  })
}
