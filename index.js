const { JSDOM } = require("jsdom");
const { parser } = require("./parser");

const { document } = (new JSDOM(`<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>%</mo><mn>21</mn></math>`)).window;

const mathml = document.querySelector("math");

try {
  console.log( parser( mathml ) );
} catch (e) {
  console.log( "Parsing failed", e );
}
