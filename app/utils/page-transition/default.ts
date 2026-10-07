import type { TransitionProps } from "vue"
import type { RouteLocationNormalized } from "#vue-router"
import type Lenis from "lenis"
import gsap from "gsap"

export default function defaultTransition(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const transitionDone = useState("transition-done")
  const preloaderDone = useState("preloader-done")
  const duration = 1

  to.meta.pageTransition = { ...(to.meta.pageTransition as TransitionProps) }
  from.meta.pageTransition = {
    ...(from.meta.pageTransition as TransitionProps),
  }

  to.meta.pageTransition.mode = "in-out"
  from.meta.pageTransition.mode = "in-out"

  if (to.path === "/" && to.hash) to.meta.scrollToTop = false

  let entered = false
  let left = false

  const settle = () => {
    if (!entered || !left) return
    const popupOpen =
      useState<boolean>("connect-popup-open").value ||
      useState<boolean>("project-popup-open").value
    if (!popupOpen) useLockScroll(false)
    transitionDone.value = true
  }

  const onLeave = (_el: Element, done: () => void) => {
    useLockScroll(true)
    transitionDone.value = false
    preloaderDone.value = true

    const lenis = useState<Lenis | null>("lenis")

    const tl = gsap.timeline({
      onComplete() {
        ScrollTrigger.getAll().filter((st) => {
          if (st.trigger && st.trigger.closest(".page-leave-to")) {
            st.kill()
          }
        })
        if (!(to.path === "/" && to.hash)) {
          lenis.value?.scrollTo(0, { immediate: true, force: true })
        }
        left = true
        done()
        settle()
      },
    })

    tl.to(_el, {
      xPercent: -50,
      opacity: 0.1,
      ease: "power3.inOut",
      duration,
    })
  }

  const onEnter = async (_el: Element, done: () => void) => {
    const timeline = gsap.timeline()

    gsap.set(_el, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
    })

    await timeline.from(_el, {
      xPercent: 105,
      duration,
      ease: "power2.inOut",
    })

    setTimeout(() => {
      gsap.set(_el, {
        clearProps: "position,top,left,width,xPercent",
      })

      entered = true
      done()
      settle()
    }, 200)
  }

  if (from.meta.pageTransition)
    (from.meta.pageTransition as TransitionProps).onLeave = onLeave
  if (to.meta.pageTransition)
    (to.meta.pageTransition as TransitionProps).onEnter = onEnter
}
