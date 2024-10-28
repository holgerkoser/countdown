<template>
  <div
    ref="daysTick"
    class="tick"
  >
    <div
      data-repeat="true"
      data-layout="horizontal center fit"
      data-transform="preset(d) -> delay"
    >
      <div class="tick-group days">
        <div
          data-key="value"
          data-repeat="true"
          data-transform="pad(00) -> split -> delay"
        >
          <span data-view="flip" />
        </div>
        <span
          data-key="label"
          data-view="text"
          class="tick-label"
          style="margin-bottom: 1em;"
        />
      </div>
    </div>
  </div>
  <div
    ref="timeTick"
    class="tick"
  >
    <div
      data-repeat="true"
      data-layout="horizontal center fit"
      data-transform="preset(h, m, s) -> delay"
    >
      <div class="tick-group">
        <div
          data-key="value"
          data-repeat="true"
          data-transform="pad(00) -> split -> delay"
        >
          <span data-view="flip" />
        </div>
        <span
          data-key="label"
          data-view="text"
          class="tick-label"
        />
      </div>
    </div>
  </div>
  <div
    class="tick-onended-message"
    style="display: none"
  >
    <p>Time's up</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Tick from '@pqina/flip'
import '@pqina/flip/dist/flip.min.css'

const endDate = new Date('2024-12-31')
const holidays = ['2024-11-01', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-31']
const vacationDays = ['2024-12-27', '2024-12-30']
const nonWorkingDays = [...holidays, ...vacationDays]
const timeTick = ref(null)
const daysTick = ref(null)

function getRemainingDays (time) {
  let days = 0
  let date
  do {
    time += 24 * 3600 * 1000
    date = new Date(time)
    const dayOfWeek = date.getDay()
    const dateString = date.toISOString().slice(0, 10)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !nonWorkingDays.includes(dateString)) {
      days += 1
    }
  } while (date < endDate)
  return Math.max(0, days)
}

const ticks = {
  time: null,
  days: null,
  timer: null,
  start () {
    this.timer = Tick.helper.interval(() => {
      const date = new Date()
      let days = getRemainingDays(date.getTime())
      const dateString = date.toISOString().slice(0, 10)
      let time = Math.floor((date.getTime() - Date.parse(dateString + ' 00:00:00')) / 1000)
      if (time <= 9 * 3600) {
        days += 1
        time = 0
      } else if (time >= 17 * 3600) {
        time = 0
      } else {
        time = 17 * 3600 - time
      }
      this.time.value = [
        Math.trunc(time / 3600),
        Math.trunc(time / 60) % 60,
        Math.trunc(time) % 60,
      ]
      this.days.value = [
        days,
      ]
    }, 1000)
  },
  destroy () {
    this.days?.destroy()
    this.time?.destroy()
    this.timer?.stop()
  },
}

onMounted(() => {
  Tick.DOM.create(daysTick.value, {
    credits: false,
    didInit (tick) {
      ticks.days = tick
      if (ticks.time) {
        ticks.start()
      }
    },
  })
  Tick.DOM.create(timeTick.value, {
    credits: false,
    didInit (tick) {
      ticks.time = tick
      if (ticks.days) {
        ticks.start()
      }
    },
  })
})

onUnmounted(() => {
  ticks.destroy()
})
</script>

<style lang="scss" scoped>
.tick {
  font-size: 1rem;
  white-space: nowrap;
  font-family: arial, sans-serif;
}

.tick-flip,
.tick-text-inline {
  font-size: 2.5em;
}

.tick-label {
  margin-top: 0.6em;
  font-size: 1em;
}

.tick-char {
  width: 1.5em;
}

.tick-text-inline {
  display: inline-block;
  text-align: center;
  min-width: 1em;
}

.tick-text-inline + .tick-text-inline {
  margin-left: -0.325em;
}

.tick-group {
  margin: 0 0.8em;
  text-align: center;
}

.tick-group.days {
  margin-top: 0.5em;
  margin-left: 0.1em;
  margin-right: 0.1em;
}

.tick-text-inline {
  color: rgb(90, 93, 99) !important;
}

.tick-label {
  color: rgb(90, 93, 99) !important;
}

.tick-flip-panel {
  color: rgb(255, 255, 255) !important;
}

.tick-flip {
  font-family: arial, sans-serif !important;
}

.tick-flip-panel-text-wrapper {
  line-height: 1.45 !important;
}

.tick-flip-panel {
  background-color: rgb(59, 61, 59) !important;
}

.tick-flip {
  border-radius: 0.12em !important;
}
</style>
