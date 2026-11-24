// Coloration syntaxique légère (Python, Java, JS, C, SQL, Bash…) aux couleurs Dark+.
// Reprise de template/script.js. Les classes tk-* sont dans style.css.
const CTL = new Set(
  (
    'import from as with if else elif for while do return try except catch finally ' +
    'raise throw break continue yield await switch case default pass in is not and or then fi done esac'
  ).split(' '),
)
const KW = new Set(
  (
    'def class lambda public private protected static final void int long double float ' +
    'boolean char byte short new this self super extends implements interface enum abstract const let var ' +
    'function async None True False null true false undefined struct typedef unsigned sizeof ' +
    'select insert update delete where join on group by order having create table values into echo local export'
  ).split(' '),
)
//              commentaires                         | chaînes                                                                     | @annot | nombres                          | mots
const TOKENS =
  /(#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|--\s[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(@\w+)|(\b0x[\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?[lLfFdD]?\b)|(\b[A-Za-z_]\w*\b)/g

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const span = (c: string, t: string) => `<span class="tk-${c}">${esc(t)}</span>`

/** Renvoie le code en HTML, avec des <span class="tk-…"> autour des mots reconnus */
export const highlight = (src: string): string => {
  let out = ''
  let last = 0
  for (const m of src.matchAll(TOKENS)) {
    const [t, com, str, dec, num, word] = m
    out += esc(src.slice(last, m.index))
    last = m.index + t.length
    if (com) out += span('com', t)
    else if (str) out += span('str', t)
    else if (dec) out += span('dec', t)
    else if (num) out += span('num', t)
    else if (word && CTL.has(word)) out += span('ctl', t)
    else if (word && KW.has(word)) out += span('kw', t)
    else if (/^\s*\(/.test(src.slice(last, last + 20))) out += span('fn', t)
    else if (/^[A-Z][a-z]\w*$/.test(t)) out += span('typ', t)
    else out += esc(t)
  }
  return out + esc(src.slice(last))
}
