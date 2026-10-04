export function useViewport() {
  const viewports = {
    mobile: 416,
    desktop: 1024,
  } as const

  const { isMobile: isMobileDevice } = useDevice()

  const isDesktop = ref(!isMobileDevice)
  const isMobile = ref(!!isMobileDevice)

  function setViewport() {
    isDesktop.value = window.innerWidth >= viewports.desktop
    isMobile.value = window.innerWidth < viewports.desktop
  }

  onMounted(() => {
    setViewport()

    window.addEventListener("resize", setViewport)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", setViewport)
  })

  return {
    isDesktop,
    isMobile,
  }
}
