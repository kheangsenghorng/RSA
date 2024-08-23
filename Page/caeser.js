
// Caesar Cipher Encryption
function caesarEncrypt(plainText, shift) {
  return plainText
    .toUpperCase() // Convert the entire text to uppercase
    .split("")
    .map((char) => {
      if (char.match(/[A-Z]/)) { // Only match uppercase letters
        const code = char.charCodeAt(0);
        const shiftedCode = ((code - 65 + shift) % 26) + 65; // Shift uppercase letters
        return String.fromCharCode(shiftedCode);
      }
      return char; // Non-alphabetic characters are not changed
    })
    .join("");
}

// Reset fields
function resetFields() {
  document.getElementById("caesar-input").value = "";
  document.getElementById("encryptionKey").value = "";
  document.getElementById("caesar-output").innerText = "";
}

// Encrypt function
function encryptCaesar() {
  const text = document.getElementById("caesar-input").value;
  const shift = parseInt(document.getElementById("encryptionKey").value, 10);
  const encrypted = caesarEncrypt(text, shift);
  document.getElementById("caesar-output").innerText = encrypted;
}

