// Outils Markdown : découpe un .md en blocs (tokens marked) et en tire les titres.
import { Lexer, Parser, type Token, type Tokens } from 'marked'

export type { Token, Tokens }

/** Découpe le texte Markdown en blocs (titre, paragraphe, tableau, code, liste…) */
export const lex = (md: string): Token[] => Lexer.lex(md)

/** Transforme le contenu en ligne d'un bloc (gras, liens, `code`…) en HTML */
export const inline = (tokens: Token[] | undefined, fallback = ''): string =>
  tokens ? Parser.parseInline(tokens) : fallback

/** "Poignée de main !" → "poignee-de-main" */
export const slug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

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
