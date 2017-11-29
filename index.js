const { JSDOM } = require("jsdom");
const { parser } = require("./parser");

const mathmlroot = `
<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>6</mn><mo>-</mo><mn>8</mn><mo>&#xD7;</mo><mn>7</mn><mo>+</mo><msqrt><mfenced><mrow><mo>-</mo><mn>3</mn></mrow></mfenced><mo>&#xD7;</mo><mfenced><mrow><mo>-</mo><mn>1</mn></mrow></mfenced></msqrt></math>`

const { document } = (new JSDOM(mathmlroot)).window;

const mathml = document.querySelector("math");

try {
  console.log( parser( mathml ) );
} catch (e) {
  console.log( "Parsing failed", e );
}
