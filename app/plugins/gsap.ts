import { gsap } from "gsap"
import {
  ScrollTrigger,
  ScrollToPlugin,
  CustomEase,
  SplitText,
  Draggable,
  InertiaPlugin,
} from "gsap/all"

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    CustomEase,
    SplitText,
    Draggable,
    InertiaPlugin
  )

  // when animating an object on the screen, it doesn't appear and disappear, just changes shape
  CustomEase.create("custom.inOut", "0.76,0,0.24,1")
  // when animating the appearance of objects
  CustomEase.create("custom.out", "0.25,1,0.5,1")
  // when animating the disappearance of objects
  CustomEase.create("custom.in", "0.5,0,0.75,0")
  CustomEase.create("custom.ease", "0.25,0.1,0.25,1")
  // when animating the disappearance of text
  CustomEase.create("custom.write", "0.333,0,0.667,1")
  CustomEase.create("custom.diveIn", "0.6, 0, 0, 1")

  CustomEase.create("custom.easeOutQuint", "0.22, 1, 0.36, 1")
  CustomEase.create(
    "custom.preloader",
    "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1"
  )
})
