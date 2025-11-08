import { bindEvents } from "./events";
import { setup, render } from "./game";
import "./style.css";
import { type State } from "./type";
import { Box } from "./utils";

Box<State>(setup()).map(render).map(bindEvents);
