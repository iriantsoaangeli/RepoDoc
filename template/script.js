// Table des matières : construite depuis les h2/h3 du contenu
const heads = [...document.querySelectorAll('.page-body h2[id], .page-body h3[id]')];
const tocList = document.getElementById('toc-list');
for (const h of heads) {
  const li = document.createElement('li');
  li.className = h.tagName.toLowerCase();
  const a = document.createElement('a');
  a.href = '#' + h.id; a.textContent = h.textContent;
  li.appendChild(a); tocList.appendChild(li);
}

// Surligne le titre en cours de lecture
const tocLinks = [...tocList.querySelectorAll('a')];
const spy = () => {
  let current = heads[0];
  for (const h of heads) if (h.getBoundingClientRect().top < 120) current = h;
  tocLinks.forEach(a => a.classList.toggle('active', !!current && a.hash === '#' + current.id));
};
addEventListener('scroll', spy, { passive: true }); spy();

// Coloration syntaxique légère (Python, Java, JS, C, SQL, Bash…) aux couleurs Dark+
const CTL = new Set(('import from as with if else elif for while do return try except catch finally ' +
  'raise throw break continue yield await switch case default pass in is not and or then fi done esac').split(' '));
const KW = new Set(('def class lambda public private protected static final void int long double float ' +
  'boolean char byte short new this self super extends implements interface enum abstract const let var ' +
  'function async None True False null true false undefined struct typedef unsigned sizeof ' +
  'select insert update delete where join on group by order having create table values into echo local export').split(' '));
//            commentaires                            | chaînes                                                                     | @annot | nombres                          | mots
const TOKENS = /(#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|--\s[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(@\w+)|(\b0x[\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?[lLfFdD]?\b)|(\b[A-Za-z_]\w*\b)/g;
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (c, t) => `<span class="tk-${c}">${esc(t)}</span>`;
for (const code of document.querySelectorAll('.content pre code')) {
  const src = code.textContent;
  let out = '', last = 0;
  for (const m of src.matchAll(TOKENS)) {
    const [t, com, str, dec, num, word] = m;
    out += esc(src.slice(last, m.index));
    last = m.index + t.length;
    if (com) out += span('com', t);
    else if (str) out += span('str', t);
    else if (dec) out += span('dec', t);
    else if (num) out += span('num', t);
    else if (CTL.has(word)) out += span('ctl', t);
    else if (KW.has(word)) out += span('kw', t);
    else if (/^\s*\(/.test(src.slice(last, last + 20))) out += span('fn', t);
    else if (/^[A-Z][a-z]\w*$/.test(word)) out += span('typ', t);
    else out += esc(t);
  }
  code.innerHTML = out + esc(src.slice(last));
}

// Bouton copier sur chaque bloc de code
for (const pre of document.querySelectorAll('.content pre')) {
  const b = document.createElement('button');
  b.className = 'copy-btn'; b.textContent = 'Copier';
  b.onclick = () => navigator.clipboard.writeText(pre.querySelector('code').innerText)
    .then(() => { b.textContent = 'Copié !'; setTimeout(() => b.textContent = 'Copier', 1500); });
  pre.appendChild(b);
}

// Ferme la sidebar mobile après un clic sur un lien
document.querySelectorAll('.drawer a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('drawer-open')));

// Garde le thème actif visible dans le header sur petit écran
document.querySelector('.themes a.active')?.scrollIntoView({ inline: 'center', block: 'nearest' });
