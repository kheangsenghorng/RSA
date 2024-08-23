// Helper functions for GCD and modular inverse
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function extendedGcd(a, b) {
  if (a === 0) return [b, 0, 1];
  const [gcd, x1, y1] = extendedGcd(b % a, a);
  const x = y1 - Math.floor(b / a) * x1;
  const y = x1;
  return [gcd, x, y];
}

function modInverse(e, phi) {
  const [gcd, x] = extendedGcd(e, phi);
  if (gcd !== 1) throw new Error('Modular inverse does not exist');
  return (x % phi + phi) % phi;
}

// Check if a number is prime
function isPrime(num) {
  if (num === 2) return true;
  if (num < 2 || num % 2 === 0) return false;
  for (let n = 3; n <= Math.sqrt(num); n += 2) {
    if (num % n === 0) return false;
  }
  return true;
}

// Generate keypair
function generateKeypair(p, q, e) {
  if (!(isPrime(p) && isPrime(q))) throw new Error('Both numbers must be prime.');
  if (p === q) throw new Error('p and q cannot be equal');
  
  const n = p * q;
  if (n <= 25) throw new Error('n = p * q must be greater than 25. Please enter larger primes.');
  
  const phi = (p - 1) * (q - 1);
  
  if (gcd(e, phi) !== 1) throw new Error('e must be coprime with phi(n).');
  
  const d = modInverse(e, phi);
  
  return [[e, n], [d, n]];
}

// Define the custom mapping
const charToNum = {};
const numToChar = {};
for (let i = 0; i < 26; i++) {
  const char = String.fromCharCode(97 + i);
  charToNum[char] = i;
  numToChar[i] = char;
}

function encryptMessage(pk, plaintext) {
  const [key, n] = pk;
  const mappedValues = Array.from(plaintext.toLowerCase())
    .filter(char => char >= 'a' && char <= 'z')
    .map(char => charToNum[char])
    .map(num => num.toString().padStart(2, '0'))
    .join('');
  
  let step;
  if (n <= 25) throw new Error("n should be greater than 25.");
  if (n <= 2525) step = 2;
  else if (n <= 252525) step = 4;
  else if (n <= 25252525) step = 6;
  else if (n <= 2525252525) step = 8;
  else throw new Error("n is out of the supported range.");

  const cipher = [];
  for (let i = 0; i < mappedValues.length; i += step) {
    const segment = parseInt(mappedValues.slice(i, i + step), 10);
    const cipherValue = BigInt(segment) ** BigInt(key) % BigInt(n);
    cipher.push(cipherValue.toString());
  }

  return cipher;
}

function decryptMessage(pk, ciphertext) {
  const [key, n] = pk;
  const plain = [];

  let step;
  if (n <= 25) throw new Error("n should be greater than 25.");
  if (n <= 2525) step = 2;
  else if (n <= 252525) step = 4;
  else if (n <= 25252525) step = 6;
  else if (n <= 2525252525) step = 8;
  else throw new Error("n is out of the supported range.");

  ciphertext.forEach(cipherValue => {
    const plainValue = BigInt(cipherValue) ** BigInt(key) % BigInt(n);
    const plainStr = plainValue.toString().padStart(step, '0');
    for (let i = 0; i < plainStr.length; i += 2) {
      const num = parseInt(plainStr.slice(i, i + 2), 10);
      if (numToChar[num]) {
        plain.push(numToChar[num]);
      }
    }
  });

  return plain.join('');
}

// Functions to interact with HTML elements
function encrypt() {
  try {
    const p = parseInt(document.getElementById('pValue').value, 10);
    const q = parseInt(document.getElementById('qValue').value, 10);
    const e = parseInt(document.getElementById('eValue').value, 10);
    const message = document.getElementById('message').value;

    const [publicKey, privateKey] = generateKeypair(p, q, e);
    const encryptedMessage = encryptMessage(publicKey, message);

    document.getElementById('encryptedResult').textContent = encryptedMessage.join(', ');
  } catch (error) {
    alert(error.message);
  }
}

function decrypt() {
  try {
    const p = parseInt(document.getElementById('pValue').value, 10);
    const q = parseInt(document.getElementById('qValue').value, 10);
    const e = parseInt(document.getElementById('eValue').value, 10);
    const n = p * q;

    const phi = (p - 1) * (q - 1);
    const d = modInverse(e, phi);

    const encryptedMessage = document.getElementById('encryptedResult').textContent
      .split(',')
      .map(x => x.trim());

    const decryptedMessage = decryptMessage([d, n], encryptedMessage);
    document.getElementById('decryptedResult').textContent = decryptedMessage;
  } catch (error) {
    alert(error.message);
  }
}

function clean() {
  document.getElementById('pValue').value = '';
  document.getElementById('qValue').value = '';
  document.getElementById('eValue').value = '';
  document.getElementById('message').value = '';
  document.getElementById('encryptedResult').textContent = '';
  document.getElementById('decryptedResult').textContent = '';
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('encryptBtn').addEventListener('click', encrypt);
  document.getElementById('decryptBtn').addEventListener('click', decrypt);
  document.getElementById('resetBtn').addEventListener('click', clean);
});
