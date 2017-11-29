const { JSDOM } = require("jsdom");
const { parser } = require("./parser");

const mathmlroot = `
<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>+</mo><mn>4</mn><mo>+</mo><mn>5</mn><mo>&#xD7;</mo><mroot><mn>36</mn><mn>6</mn></mroot></math>
`

const { document } = (new JSDOM(mathmlroot)).window;

const mathml = document.querySelector("math");

try {
  console.log( parser( mathml ) );
} catch (e) {
  console.log( "Parsing failed", e );
}
