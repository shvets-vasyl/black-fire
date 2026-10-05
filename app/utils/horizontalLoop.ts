import { gsap, Draggable, InertiaPlugin } from "gsap/all"

export interface HorizontalLoopConfig {
  speed?: number
  paused?: boolean
  repeat?: number
  reversed?: boolean
  paddingRight?: number | string
  snap?: number | false
  center?: boolean | gsap.DOMTarget
  draggable?: boolean
  allowNativeTouchScrolling?: boolean
  onChange?: (element: HTMLElement, index: number) => void
}

export interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  current: () => number
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  closestIndex: (setCurrent?: boolean) => number
  times: number[]
  draggable?: Draggable
  revertLoop: () => void
}

export function horizontalLoop(
  itemsInput: gsap.DOMTarget,
  config: HorizontalLoopConfig = {}
): HorizontalLoopTimeline {
  const items = gsap.utils.toArray<HTMLElement>(itemsInput)

  if (items.length === 0) {
    throw new Error("horizontalLoop: items array is empty")
  }

  const firstItem = items[0]!
  const lastItem = items[items.length - 1]!

  let timeline!: HorizontalLoopTimeline

  const ctx = gsap.context(() => {
    const onChange = config.onChange
    let lastIndex = 0

    const tl = gsap.timeline({
      repeat: config.repeat,
      onUpdate: onChange
        ? () => {
            const i = timeline.closestIndex()
            const el = items[i]
            if (lastIndex !== i && el) {
              lastIndex = i
              onChange(el, i)
            }
          }
        : undefined,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => {
        tl.totalTime(tl.rawTime() + tl.duration() * 100)
      },
    }) as HorizontalLoopTimeline

    timeline = tl

    const length = items.length
    const startX = firstItem.offsetLeft
    const times: number[] = new Array(length).fill(0)
    const widths: number[] = new Array(length).fill(0)
    const spaceBefore: number[] = new Array(length).fill(0)
    const xPercents: number[] = new Array(length).fill(0)
    let curIndex = 0
    let indexIsDirty = false
    const center = config.center
    const pixelsPerSecond = (config.speed || 1) * 100
    const snap =
      config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1)
    let timeOffset = 0

    const container: HTMLElement =
      center === true
        ? (firstItem.parentNode as HTMLElement)
        : center
          ? ((gsap.utils.toArray(center)[0] as HTMLElement | undefined) ??
            (firstItem.parentNode as HTMLElement))
          : (firstItem.parentNode as HTMLElement)

    let totalWidth = 0
    let timeWrap: (value: number) => number = gsap.utils.wrap(0, 1)
    let proxy: HTMLDivElement | undefined
    let stopAutoplay: (() => void) | undefined

    const getTotalWidth = () =>
      lastItem.offsetLeft +
      (xPercents[length - 1]! / 100) * widths[length - 1]! -
      startX +
      spaceBefore[0]! +
      lastItem.offsetWidth * Number(gsap.getProperty(lastItem, "scaleX")) +
      (parseFloat(String(config.paddingRight ?? 0)) || 0)

    const populateWidths = () => {
      let b1 = container.getBoundingClientRect()

      items.forEach((el, i) => {
        widths[i] = parseFloat(String(gsap.getProperty(el, "width", "px")))
        xPercents[i] = snap(
          (parseFloat(String(gsap.getProperty(el, "x", "px"))) / widths[i]!) * 100 +
            Number(gsap.getProperty(el, "xPercent"))
        )
        const b2 = el.getBoundingClientRect()
        spaceBefore[i] = b2.left - (i ? b1.right : b1.left)
        b1 = b2
      })

      gsap.set(items, {
        xPercent: (i: number) => xPercents[i] ?? 0,
      })
      totalWidth = getTotalWidth()
    }

    const populateOffsets = () => {
      timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0

      if (center) {
        for (let i = 0; i < length; i++) {
          const labelTime = tl.labels["label" + i] ?? 0
          times[i] = timeWrap(
            labelTime + (tl.duration() * widths[i]!) / 2 / totalWidth - timeOffset
          )
        }
      }
    }

    const getClosest = (values: number[], value: number, wrap: number) => {
      let i = values.length
      let closest = 1e10
      let index = 0

      while (i--) {
        const current = values[i]
        if (current === undefined) continue

        let d = Math.abs(current - value)
        if (d > wrap / 2) d = wrap - d
        if (d < closest) {
          closest = d
          index = i
        }
      }

      return index
    }

    const populateTimeline = () => {
      tl.clear()

      for (let i = 0; i < length; i++) {
        const item = items[i]!
        const width = widths[i]!
        const xPercent = xPercents[i]!
        const curX = (xPercent / 100) * width
        const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0]!
        const distanceToLoop =
          distanceToStart + width * Number(gsap.getProperty(item, "scaleX"))

        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / width) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(((curX - distanceToLoop + totalWidth) / width) * 100),
            },
            {
              xPercent,
              duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false,
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond)

        times[i] = distanceToStart / pixelsPerSecond
      }

      timeWrap = gsap.utils.wrap(0, tl.duration())
    }

    const refresh = (deep?: boolean) => {
      const progressValue = tl.progress()
      tl.progress(0, true)
      populateWidths()
      if (deep) populateTimeline()
      populateOffsets()

      if (deep && tl.draggable && tl.paused()) {
        tl.time(times[curIndex] ?? 0, true)
      } else {
        tl.progress(progressValue, true)
      }
    }

    const onResize = () => refresh(!(tl.draggable && tl.draggable.isDragging))

    gsap.set(items, { x: 0 })
    populateWidths()
    populateTimeline()
    populateOffsets()
    window.addEventListener("resize", onResize)

    const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
      if (Math.abs(index - curIndex) > length / 2) {
        index += index > curIndex ? -length : length
      }

      const newIndex = gsap.utils.wrap(0, length, index)
      let time = times[newIndex] ?? 0

      if (time > tl.time() !== index > curIndex && index !== curIndex) {
        time += tl.duration() * (index > curIndex ? 1 : -1)
      }

      if (time < 0 || time > tl.duration()) {
        vars.modifiers = { time: timeWrap }
      }

      curIndex = newIndex
      vars.overwrite = true

      if (proxy) {
        gsap.killTweensOf(proxy)
      }

      return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars)
    }

    tl.toIndex = (index, vars) => toIndex(index, vars)
    tl.closestIndex = (setCurrent) => {
      const index = getClosest(times, tl.time(), tl.duration())
      if (setCurrent) {
        curIndex = index
        indexIsDirty = false
      }
      return index
    }
    tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex)
    tl.next = (vars) => toIndex(tl.current() + 1, vars)
    tl.previous = (vars) => toIndex(tl.current() - 1, vars)
    tl.times = times
    tl.progress(1, true).progress(0, true)

    if (config.reversed) {
      tl.vars.onReverseComplete?.()
      tl.reverse()
    }

    if (config.draggable && typeof Draggable === "function") {
      proxy = document.createElement("div")
      const wrap = gsap.utils.wrap(0, 1)
      let ratio = 0
      let startProgress = 0
      let playForward = !config.reversed
      let autoplay = !config.paused
      let gesture = false
      let pressPointerX = 0
      let gestureFrame = 0
      let lastTick = gsap.ticker.time
      let coasting = false
      let coastIdle = 0
      let coastProgress = 0

      const pauseTimeline = tl.pause.bind(tl)

      const setDirection = (delta: number) => {
        if (Math.abs(delta) < 6) return
        playForward = delta > 0
      }

      const stepAutoplay = () => {
        const now = gsap.ticker.time
        const delta = now - lastTick
        lastTick = now

        if (
          gesture &&
          !coasting &&
          tl.draggable &&
          !tl.draggable.isPressed &&
          gsap.ticker.frame > gestureFrame
        ) {
          gesture = false
        }

        if (coasting) {
          const progress = tl.progress()
          if (Math.abs(progress - coastProgress) > 0.0003) {
            coastProgress = progress
            coastIdle = 0
          } else if (++coastIdle > 8) {
            finishCoast()
          }
          return
        }

        if (delta <= 0 || !autoplay || gesture) return

        const duration = tl.duration()
        if (!duration) return

        const step = Math.min(delta, 0.05)
        const next = tl.time() + step * (playForward ? 1 : -1)
        tl.time(((next % duration) + duration) % duration)
      }

      const keepAlive = gsap.to({}, { duration: 1, repeat: -1, ease: "none" })

      const trigger = firstItem.parentNode as HTMLElement
      let pressClientX = 0
      let pressClientY = 0
      let touchAxis: "x" | "y" | null = null

      const setPanY = (el: Element) => {
        if (el instanceof HTMLElement) el.style.touchAction = "pan-y"
        for (const child of el.children) setPanY(child)
      }

      const holdGesture = (event: PointerEvent) => {
        if (event.button !== 0) return
        gesture = true
        gestureFrame = gsap.ticker.frame
        pressPointerX = event.pageX
        pressClientX = event.clientX
        pressClientY = event.clientY
        touchAxis = null
      }

      const claimTouchAxis = (event: TouchEvent) => {
        const touch = event.touches[0]
        if (!touch) return

        if (!touchAxis) {
          const dx = Math.abs(touch.clientX - pressClientX)
          const dy = Math.abs(touch.clientY - pressClientY)
          if (dx < 8 && dy < 8) return
          touchAxis = dx > dy ? "x" : "y"
          if (touchAxis === "y") {
            gesture = false
            lastTick = gsap.ticker.time
          }
        }

        if (touchAxis === "x") event.stopPropagation()
      }

      const finishCoast = () => {
        const draggable = tl.draggable
        if (draggable?.isThrowing && !draggable.isPressed) draggable.tween?.kill()
        coasting = false
        gesture = false
        lastTick = gsap.ticker.time
      }

      const releaseGesture = () => {
        if (coasting) return
        gesture = false
        lastTick = gsap.ticker.time
      }

      gsap.ticker.add(stepAutoplay)
      trigger.addEventListener("pointerdown", holdGesture)
      trigger.addEventListener("touchmove", claimTouchAxis)
      window.addEventListener("pointerup", releaseGesture)
      window.addEventListener("pointercancel", releaseGesture)
      stopAutoplay = () => {
        keepAlive.kill()
        gsap.ticker.remove(stepAutoplay)
        trigger.removeEventListener("pointerdown", holdGesture)
        trigger.removeEventListener("touchmove", claimTouchAxis)
        window.removeEventListener("pointerup", releaseGesture)
        window.removeEventListener("pointercancel", releaseGesture)
      }

      tl.pause = () => {
        autoplay = false
        if (!tl.draggable?.isPressed) finishCoast()
        return tl
      }

      tl.resume = () => {
        autoplay = true
        gesture = false
        lastTick = gsap.ticker.time
        return tl
      }

      const created = Draggable.create(proxy, {
        trigger: firstItem.parentNode as Element,
        type: "x",
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: config.allowNativeTouchScrolling ?? false,
        minimumMovement: 8,
        onPressInit() {
          gsap.killTweensOf(tl)
          pauseTimeline()
          startProgress = tl.progress()
          refresh()
          ratio = 1 / totalWidth
          gsap.set(proxy!, { x: startProgress / -ratio })

          if (+InertiaPlugin.version.split(".")[1]! < 14) {
            const tracker = InertiaPlugin.getByTarget(proxy!)
            const pt =
              tracker &&
              (tracker as { _props?: { x?: { v1: number; v2: number } } })._props?.x
            if (pt) {
              pt.v1 = pt.v2 = startProgress / -ratio
            }
          }
        },
        onDrag() {
          if (touchAxis === "y") return
          setDirection(pressPointerX - this.pointerX)
          tl.progress(wrap(startProgress + (this.startX - this.x) * ratio))
        },
        onThrowUpdate() {
          if (touchAxis === "y" || !Number.isFinite(this.x)) return
          tl.progress(wrap(startProgress + (this.startX - this.x) * ratio))
        },
        inertia: true,
        minDuration: 0.2,
        maxDuration: 1.2,
        overshootTolerance: 0,
        snap:
          config.snap === false
            ? undefined
            : (value: number) => {
                const time = -(value * ratio) * tl.duration()
                const wrappedTime = timeWrap(time)
                const snapTime =
                  times[getClosest(times, wrappedTime, tl.duration())] ?? wrappedTime
                let dif = snapTime - wrappedTime

                if (Math.abs(dif) > tl.duration() / 2) {
                  dif += dif < 0 ? tl.duration() : -tl.duration()
                }

                return (time + dif) / tl.duration() / -ratio
              },
        onRelease() {
          if (touchAxis === "y") {
            this.tween?.kill()
            finishCoast()
            return
          }

          setDirection(pressPointerX - this.pointerX)
          indexIsDirty = true
          tl.closestIndex(true)

          const tween = this.tween
          const throwMoves =
            this.isThrowing &&
            !!tween &&
            tween.isActive() &&
            tween.duration() > 0 &&
            tween.progress() < 1

          if (throwMoves) {
            coasting = true
            gesture = true
            coastIdle = 0
            coastProgress = tl.progress()
            return
          }

          finishCoast()
        },
        onThrowComplete() {
          finishCoast()
        },
        onDragEnd() {
          setDirection(pressPointerX - this.pointerX)
        },
      })[0]

      if (!created) {
        throw new Error("horizontalLoop: failed to create Draggable")
      }

      if (config.allowNativeTouchScrolling) setPanY(trigger)
      trigger.setAttribute("data-lenis-prevent-horizontal", "")

      tl.draggable = created
    }

    tl.closestIndex(true)
    lastIndex = curIndex
    const currentItem = items[curIndex]
    if (currentItem) {
      onChange?.(currentItem, curIndex)
    }

    return () => {
      stopAutoplay?.()
      window.removeEventListener("resize", onResize)
      tl.draggable?.kill()
    }
  })

  timeline.revertLoop = () => ctx.revert()

  return timeline
}
