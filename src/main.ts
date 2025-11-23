import { event } from './events'
import { gameInit, render } from './game'
import './style.css'
import { Box } from './utils'

Box(gameInit()).map(render).map(event)
