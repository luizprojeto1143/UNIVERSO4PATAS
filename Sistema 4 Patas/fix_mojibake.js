const fs = require('fs');
const path = require('path');

const replacements = {
    "Ã¡": "á",
    "Ã©": "é",
    "Ã­": "í", // Note: This is an invisible soft hyphen sometimes, but usually "í". Wait, Ã followed by soft hyphen? Let's use unicode:
    "Ã³": "ó",
    "Ãº": "ú",
    "Ã¢": "â",
    "Ãª": "ê",
    "Ã´": "ô",
    "Ã£": "ã",
    "Ãµ": "õ",
    "Ã§": "ç",
    "Ã": "À", // Be careful, "Ã" followed by nothing? Wait, let's look at Ã£.
    "Ã": "Á",
    "Ã‰": "É",
    "Ã": "Í",
    "Ã“": "Ó",
    "Ãš": "Ú",
    "Ã‚": "Â",
    "ÃŠ": "Ê",
    "Ã”": "Ô",
    "Ãƒ": "Ã",
    "Ã•": "Õ",
    "Ã‡": "Ç"
};

// Wait, the "Ã" by itself could be problematic if it replaces prefixes. Let's look at specific ones from grep:
// "Ã¡" -> "á" (CatÃ¡logo)
// "Ã£" -> "ã" (GestÃ£o)
// "Ã³" -> "ó" (MÃ³dulos)
// "Ã­" -> "í" (FÃ­sicos) 
// "Ã©" -> "é" (MÃ©dicos)
// "Ã§" -> "ç" (ServiÃ§os)

const preciseReplacements = {
    "Ã¡": "á",
    "Ã©": "é",
    "Ã­": "í", // The hex for this is \xC3\xAD 
    "Ã³": "ó",
    "Ãº": "ú",
    "Ã¢": "â",
    "Ãª": "ê",
    "Ã´": "ô",
    "Ã£": "ã",
    "Ãµ": "õ",
    "Ã§": "ç",
    "Ã€": "À",
    "Ã": "Á",
    "Ã‰": "É",
    "Ã": "Í",
    "Ã“": "Ó",
    "Ãš": "Ú",
    "Ã‚": "Â",
    "ÃŠ": "Ê",
    "Ã”": "Ô",
    "Ãƒ": "Ã",
    "Ã•": "Õ",
    "Ã‡": "Ç"
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('C:/Users/luiza/Desktop/Sistema 4 Patas/apps/web/src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Some are really tricky. Let's just do a string replace all.
    for (const [bad, good] of Object.entries(preciseReplacements)) {
        content = content.split(bad).join(good);
    }
    
    // There might be some edge cases like "Ã " which is "à".
    content = content.split("Ã ").join("à");
    content = content.split("Ã\u00ad").join("í"); // Sometimes the i is represented weirdly.
    content = content.split("Ã§Ãµes").join("ções"); // Just in case.

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
    }
});

console.log(`Fixed mojibake in ${changedCount} files.`);
