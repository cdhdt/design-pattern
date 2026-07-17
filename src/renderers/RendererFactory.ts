import type { Renderer } from "../core/Renderer.js";
import { HtmlRenderer } from "./HtmlRenderer.js";
import { TexteRenderer } from "./TexteRenderer.js";
import type { FormatSortie } from "./types.js";

const REGISTRE: Record<FormatSortie, new () => Renderer> = {
  html: HtmlRenderer,
  texte: TexteRenderer,
};

export function creerRenderer(format: FormatSortie): Renderer {
  return new REGISTRE[format]();
}

export function formatsDisponibles(): FormatSortie[] {
  return Object.keys(REGISTRE) as FormatSortie[];
}
