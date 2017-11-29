/*
	Wspiera:
  	* cyfry
    * +, -, /, *
    * przecinek (, .)
    * ułamki
		* potęgi (-1, 2, 3, n stopnia)
    * pierwiastki (2, 3, n stopnia)
    * logarytmy (o podstawie 10, e, n)
    * procenty
    * sin, cos, tan
    * nawiasy
    * stałe (e, π)
*/

const operations = {
	"mn": node => {
  	const val = node.innerHTML;
  	return String(val).split("").map(n => +n);
  },

	"#text": node => {
  	const val = node.nodeValue;
  	return ( Number.isNaN( +val ) ) ? [ val ] : String(val).split("").map(n => +n);
  },

  "mo": node => {
  	switch (node.innerHTML) {
    	case "·":
      case "×":
      case "*": {
      	return [ "times" ];
      }
      case ".":
      case ",": {
      	return [ "decimal" ];
      }
      case "!": {
      	return [ "shift", "pow-1" ];
      }
      case "÷" : {
      	return [ "divide" ];
      }
      case "%" : {
      	return [ "shift", "\(" ];
      }
      case "-": {
      	return [ "-" ];
      }
      case "+": {
      	return [ "+" ];
      }
      default: {
        console.log( node.innerHTML );
      }
    }
  },

  "mrow": node => {
  	return parse( node );
  },

  "mi": node => {
  	const value = parse( node );
    switch ( value[ 0 ] ) {
    	case "log": {
        return [ "nlog" ];
      }
      case "e": {
        return [ "alpha", "x10" ];
      }
      case "π": {
        return [ "shift", "x10" ];
      }
      default: {
        console.log( value[ 0 ] );
      }
    }
  },

  "msub": node => {
		return [ ...parse( node ), "right" ];
  },

  "msup": node => {
  	const base = parse( node.childNodes[ 0 ], true );

    const power = parse( node.childNodes[ 1 ], true )

   	if( power.length === 2 && power[ 0 ] === "-" && power[ 1 ] === 1 ) {
      return [ "pow-1", ...base, "right", "right", "right", "right" ];
    }

    if ( power === 2 ) {
    	return [ "pow2", ...base, ...power, "right" ];
    } else if ( power === 3 ) {
    	return [ "shift", "pow2", ...power, "right" ];
    }

    return [ "pown", ...base, "right", ...power, "right" ];
  },

  "mfrac": ( node, last ) => {
  	const numerator = parse( node.childNodes[ 0 ], true );

    const denominator = parse( node.childNodes[ 1 ], true )

		if ( last && typeof parse( last )[ 0 ] === "number" ) {
    	return [ "+", "frac", ...numerator, "right", ...denominator, "right" ];
    }

    return [ "frac", ...numerator, "right", ...denominator, "right" ];
  },

  "mroot": node => {
  	const base = parse( node.childNodes[ 0 ], true );

    const degree = parse( node.childNodes[ 1 ], true )

    if ( degree[ 0 ] === 2 ) {
    	return [ "root2", ...base, "right" ];
    } else if ( degree[ 0 ] === 3 ) {
    	return [ "shift", "root2", ...base, "right" ];
    }

    return [ "shift" ,"pown", ...degree, "right", ...base, "right" ];
  },

  "msqrt": node => {
    const base = parse( node.childNodes[ 0 ], true );

    return [ "root2", ...base, "right" ];
  },

  "mfenced": ( node, last ) => {
  	if ( last ) {
      const lastParse = parse( last );

      if (
        lastParse[ 0 ] && (
          lastParse[ 0 ] === "sin" ||
          lastParse[ 0 ] === "cos" ||
          lastParse[ 0 ] === "tan" ||
          lastParse[ 0 ] === "log" ||
          lastParse[ 0 ] === "ln" ||
          lastParse[ 0 ] === "nlog"
        )
      ) {
        if ( last.nodeName !== "msub" ) {
        	return [ lastParse[ 0 ], ...parse( node ), "\)" ];
        } else {
          return [ ...parse( node ), "right" ];
        }
      }
    } else {
      return [ "\(", "\)", "left", ...parse( node ), "right" ];
    }
  }
}

const parse = ( mathml, isChild = false ) => {
	const queue = [];

  const children = isChild ? [ mathml ] : mathml.childNodes;
  let lastChild = null;

	children.forEach( c => {
  	const operation = operations[ c.nodeName ];
  	if ( operation ) {
    	const value = operation(c, lastChild);
      if ( Array.isArray( value ) ) {
      	queue.push( ...value );
      }
    }

    lastChild = c;
  } );

  return queue;
}

module.exports.parser = parse;
