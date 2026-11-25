// Outils Markdown : découpe un .md en blocs (tokens marked) et en tire les titres.
import { Lexer, Parser, Renderer, walkTokens, type Token, type Tokens } from 'marked'

export type { Token, Tokens }
export { walkTokens }

/**
 * Rendu HTML des liens :
 *   - href vide (lien qui ne mène à aucun fichier, voir MdRouter) → texte simple
 *   - liens externes (http, https) → nouvel onglet
 */
class RenduLiens extends Renderer {
  override link(token: Tokens.Link): string {
    if (!token.href) return this.parser.parseInline(token.tokens)
    const html = super.link(token)
    return /^https?:\/\//.test(token.href)
      ? html.replace('<a ', '<a target="_blank" rel="noopener" ')
      : html
  }
}
const options = { renderer: new RenduLiens() }

/** Découpe le texte Markdown en blocs (titre, paragraphe, tableau, code, liste…) */
export const lex = (md: string): Token[] => Lexer.lex(md)

/** Transforme le contenu en ligne d'un bloc (gras, liens, `code`…) en HTML */
export const inline = (tokens: Token[] | undefined, fallback = ''): string =>
  tokens ? Parser.parseInline(tokens, options) : fallback

/** Transforme des blocs entiers en HTML (blocs sans composant dédié) */
export const blocs = (tokens: Token[]): string => Parser.parse(tokens, options)

/**
 * Id d'un titre, au même format que GitHub et Obsidian (pour que les liens "#…" écrits
 * à la main marchent) : "2. Récupérer l'image" → "2-récupérer-limage"
 */
export const slug = (text: string): string =>
  text
    .replace(/<[^>]*>/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-')

export interface Heading {
  id: string
  label: string
  level: number
}

/** Titres h2/h3 du document, pour la table des matières */
export const headings = (tokens: Token[]): Heading[] =>
  tokens
    .filter((t): t is Tokens.Heading => t.type === 'heading' && (t.depth === 2 || t.depth === 3))
    .map((t) => ({ id: slug(t.text), label: t.text, level: t.depth }))
