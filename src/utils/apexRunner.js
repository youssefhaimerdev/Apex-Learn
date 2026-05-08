/**
 * ApexRunner — Simulates Apex execution in the browser
 * Translates a subset of Apex syntax to JavaScript and runs it safely.
 */

function translateApexToJS(apex) {
  let js = apex;

  // Remove type declarations → let
  js = js.replace(/\b(Integer|Long|Double|Decimal|Boolean|String|Id|Date|DateTime|Object)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'let $2 =');

  // List<X> varName = new List<X>() or new List<X>{...}
  js = js.replace(/List<[^>]+>\s+([a-zA-Z_]\w*)\s*=\s*new\s+List<[^>]+>\s*\{([^}]*)\}/g, (_, name, items) => {
    return `let ${name} = [${items}]`;
  });
  js = js.replace(/List<[^>]+>\s+([a-zA-Z_]\w*)\s*=\s*new\s+List<[^>]+>\s*\(\)/g, 'let $1 = []');

  // Set<X>
  js = js.replace(/Set<[^>]+>\s+([a-zA-Z_]\w*)\s*=\s*new\s+Set<[^>]+>\s*\(\)/g, 'let $1 = new Set()');
  js = js.replace(/Set<[^>]+>\s+([a-zA-Z_]\w*)\s*=\s*new\s+Set<[^>]+>\s*\{([^}]*)\}/g, (_, name, items) => {
    return `let ${name} = new Set([${items}])`;
  });

  // Map<K,V>
  js = js.replace(/Map<[^>]+>\s+([a-zA-Z_]\w*)\s*=\s*new\s+Map<[^>]+>\s*\(\)/g, 'let $1 = new Map()');

  // .add() → .push() for arrays
  js = js.replace(/(\w+)\.add\(([^)]+)\)/g, (match, varName, arg) => {
    return `__addToCollection(${varName}, ${arg})`;
  });

  // .size() → .length / .size
  js = js.replace(/(\w+)\.size\(\)/g, '__getSize($1)');

  // .get(index) for lists
  js = js.replace(/(\w+)\.get\(([^)]+)\)/g, '__getItem($1, $2)');

  // .contains() → .includes() / .has()
  js = js.replace(/(\w+)\.contains\(([^)]+)\)/g, '__contains($1, $2)');

  // .isEmpty() 
  js = js.replace(/(\w+)\.isEmpty\(\)/g, '__isEmpty($1)');

  // .remove()
  js = js.replace(/(\w+)\.remove\(([^)]+)\)/g, '__remove($1, $2)');

  // .put() for Maps
  js = js.replace(/(\w+)\.put\(([^,]+),\s*([^)]+)\)/g, '$1.set($2, $3)');

  // .containsKey()
  js = js.replace(/(\w+)\.containsKey\(([^)]+)\)/g, '$1.has($2)');

  // .keySet()
  js = js.replace(/(\w+)\.keySet\(\)/g, 'Array.from($1.keys())');

  // .values()
  js = js.replace(/(\w+)\.values\(\)/g, 'Array.from($1.values())');

  // String methods
  js = js.replace(/(\w+)\.toUpperCase\(\)/g, '$1.toUpperCase()');
  js = js.replace(/(\w+)\.toLowerCase\(\)/g, '$1.toLowerCase()');
  js = js.replace(/(\w+)\.length\(\)/g, '$1.length');
  js = js.replace(/(\w+)\.substring\(([^)]+)\)/g, '$1.substring($2)');
  js = js.replace(/(\w+)\.indexOf\(([^)]+)\)/g, '$1.indexOf($2)');
  js = js.replace(/(\w+)\.contains\(([^)]+)\)/g, '$1.includes($2)');
  js = js.replace(/(\w+)\.trim\(\)/g, '$1.trim()');
  js = js.replace(/(\w+)\.replace\(([^,]+),\s*([^)]+)\)/g, '$1.replaceAll($2, $3)');
  js = js.replace(/(\w+)\.split\(([^)]+)\)/g, '$1.split($2)');
  js = js.replace(/(\w+)\.startsWith\(([^)]+)\)/g, '$1.startsWith($2)');
  js = js.replace(/(\w+)\.endsWith\(([^)]+)\)/g, '$1.endsWith($2)');

  // Math methods
  js = js.replace(/Math\.abs\(/g, 'Math.abs(');
  js = js.replace(/Math\.round\(/g, 'Math.round(');
  js = js.replace(/Math\.floor\(/g, 'Math.floor(');
  js = js.replace(/Math\.ceil\(/g, 'Math.ceil(');
  js = js.replace(/Math\.pow\(/g, 'Math.pow(');
  js = js.replace(/Math\.sqrt\(/g, 'Math.sqrt(');
  js = js.replace(/Math\.max\(/g, 'Math.max(');
  js = js.replace(/Math\.min\(/g, 'Math.min(');
  js = js.replace(/Math\.random\(\)/g, 'Math.random()');

  // System.debug → __debug
  js = js.replace(/System\.debug\(LoggingLevel\.\w+,\s*/g, '__debug(');
  js = js.replace(/System\.debug\(/g, '__debug(');

  // for-each: for(Type item : collection)
  js = js.replace(/for\s*\(\s*(?:Integer|String|Boolean|Decimal|Double|Object|Id)\s+(\w+)\s*:\s*(\w+)\s*\)/g, 'for (let $1 of $2)');

  // for loop: for(Integer i = 0; ...)
  js = js.replace(/for\s*\(\s*(?:Integer|Long)\s+(\w+)\s*=/g, 'for (let $1 =');

  // while: standard
  // if/else: standard

  // null checks - null is same
  // true/false - same

  // Exception handling - try/catch
  js = js.replace(/catch\s*\(\s*(?:Exception|DmlException|QueryException|NullPointerException|MathException|ListException)\s+(\w+)\s*\)/g, 'catch ($1)');

  // .getMessage()
  js = js.replace(/(\w+)\.getMessage\(\)/g, '$1.message');

  // Integer.valueOf(), String.valueOf()
  js = js.replace(/Integer\.valueOf\(([^)]+)\)/g, 'parseInt($1)');
  js = js.replace(/String\.valueOf\(([^)]+)\)/g, 'String($1)');
  js = js.replace(/Decimal\.valueOf\(([^)]+)\)/g, 'parseFloat($1)');
  js = js.replace(/Double\.valueOf\(([^)]+)\)/g, 'parseFloat($1)');

  // Remove semicolons (JS is fine either way, but keeping them)
  // Keep as is — JS handles semicolons

  // Remove Apex-specific annotations and class/method wrapping if present
  js = js.replace(/@isTest/g, '// @isTest');
  js = js.replace(/public\s+class\s+\w+\s*\{/g, '// class definition');
  js = js.replace(/public\s+static\s+void\s+\w+\s*\([^)]*\)\s*\{/g, '// method definition');

  return js;
}

export function runApex(code) {
  const debugOutput = [];
  const errors = [];

  const helpers = `
    function __debug(val) {
      if (val === null || val === undefined) { debugOutput.push('null'); return; }
      if (val instanceof Set) { debugOutput.push('{' + Array.from(val).join(', ') + '}'); return; }
      if (val instanceof Map) { debugOutput.push('{' + Array.from(val.entries()).map(([k,v]) => k + '=' + v).join(', ') + '}'); return; }
      if (Array.isArray(val)) { debugOutput.push('(' + val.join(', ') + ')'); return; }
      debugOutput.push(String(val));
    }
    function __addToCollection(col, item) {
      if (col instanceof Set) col.add(item);
      else if (Array.isArray(col)) col.push(item);
    }
    function __getSize(col) {
      if (col instanceof Set || col instanceof Map) return col.size;
      if (Array.isArray(col)) return col.length;
      if (typeof col === 'string') return col.length;
      return 0;
    }
    function __getItem(col, idx) {
      if (Array.isArray(col)) return col[idx];
      if (col instanceof Map) return col.get(idx);
      return undefined;
    }
    function __contains(col, item) {
      if (col instanceof Set) return col.has(item);
      if (Array.isArray(col)) return col.includes(item);
      if (typeof col === 'string') return col.includes(item);
      return false;
    }
    function __isEmpty(col) {
      if (col instanceof Set || col instanceof Map) return col.size === 0;
      if (Array.isArray(col)) return col.length === 0;
      return false;
    }
    function __remove(col, item) {
      if (col instanceof Set) col.delete(item);
      else if (Array.isArray(col)) { const i = col.indexOf(item); if(i>-1) col.splice(i,1); }
    }
  `;

  try {
    const translated = translateApexToJS(code);
    const fullCode = helpers + '\n' + translated;
    // eslint-disable-next-line no-new-func
    const fn = new Function('debugOutput', fullCode);
    fn(debugOutput);
    return { output: debugOutput, error: null, translated };
  } catch (e) {
    return { output: debugOutput, error: e.message, translated: null };
  }
}

export function checkAnswer(output, expectedOutput) {
  const normalizeOutput = (arr) => arr.map(s => s.toString().trim()).join('\n').trim();
  const expected = normalizeOutput(expectedOutput);
  const actual = normalizeOutput(output);
  return actual === expected;
}
