import { setTimeout } from 'node:timers/promises'
import { Sleep } from '../../application/timer/sleep/sleep.js'

export const setTimeoutSleep: Sleep = (time) => setTimeout(time)
