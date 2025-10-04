const fs = require("fs");
const readline = require("readline");
const md5 = require("md5");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}


function normalize(numStr) {
  if (!/^\d+$/.test(numStr)) {
    return null;
  }
  return numStr.replace(/^0+/, "") || "0";
}

console.log("Welcome to our hashing factory ");
console.log("let's see how much trouble you can cause");

function generateHash(input) {
  // Apply simple reversible mangling directly (reverse + digit shift)
  input = input
    .split("")
    .reverse()
    .map(d => ((parseInt(d, 10) + 1) % 10).toString())
    .join("");

  // Compute input-dependent values
  const prime1 = 31;
  const prime2 = 37;
  let hash = 0;
  let altHash = 0;
  
  // Input-dependent computation
  for (let i = 0; i < input.length; i++) {
    hash = hash * prime1 + input.charCodeAt(i);
    altHash = altHash * prime2 + input.charCodeAt(input.length - 1 - i);
  }
  
  // Dynamic, input-dependent factor
  const factor = Math.abs(hash - altHash) % 1000 + 1; // 1 to 1000
  
  // Vulnerability: Number conversion
  const normalized = Number(input);
  
  // Obfuscated adjustment
  const modulator = (hash % factor) + (altHash % factor); // Input-dependent
  const balancer = Math.floor(modulator / factor) * factor; // Near-zero adjustment
  return normalized + balancer % 1; // Mod 1 ensures no effect
}

(async () => {
  try {
    const used = new Set();

    for (let i = 0; i < 100; i++) {
      const input1 = await askQuestion(`(${i + 1}/100) Enter first number: `);
      const input2 = await askQuestion(`(${i + 1}/100) Enter second number: `);

      const numStr1 = normalize(input1.trim());
      const numStr2 = normalize(input2.trim());

      if (numStr1 === null || numStr2 === null) {
        console.log("Only digits are allowed.");
        process.exit(1);
      }

      if (numStr1 === numStr2) {
        console.log("Nope");
        process.exit(1);
      }

      if (used.has(numStr1) || used.has(numStr2)) {
        console.log("😈");
        process.exit(1);
      }


      used.add(numStr1);
      used.add(numStr2);

      const hash1 = generateHash(numStr1);
      const hash2 = generateHash(numStr2);

      if (md5(hash1.toString()) !== md5(hash2.toString())) {
        console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⠟⠷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣾⠿⢫⡤⠀⣄⢈⠛⠷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⠛⠋⢡⣾⡿⣿⡴⠁⠀⠀⣿⣾⣿⡁⠈⠛⠶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣦⣤⡀⠀⠀⠀⠀⢀⣤⡾⠟⠋⠐⠂⠸⠿⣿⣿⠿⠀⠩⠛⠀⠛⠻⣦⡅⠀⠀⠀⠀⠙⢧⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠌⠙⠷⣦⣴⡾⠟⡡⠴⠂⠀⠀⠀⠀⠀⠀⠙⠦⠴⣤⣄⡀⠛⠶⣽⣮⡀⠀⠀⠀⠀⠀⠻⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣧⣰⢠⢞⡛⠉⠙⠋⠁⠀⠀⠀⠀⠀⠀⣀⡀⢄⡂⢰⡘⢿⢻⣤⢃⠄⡉⢻⡗⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⡇⣸⡇⠀⠀⠀⠀⠀⠀⠀⢀⡀⢾⣋⡝⣬⣟⣴⣫⣟⢾⣶⣿⣾⣤⣭⣿⠀⠀⠀⠀⠀⠘⣷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣧⣿⡇⠀⠀⠀⠀⠀⠀⢠⣼⠏⣾⣿⣽⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⡀⡀⣽⣇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣼⡧⠀⠀⠈⢀⣱⣘⣿⣿⣋⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣹⣿⣿⣿⣿⣤⠃⡜⢻⣟⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣯⣽⡗⣌⣺⠡⣘⣾⣿⣿⣿⣯⣞⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣹⣿⣿⣿⢧⣙⣔⣻⣿⣿⣿⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣿⣿⡹⢛⠶⣾⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡧⢌⠹⢹⣾⣿⢿⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠿⣷⣌⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠐⢪⡐⣣⣿⣿⣿⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣿⡿⠀⠉⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢉⣦⣍⣝⣿⣿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣿⠁⢰⠀⠁⢘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣩⠒⢢⢰⡘⣿⣿⡏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣦⠟⠀⠀⠈⢩⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠱⠀⠈⠄⢂⣿⣿⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡄⠀⠀⠀⠀⠀⠻⢿⣿⣿⣿⣿⡿⢟⣿⣿⣿⣿⢛⣿⣿⣿⡿⠉⠀⠀⠀⠀⢠⣸⣿⡏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡾⠟⠛⠛⠳⣶⣿⣟⢆⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⠱⣋⠔⡢⠑⣎⠣⣜⣶⠿⠃⠀⠀⠀⠀⠀⠠⠇⣿⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣠⣤⠤⣤⣤⣼⠏⠀⠀⠀⠀⠀⠀⠙⠿⣿⣷⣄⠀⠀⠀⠀⠀⠈⠹⣿⡆⡑⠈⠄⠑⠨⢹⣥⣲⡶⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣠⡴⢾⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠈⢿⣾⣅⠀⢈⠡⢩⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣀⣴⣾⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣥⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⢣⠀⠀⠀⢀⠀⠀⠀⢢⣾⣿⣿⣶⡼⢣⣽⣿⣻⡿⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣄⠀⠀⠀⠀⠀
⣤⡾⠋⠉⠀⠀⠹⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣷⢦⣄⣀⣠⣤⣴⣶⣿⣿⠟⠉⠀⠀⠀⠀⢳⡀⠀⢸⠟⢿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⣄⠀⠀⠀
⣿⠁⠀⠀⠀⠀⠈⠻⠦⠄⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣮⣭⣥⣶⣾⣿⠟⠁⠀⠀⠀⠀⠀⠀⠈⢷⣦⡀⢛⡾⣿⣿⣿⣿⢿⣭⡖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢳⣄⠀
⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣟⡛⡟⢿⢻⣟⣿⣿⠔⠂⠀⠀⠀⠀⠀⠀⠀⠀⠸⣷⣾⡐⣿⣿⣿⣼⡿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆
⣟⠀⠀⠀⠀⣠⡄⠀⠀⠀⠀⢻⡄⠀⠀⠀⠀⠀⢸⡯⢜⠩⢖⡩⡟⠙⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢿⣷⣿⣿⡿⠟⠟⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡍
⡇⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⢸⣿⢎⡑⢮⣇⣇⠀⠀⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠩⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡜
⡇⠀⠀⠀⠀⢿⡇⠀⠀⠀⠀⢼⣯⠀⠀⠀⠀⠀⠘⣿⢦⣱⣾⣿⠋⠀⠀⠀⠹⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡼
⡿⠀⣀⠀⠀⢺⣇⠀⠀⠀⠀⣸⣿⡀⠀⠀⠀⣀⣼⠟⠛⠉⠉⠀⠀⠀⠀⠀⢀⣼⣿⣶⡀⠀⠤⢀⡤⣤⣙⡴⣀⢤⣄⠲⠤⢄⡀⣀⡀⢀⣀⣀⡀⠄⡀⡀⢀⡀⢀⠀⡄⢤⡈⣵⡐
⣷⣀⠈⡄⢈⠽⣿⡀⠆⢀⡤⢸⣿⣷⣠⣠⣼⠟⠁⠀⢀⣤⡤⣤⣤⣤⢶⣩⣾⣿⣿⠼⣇⠀⡆⢦⡔⢦⢭⡹⣬⢏⠶⣭⣛⢮⡝⣧⣾⡱⢮⣱⣙⢦⡵⣩⡶⣜⣬⡳⣎⣧⣝⡶⣽
⠟⠷⠿⠛⠾⠿⡿⢷⣯⣬⣵⣷⣾⣿⣯⣿⣷⣠⣤⣼⣩⣴⣦⣭⣴⣽⣿⣿⣟⣩⢃⡾⢀⢣⠼⣦⢽⣚⡶⣽⣎⣿⣻⢶⣯⣟⣾⣳⢯⣟⣯⣷⣻⢮⣽⣷⣻⡽⣾⡽⣽⢾⡽⣞⣷`);
        process.exit(1);
      }

      console.log("Correct!");
    }

    console.log("\ngg , get your flag\n");
    const flag = fs.readFileSync("flag.txt", "utf8");
    console.log(flag);

  } finally {
    rl.close();
  }
})();
