// ─────────────────────────────────────────────────────────────────────────────
// ApexRunner v2 — translates Apex subset to JS and executes in-browser
// ─────────────────────────────────────────────────────────────────────────────

function translateApexToJS(apex) {
  let js = apex;

  // Strip @isTest, annotations
  js = js.replace(/@isTest\b/g, '');
  js = js.replace(/@future[^)]*\)/g, '');
  js = js.replace(/@\w+(\([^)]*\))?/g, '');

  // abstract/virtual/override keywords (keep method body)
  js = js.replace(/\b(public|private|protected|global)\s+(virtual|abstract|override|static)\s+(virtual|abstract|override|static)?\s*/g, 'function_decl ');
  js = js.replace(/\b(public|private|protected|global)\s+(virtual|abstract|override|static)?\s*/g, '');
  js = js.replace(/\bfunction_decl\s+/g, '');

  // Remove final keyword
  js = js.replace(/\bfinal\s+/g, '');

  // Enum declaration → object
  js = js.replace(/\benum\s+(\w+)\s*\{([^}]+)\}/g, (_, name, body) => {
    const vals = body.split(',').map(v => v.trim()).filter(Boolean);
    const entries = vals.map((v, i) => `${v}: { name: function(){return '${v}';}, ordinal: function(){return ${i};}, toString: function(){return '${v}';} }`);
    return `var ${name} = { ${entries.join(', ')}, values: function(){ return [${vals.join(',')}]; } };`;
  });

  // Class declarations — unwrap into a function/IIFE
  js = js.replace(/\bclass\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+[\w,\s]+)?\s*\{/g, (_, name, parent) => {
    if (parent) return `function ${name}() {} ${name}.prototype = Object.create(${parent}.prototype); (function() { var __className='${name}';`;
    return `function ${name}() {} (function() { var __className='${name}';`;
  });

  // Interface declarations — skip
  js = js.replace(/\binterface\s+\w+[^{]*\{[^}]*\}/gs, '');

  // Type declarations → let/var
  const types = 'Integer|Long|Double|Decimal|Boolean|String|Id|Date|DateTime|Object|Blob|SObject|Account|Contact|Opportunity|Lead|Case|User|void';
  const typeRE = new RegExp(`\\b(${types})(?:<[^>]+>)?\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*=`, 'g');
  js = js.replace(typeRE, 'let $2 =');

  // Standalone type declarations without assignment
  const typeRENoAssign = new RegExp(`\\b(${types})(?:<[^>]+>)?\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*;`, 'g');
  js = js.replace(typeRENoAssign, 'let $2 = null;');

  // Method return type declarations → function
  const retTypeRE = new RegExp(`\\b(?:static\\s+)?(${types}|List<[^>]+>|Set<[^>]+>|Map<[^>]+>)\\s+(\\w+)\\s*\\(`, 'g');
  js = js.replace(retTypeRE, 'function $2(');

  // List<X> var = new List<X>{...}
  js = js.replace(/List<[^>]+>\s+(\w+)\s*=\s*new\s+List<[^>]+>\s*\{([^}]*)\}/g, 'let $1 = [$2]');
  js = js.replace(/new\s+List<[^>]+>\s*\{([^}]*)\}/g, '[$1]');
  js = js.replace(/List<[^>]+>\s+(\w+)\s*=\s*new\s+List<[^>]+>\s*\(\)/g, 'let $1 = []');
  js = js.replace(/new\s+List<[^>]+>\s*\(\)/g, '[]');

  // Set<X>
  js = js.replace(/Set<[^>]+>\s+(\w+)\s*=\s*new\s+Set<[^>]+>\s*\(([^)]*)\)/g, 'let $1 = new Set($2 ? Array.from($2) : [])');
  js = js.replace(/new\s+Set<[^>]+>\s*\(([^)]*)\)/g, 'new Set($1 ? (Array.isArray($1) ? $1 : Array.from($1)) : [])');

  // Map<K,V>
  js = js.replace(/Map<[^>]+>\s+(\w+)\s*=\s*new\s+Map<[^>]+>\s*\(\)/g, 'let $1 = new Map()');
  js = js.replace(/new\s+Map<[^>]+>\s*\(\)/g, 'new Map()');
  // Map with initial values: new Map<..>{key => val, ...}
  js = js.replace(/new\s+Map<[^>]+>\s*\{([^}]+)\}/g, (_, body) => {
    const pairs = body.split(',').map(p => {
      const [k, v] = p.split('=>').map(x => x.trim());
      return `[${k}, ${v}]`;
    });
    return `new Map([${pairs.join(', ')}])`;
  });

  // Collection methods
  js = js.replace(/(\w+)\.add\(([^)]+)\)/g, '__col_add($1, $2)');
  js = js.replace(/(\w+)\.addAll\(([^)]+)\)/g, '__col_addAll($1, $2)');
  js = js.replace(/(\w+)\.remove\(([^)]+)\)/g, '__col_remove($1, $2)');
  js = js.replace(/(\w+)\.size\(\)/g, '__col_size($1)');
  js = js.replace(/(\w+)\.get\(([^)]+)\)/g, '__col_get($1, $2)');
  js = js.replace(/(\w+)\.set\(([^,]+),\s*([^)]+)\)/g, '__col_set($1, $2, $3)');
  js = js.replace(/(\w+)\.contains\(([^)]+)\)/g, '__col_contains($1, $2)');
  js = js.replace(/(\w+)\.containsKey\(([^)]+)\)/g, '$1.has($2)');
  js = js.replace(/(\w+)\.isEmpty\(\)/g, '__col_isEmpty($1)');
  js = js.replace(/(\w+)\.clear\(\)/g, '__col_clear($1)');
  js = js.replace(/(\w+)\.sort\(\)/g, '__col_sort($1)');
  js = js.replace(/(\w+)\.keySet\(\)/g, 'Array.from($1.keys())');
  js = js.replace(/(\w+)\.values\(\)/g, '__col_values($1)');
  js = js.replace(/(\w+)\.put\(([^,]+),\s*([^)]+)\)/g, '$1.set($2, $3)');
  js = js.replace(/(\w+)\.retainAll\(([^)]+)\)/g, '__col_retainAll($1, $2)');
  js = js.replace(/(\w+)\.removeAll\(([^)]+)\)/g, '__col_removeAll($1, $2)');
  js = js.replace(/(\w+)\.clone\(\)/g, '__col_clone($1)');

  // String methods
  js = js.replace(/(\w+)\.length\(\)/g, '__str_length($1)');
  js = js.replace(/(\w+)\.toUpperCase\(\)/g, '$1.toUpperCase()');
  js = js.replace(/(\w+)\.toLowerCase\(\)/g, '$1.toLowerCase()');
  js = js.replace(/(\w+)\.trim\(\)/g, '$1.trim()');
  js = js.replace(/(\w+)\.substring\(([^)]+)\)/g, '$1.substring($2)');
  js = js.replace(/(\w+)\.indexOf\(([^)]+)\)/g, '$1.indexOf($2)');
  js = js.replace(/(\w+)\.lastIndexOf\(([^)]+)\)/g, '$1.lastIndexOf($2)');
  js = js.replace(/(\w+)\.replace\(([^,]+),\s*([^)]+)\)/g, '$1.replaceAll($2, $3)');
  js = js.replace(/(\w+)\.split\(([^)]+)\)/g, '$1.split($2)');
  js = js.replace(/(\w+)\.startsWith\(([^)]+)\)/g, '$1.startsWith($2)');
  js = js.replace(/(\w+)\.endsWith\(([^)]+)\)/g, '$1.endsWith($2)');
  js = js.replace(/(\w+)\.charAt\(([^)]+)\)/g, '$1[$2] || ""');
  js = js.replace(/(\w+)\.equals\(([^)]+)\)/g, '($1 === $2)');
  js = js.replace(/(\w+)\.equalsIgnoreCase\(([^)]+)\)/g, '($1.toLowerCase() === ($2).toLowerCase())');
  js = js.replace(/String\.isBlank\(([^)]+)\)/g, '__str_isBlank($1)');
  js = js.replace(/String\.isNotBlank\(([^)]+)\)/g, '!__str_isBlank($1)');
  js = js.replace(/String\.isEmpty\(([^)]+)\)/g, '($1 == null || $1 === "")');
  js = js.replace(/String\.valueOf\(([^)]+)\)/g, 'String($1)');
  js = js.replace(/String\.format\(([^,]+),\s*([^)]+)\)/g, '__str_format($1, $2)');
  js = js.replace(/(\w+)\.setScale\(([^)]+)\)/g, '__decimal_setScale($1, $2)');
  js = js.replace(/(\w+)\.abbreviate\(([^)]+)\)/g, '($1.length > $2 ? $1.substring(0,$2-3)+"..." : $1)');

  // Type conversions
  js = js.replace(/Integer\.valueOf\(([^)]+)\)/g, 'parseInt($1)');
  js = js.replace(/Long\.valueOf\(([^)]+)\)/g, 'parseInt($1)');
  js = js.replace(/Double\.valueOf\(([^)]+)\)/g, 'parseFloat($1)');
  js = js.replace(/Decimal\.valueOf\(([^)]+)\)/g, 'parseFloat($1)');

  // System.debug
  js = js.replace(/System\.debug\(LoggingLevel\.\w+,\s*/g, '__debug(');
  js = js.replace(/System\.debug\(/g, '__debug(');

  // Math
  js = js.replace(/Math\.mod\(([^,]+),\s*([^)]+)\)/g, '(($1) % ($2))');

  // For-each: for(Type item : collection)
  const forEachRE = new RegExp(`for\\s*\\(\\s*(?:${types}|[A-Z]\\w*)(?:<[^>]+>)?\\s+(\\w+)\\s*:\\s*(\\w+)\\s*\\)`, 'g');
  js = js.replace(forEachRE, 'for (let $1 of __iter($2))');

  // For loop with type: for(Integer i = 0;...)
  const forLoopRE = new RegExp(`for\\s*\\(\\s*(?:${types})\\s+(\\w+)\\s*=`, 'g');
  js = js.replace(forLoopRE, 'for (let $1 =');

  // Exception types in catch
  const exceptionTypes = 'Exception|DmlException|NullPointerException|QueryException|ListException|MathException|IllegalArgumentException|TypeException|SecurityException|AgeValidationException|InsufficientFundsException|InvalidAccountException|NegativeValueException|ValidationException|AccountNotFoundException';
  const catchRE = new RegExp(`catch\\s*\\(\\s*(${exceptionTypes}|\\w+Exception)\\s+(\\w+)\\s*\\)`, 'g');
  js = js.replace(catchRE, 'catch ($2)');
  js = js.replace(/(\w+)\.getMessage\(\)/g, '($1 && $1.message ? $1.message : String($1))');
  js = js.replace(/(\w+)\.getTypeName\(\)/g, '($1 && $1.constructor ? $1.constructor.name : "Exception")');

  // throw new XxxException(...)
  js = js.replace(/throw\s+new\s+(\w+Exception)\s*\(([^)]*)\)/g, (_, etype, msg) => {
    return `(function(){ var __e = new Error(${msg || '""'}); __e.apexType="${etype}"; throw __e; })()`;
  });
  js = js.replace(/throw\s+new\s+IllegalArgumentException\s*\(([^)]*)\)/g, (_, msg) => {
    return `(function(){ var __e = new Error(${msg || '""'}); __e.apexType="IllegalArgumentException"; throw __e; })()`;
  });

  // Date/Time
  js = js.replace(/Date\.today\(\)/g, 'new Date().toISOString().split("T")[0]');
  js = js.replace(/DateTime\.now\(\)/g, 'new Date().toISOString()');
  js = js.replace(/System\.now\(\)/g, 'new Date().toISOString()');

  // System.currentTimeMillis()
  js = js.replace(/System\.currentTimeMillis\(\)/g, 'Date.now()');

  // JSON
  js = js.replace(/JSON\.serialize\(([^)]+)\)/g, '__json_serialize($1)');
  js = js.replace(/JSON\.serializePretty\(([^)]+)\)/g, '__json_serialize($1, true)');
  js = js.replace(/JSON\.deserializeUntyped\(([^)]+)\)/g, 'JSON.parse($1)');

  // Null coalescing
  js = js.replace(/null\s*!=\s*(\w+)/g, '$1 != null');

  return js;
}

const HELPERS = `
  var __debugOutput = debugOutput;

  function __debug(val) {
    if (val === null || val === undefined) { __debugOutput.push('null'); return; }
    if (val instanceof Set) { __debugOutput.push('{' + Array.from(val).join(', ') + '}'); return; }
    if (val instanceof Map) {
      var pairs = Array.from(val.entries()).map(function(e){ return e[0]+'='+e[1]; });
      __debugOutput.push('{' + pairs.join(', ') + '}'); return;
    }
    if (Array.isArray(val)) { __debugOutput.push('(' + val.join(', ') + ')'); return; }
    if (typeof val === 'boolean') { __debugOutput.push(val ? 'true' : 'false'); return; }
    if (val && typeof val === 'object' && val.name) { __debugOutput.push(String(val.name())); return; }
    __debugOutput.push(String(val));
  }

  function __col_add(col, item) {
    if (!col) return;
    if (col instanceof Set) col.add(item);
    else if (Array.isArray(col)) col.push(item);
  }
  function __col_addAll(col, other) {
    if (!col || !other) return;
    var arr = Array.isArray(other) ? other : Array.from(other);
    arr.forEach(function(item) { __col_add(col, item); });
  }
  function __col_remove(col, item) {
    if (!col) return;
    if (col instanceof Set) col.delete(item);
    else if (col instanceof Map) col.delete(item);
    else if (Array.isArray(col)) { var i = typeof item === 'number' ? item : col.indexOf(item); if(i>-1) col.splice(i,1); }
  }
  function __col_size(col) {
    if (!col) return 0;
    if (col instanceof Set || col instanceof Map) return col.size;
    if (Array.isArray(col)) return col.length;
    if (typeof col === 'string') return col.length;
    return 0;
  }
  function __col_get(col, key) {
    if (!col) return null;
    if (col instanceof Map) return col.get(key) !== undefined ? col.get(key) : null;
    if (Array.isArray(col)) return col[key];
    return null;
  }
  function __col_set(col, idx, val) {
    if (!col) return;
    if (Array.isArray(col)) col[idx] = val;
    else if (col instanceof Map) col.set(idx, val);
  }
  function __col_contains(col, item) {
    if (!col) return false;
    if (col instanceof Set) return col.has(item);
    if (Array.isArray(col)) return col.includes(item);
    if (typeof col === 'string') return col.includes(item);
    return false;
  }
  function __col_isEmpty(col) {
    if (!col) return true;
    if (col instanceof Set || col instanceof Map) return col.size === 0;
    if (Array.isArray(col)) return col.length === 0;
    return false;
  }
  function __col_clear(col) {
    if (!col) return;
    if (col instanceof Set || col instanceof Map) col.clear();
    else if (Array.isArray(col)) col.splice(0, col.length);
  }
  function __col_sort(col) {
    if (Array.isArray(col)) col.sort(function(a,b){ return a < b ? -1 : a > b ? 1 : 0; });
  }
  function __col_values(col) {
    if (!col) return [];
    if (col instanceof Map) return Array.from(col.values());
    if (col instanceof Set) return Array.from(col);
    return col;
  }
  function __col_retainAll(col, other) {
    if (!col || !other) return;
    var otherArr = Array.isArray(other) ? other : Array.from(other);
    if (col instanceof Set) { col.forEach(function(v){ if(!otherArr.includes(v)) col.delete(v); }); }
    else if (Array.isArray(col)) {
      for (var i = col.length - 1; i >= 0; i--) { if (!otherArr.includes(col[i])) col.splice(i,1); }
    }
  }
  function __col_removeAll(col, other) {
    if (!col || !other) return;
    var otherArr = Array.isArray(other) ? other : Array.from(other);
    if (col instanceof Set) { otherArr.forEach(function(v){ col.delete(v); }); }
    else if (Array.isArray(col)) {
      for (var i = col.length - 1; i >= 0; i--) { if (otherArr.includes(col[i])) col.splice(i,1); }
    }
  }
  function __col_clone(col) {
    if (Array.isArray(col)) return col.slice();
    if (col instanceof Set) return new Set(col);
    if (col instanceof Map) return new Map(col);
    return col;
  }
  function __iter(col) {
    if (col == null) return [];
    if (Array.isArray(col)) return col;
    if (col instanceof Set || col instanceof Map) return Array.from(col);
    if (typeof col === 'string') return col.split('');
    return Array.isArray(col) ? col : [];
  }
  function __str_length(s) { return s == null ? 0 : s.length; }
  function __str_isBlank(s) { return s == null || s.trim() === ''; }
  function __str_format(tmpl, args) {
    var arr = Array.isArray(args) ? args : Array.from(args);
    return tmpl.replace(/\\{(\\d+)\\}/g, function(_, i){ return arr[parseInt(i)] !== undefined ? arr[parseInt(i)] : ''; });
  }
  function __decimal_setScale(n, scale) {
    var factor = Math.pow(10, scale);
    return Math.round(n * factor) / factor;
  }
  function __json_serialize(val, pretty) {
    try { return pretty ? JSON.stringify(val, null, 2) : JSON.stringify(val); }
    catch(e) { return '{}'; }
  }

  var Math_orig = Math;
  var Math = {
    abs: Math_orig.abs.bind(Math_orig),
    round: Math_orig.round.bind(Math_orig),
    floor: Math_orig.floor.bind(Math_orig),
    ceil: Math_orig.ceil.bind(Math_orig),
    pow: Math_orig.pow.bind(Math_orig),
    sqrt: Math_orig.sqrt.bind(Math_orig),
    max: Math_orig.max.bind(Math_orig),
    min: Math_orig.min.bind(Math_orig),
    random: Math_orig.random.bind(Math_orig),
    mod: function(a, b) { return a % b; },
    log: Math_orig.log.bind(Math_orig),
    log10: Math_orig.log10.bind(Math_orig),
  };

  var String_orig = String;
  var String = {
    valueOf: function(v){ return String_orig(v); },
    isBlank: function(s){ return s == null || s.trim() === ''; },
    isNotBlank: function(s){ return s != null && s.trim() !== ''; },
    isEmpty: function(s){ return s == null || s === ''; },
    format: __str_format,
    escapeSingleQuotes: function(s){ return s ? s.replace(/'/g, "\\\\'") : s; },
  };

  var Integer = { valueOf: function(s){ return parseInt(s); } };
  var Long = { valueOf: function(s){ return parseInt(s); } };
  var Double = { valueOf: function(s){ return parseFloat(s); } };
  var Decimal = { valueOf: function(s){ return parseFloat(s); } };
`;

export function runApex(code) {
  const debugOutput = [];
  const errors = [];

  try {
    const translated = translateApexToJS(code);
    // eslint-disable-next-line no-new-func
    const fn = new Function('debugOutput', HELPERS + '\n' + translated);
    fn(debugOutput);
    return { output: debugOutput, error: null, translated };
  } catch (e) {
    // Format error nicely
    let msg = e.message || String(e);
    // Division by zero
    if (msg.includes('Infinity') || (e instanceof RangeError && msg.includes('division'))) {
      msg = 'Division by zero';
    }
    // Add apex type if available
    if (e.apexType) msg = e.apexType + ': ' + msg;
    return { output: debugOutput, error: msg, translated: null };
  }
}

export function checkAnswer(output, expectedOutput) {
  const norm = (arr) => arr.map(s => String(s).trim()).join('\n').trim();
  return norm(output) === norm(expectedOutput);
}
