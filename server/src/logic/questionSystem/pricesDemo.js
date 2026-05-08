//////////////////////
const SIZE_MAP = {
  small: ["poodle", "yorkie", "pequeno", "chico"],
  medium: ["cocker", "beagle", "mediano"],
  large: ["labrador", "golden", "grande"]
};

const EXTRA_WORDS = ["nudos", "largo", "enredado"];

function splitSegments(text) {
  return text.split(/ y |,|\+/);
}

function handlePrice(text) {
  const dogs = parseDogs(text);

  if (!dogs.length) return null;

  const total = calculateTotal(dogs);

  return `El precio aproximado sería $${total} CLP 🐶 (puede variar según el pelaje).`;
}


function parseDogs(text) {
  const clean = normalize(text);
  const segments = splitSegments(clean);

  const results = [];

  for (const seg of segments) {
    const parsed = parseSegment(seg);
    if (parsed) results.push(parsed);
  }

  return results;
}

const PRICES = {
  small: 15000,
  medium: 20000,
  large: 30000
};

function calculateTotal(dogs) {
  let total = 0;

  for (const d of dogs) {
    let price = PRICES[d.size];

    if (d.extra) price += 5000;

    total += price * d.qty;
  }

  return total;
}

function parseDogs(text) {
  const clean = normalize(text);
  const segments = splitSegments(clean);

  const results = [];

  for (const seg of segments) {
    const parsed = parseSegment(seg);
    if (parsed) results.push(parsed);
  }

  return results;
}

function parseSegment(segment) {
  const words = segment.trim().split(" ");

  let qty = 1;
  let size = null;
  let extra = false;

  // cantidad
  const numMatch = segment.match(/\d+/);
  if (numMatch) qty = parseInt(numMatch[0]);

  // tamaño
  for (const [key, values] of Object.entries(SIZE_MAP)) {
    if (values.some(v => segment.includes(v))) {
      size = key;
      break;
    }
  }

  // extras
  if (EXTRA_WORDS.some(w => segment.includes(w))) {
    extra = true;
  }

  if (!size) return null;

  return { qty, size, extra };
}

function splitSegments(text) {
  return text.split(/ y |,|\+/);
}

const SIZE_MAP = {
  small: ["poodle", "yorkie", "pequeno", "chico"],
  medium: ["cocker", "beagle", "mediano"],
  large: ["labrador", "golden", "grande"]
};

const EXTRA_WORDS = ["nudos", "largo", "enredado"];