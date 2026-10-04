export function useAfterTransition(fn: () => void) {
  const preloaderDone = useState("preloader-done")
  const transitionDone = useState("transition-done")

  const run = async () => {
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
