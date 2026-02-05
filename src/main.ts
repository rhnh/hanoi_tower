import './style.css'
import { event } from './events'
import { gameInit, render } from './game'
import { Box } from './utils'

Box(gameInit()).map(render).map(event)
