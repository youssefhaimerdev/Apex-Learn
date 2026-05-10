// ─────────────────────────────────────────────────────────────────────────────
// APEXLEARN CURRICULUM v2.0 — 15 Modules · 60+ Lessons · Full Coverage
// ─────────────────────────────────────────────────────────────────────────────

export const CURRICULUM = [

// ═══════════════════════════════════════════════════════════
// MODULE 1 — APEX FOUNDATIONS
// ═══════════════════════════════════════════════════════════
{
  id: 'foundations', title: 'Apex Foundations', icon: '🏗️', color: '#00A1E0', xpTotal: 150,
  description: 'What Apex is, how it runs on Salesforce, your first debug statements, and the primitive types that power everything.',
  quizQuestions: [
    { q: 'What is the correct way to print output in Apex?', options: ['console.log("hi")', 'System.debug("hi")', 'print("hi")', 'Debug.log("hi")'], answer: 1 },
    { q: 'Which type should you use for monetary values in Apex?', options: ['Double', 'Float', 'Decimal', 'Integer'], answer: 2 },
    { q: 'Apex runs on:', options: ['Your local computer', 'A Docker container', 'Salesforce servers', 'AWS Lambda'], answer: 2 },
    { q: 'What is the minimum code coverage required to deploy to production?', options: ['50%', '60%', '75%', '100%'], answer: 2 },
    { q: 'Which of these is NOT a primitive type in Apex?', options: ['Integer', 'Boolean', 'Array', 'Decimal'], answer: 2 },
  ],
  lessons: [
    {
      id: 'what-is-apex', title: 'What is Apex?', xp: 10,
      theory: `## What is Apex?

Apex is Salesforce's proprietary, strongly-typed, object-oriented programming language. Think of it as **Java built specifically for the Salesforce cloud** — it runs entirely on Salesforce servers.

### Why Apex Exists

Standard Salesforce configuration (clicks, formulas, flows) handles 80% of business needs. Apex handles the other 20% — the complex, conditional, bulk-data logic that configuration can't express.

### Key Characteristics

**☁️ Cloud-native** — runs on Salesforce servers, no local setup needed

**🔒 Strongly-typed** — every variable must declare its type. This catches bugs at compile time.

**📦 Object-oriented** — supports classes, interfaces, inheritance (like Java/C#)

**🗄️ Database-first** — query and modify Salesforce records directly in code using SOQL

**🛡️ Governor Limits** — Salesforce is multi-tenant (thousands of companies share servers). Hard limits prevent any single org from hogging resources.

### What Apex Is Used For

| Use Case | Description |
|----------|-------------|
| Triggers | Auto-run code when records change |
| Classes | Business logic, utilities, services |
| Batch Jobs | Process millions of records async |
| REST/SOAP APIs | Expose Apex as a web service |
| HTTP Callouts | Call external APIs from Salesforce |
| Test Classes | Unit tests (mandatory!) |

### Your First Apex Statement

\`\`\`apex
System.debug('Hello, Salesforce!');
\`\`\`

\`System.debug()\` is your \`console.log()\`. Output appears in the Debug Log in Salesforce's Developer Console.`,
      codeExample: `// Single-line comment in Apex
/* Multi-line comment */

// Your first Apex statements
System.debug('Hello, Apex World!');
System.debug('2 + 2 = ' + (2 + 2));
System.debug('Running on Salesforce!');`,
      exercise: {
        title: 'Your First Debug',
        instructions: 'Debug exactly: `Hello, ApexLearn!`\n\nExpected output:\n```\nHello, ApexLearn!\n```',
        starterCode: `// Write your first Apex statement below\n`,
        expectedOutput: ['Hello, ApexLearn!'],
        hint: "System.debug('Hello, ApexLearn!'); — single quotes for strings!",
        solution: `System.debug('Hello, ApexLearn!');`,
      },
    },
    {
      id: 'variables-types', title: 'Variables & Data Types', xp: 20,
      theory: `## Variables & Data Types

Every variable in Apex has a declared type. The syntax is:

\`\`\`apex
DataType variableName = value;
\`\`\`

### Primitive Types

| Type | Description | Example |
|------|-------------|---------|
| \`Integer\` | Whole number (-2B to 2B) | \`Integer age = 25;\` |
| \`Long\` | Very large whole number | \`Long bigNum = 9999999999L;\` |
| \`Double\` | Floating-point | \`Double pi = 3.14159;\` |
| \`Decimal\` | Precise decimal — **use for money!** | \`Decimal price = 99.99;\` |
| \`String\` | Text in single quotes | \`String name = 'Alice';\` |
| \`Boolean\` | true or false | \`Boolean active = true;\` |
| \`Id\` | Salesforce record ID | \`Id recId = '001...';\` |
| \`Date\` | Calendar date | \`Date d = Date.today();\` |
| \`DateTime\` | Date + time | \`DateTime dt = DateTime.now();\` |
| \`Blob\` | Binary data | \`Blob b = Blob.valueOf('x');\` |

### Null Values

Unassigned variables are **null**. Calling a method on null throws \`NullPointerException\`.

\`\`\`apex
String name; // null!
System.debug(name); // prints: null
\`\`\`

### Constants (final)

\`\`\`apex
final Integer MAX_RECORDS = 200;
final String APP_NAME = 'MyApp';
// MAX_RECORDS = 300; // ❌ compile error!
\`\`\`

### Type Conversion

\`\`\`apex
Integer n = Integer.valueOf('42');   // String → Integer
String s = String.valueOf(100);      // Integer → String
Decimal d = Decimal.valueOf('19.99');// String → Decimal
Integer i = (Integer) 3.9;          // cast → 3 (truncates!)
\`\`\``,
      codeExample: `Integer score = 95;
String name = 'Alex';
Boolean isPassing = true;
Decimal gpa = 3.87;
final Integer MAX_SCORE = 100;

System.debug('Name: ' + name);
System.debug('Score: ' + score + '/' + MAX_SCORE);
System.debug('Passing: ' + isPassing);
System.debug('GPA: ' + gpa);`,
      exercise: {
        title: 'Declare & Debug',
        instructions: 'Declare `Integer age = 30` and `String city = \'London\'`, then debug each on its own line.\n\nExpected output:\n```\n30\nLondon\n```',
        starterCode: `// Declare and debug age and city\n`,
        expectedOutput: ['30', 'London'],
        hint: "Integer age = 30; System.debug(age); — repeat for city.",
        solution: `Integer age = 30;\nString city = 'London';\nSystem.debug(age);\nSystem.debug(city);`,
      },
    },
    {
      id: 'operators', title: 'Operators & Expressions', xp: 20,
      theory: `## Operators & Expressions

### Arithmetic

\`\`\`apex
Integer a = 10, b = 3;
System.debug(a + b);          // 13
System.debug(a - b);          // 7
System.debug(a * b);          // 30
System.debug(a / b);          // 3 ← integer division, truncates!
System.debug(Math.mod(a, b)); // 1 ← remainder (modulo)
\`\`\`

> ⚠️ Integer division truncates! Use \`Decimal\` for precise math: \`Decimal r = 10.0 / 3;\` → \`3.333...\`

### Comparison

\`\`\`apex
5 == 5   // true     5 != 3   // true
10 > 7   // true     10 >= 10 // true
3 < 5    // true     3 <= 2   // false
\`\`\`

### Logical

\`\`\`apex
true && false  // false — AND (both must be true)
true || false  // true  — OR  (at least one true)
!true          // false — NOT
\`\`\`

### Compound Assignment

\`\`\`apex
Integer x = 10;
x += 5;  // 15    x -= 3;  // 12
x *= 2;  // 24    x /= 4;  // 6
\`\`\`

### Operator Precedence

\`\`\`apex
// Multiplication before addition (same as math)
System.debug(2 + 3 * 4);   // 14, not 20
System.debug((2 + 3) * 4); // 20 — use parentheses!
\`\`\``,
      codeExample: `Integer x = 20, y = 6;
System.debug(x + y);          // 26
System.debug(x - y);          // 14
System.debug(x * y);          // 120
System.debug(x / y);          // 3
System.debug(Math.mod(x, y)); // 2

Boolean check = (x > 10) && (y < 10);
System.debug(check);           // true`,
      exercise: {
        title: 'Calculate Three Results',
        instructions: 'Given `a = 15` and `b = 4`, debug:\n1. Their sum\n2. Their product\n3. Remainder of a / b\n\nExpected output:\n```\n19\n60\n3\n```',
        starterCode: `Integer a = 15;\nInteger b = 4;\n// Debug sum, product, remainder\n`,
        expectedOutput: ['19', '60', '3'],
        hint: "Sum: a+b, Product: a*b, Remainder: Math.mod(a,b)",
        solution: `Integer a = 15;\nInteger b = 4;\nSystem.debug(a + b);\nSystem.debug(a * b);\nSystem.debug(Math.mod(a, b));`,
      },
    },
    {
      id: 'string-methods', title: 'String Methods', xp: 25,
      theory: `## String Methods

Strings in Apex are immutable — methods return a new string, not modify in place.

### Essential Methods

\`\`\`apex
String s = 'Hello, Salesforce!';

s.length()                  // 18 — character count
s.toUpperCase()             // 'HELLO, SALESFORCE!'
s.toLowerCase()             // 'hello, salesforce!'
s.trim()                    // removes leading/trailing spaces
s.contains('Sales')         // true
s.startsWith('Hello')       // true
s.endsWith('!')             // true
s.indexOf('Sales')          // 7 — position (0-based)
s.substring(7, 17)          // 'Salesforce'
s.replace('Hello', 'Hi')    // 'Hi, Salesforce!'
s.split(', ')               // ['Hello', 'Salesforce!']
s.charAt(0)                 // 'H'
s.equals('other')           // false — use this, NOT ==
s.equalsIgnoreCase('hello, salesforce!')  // true
\`\`\`

### Null-safe Checks

\`\`\`apex
String name = null;
Boolean isEmpty = String.isBlank(name);   // true (null or whitespace)
Boolean hasVal  = String.isNotBlank(name); // false
\`\`\`

### String Formatting

\`\`\`apex
// Concatenation
String first = 'John', last = 'Doe';
String full = first + ' ' + last; // 'John Doe'

// String.format (like printf)
String msg = String.format('Hello {0}, you have {1} messages',
    new List<Object>{'Alice', 5});
// 'Hello Alice, you have 5 messages'
\`\`\`

### Always use .equals() not == for string comparison!

\`\`\`apex
String a = 'hello';
String b = 'hello';
System.debug(a == b);         // might be unreliable
System.debug(a.equals(b));    // ✅ always correct
\`\`\``,
      codeExample: `String company = '  Salesforce Inc  ';
String trimmed = company.trim();
System.debug(trimmed.length());           // 14
System.debug(trimmed.toUpperCase());      // SALESFORCE INC
System.debug(trimmed.contains('force')); // true
System.debug(trimmed.substring(0, 10));  // Salesforce`,
      exercise: {
        title: 'String Transformation',
        instructions: "Given `String s = 'apex is awesome'`, debug its length, then debug it in UPPERCASE.\n\nExpected output:\n```\n15\nAPEX IS AWESOME\n```",
        starterCode: `String s = 'apex is awesome';\n// Debug length then uppercase\n`,
        expectedOutput: ['15', 'APEX IS AWESOME'],
        hint: "s.length() and s.toUpperCase()",
        solution: `String s = 'apex is awesome';\nSystem.debug(s.length());\nSystem.debug(s.toUpperCase());`,
      },
    },
    {
      id: 'math-class', title: 'The Math Class', xp: 15,
      theory: `## The Math Class

Apex's built-in \`Math\` class provides all mathematical operations.

### Common Methods

\`\`\`apex
Math.abs(-42)        // 42     — absolute value
Math.round(3.7)      // 4      — round to nearest integer
Math.floor(3.9)      // 3      — round DOWN
Math.ceil(3.1)       // 4      — round UP
Math.pow(2, 10)      // 1024.0 — power (returns Double)
Math.sqrt(144)       // 12.0   — square root
Math.max(5, 9)       // 9      — larger of two values
Math.min(5, 9)       // 5      — smaller of two values
Math.mod(17, 5)      // 2      — remainder
Math.random()        // 0.0–1.0 — random Double
\`\`\`

### Rounding Decimals

\`\`\`apex
Decimal price = 19.876;
Decimal rounded = price.setScale(2); // 19.88
System.debug(rounded);               // 19.88
\`\`\`

### Random Integer in Range

\`\`\`apex
// Random integer between 1 and 100
Integer rand = (Integer)(Math.random() * 100) + 1;
\`\`\`

### Real-World Example: Discount Calculator

\`\`\`apex
Decimal originalPrice = 249.99;
Decimal discountPct = 15;
Decimal discountAmount = (originalPrice * discountPct / 100).setScale(2);
Decimal finalPrice = (originalPrice - discountAmount).setScale(2);

System.debug('Discount: $' + discountAmount);  // $37.50
System.debug('Final price: $' + finalPrice);   // $212.49
\`\`\``,
      codeExample: `System.debug(Math.abs(-99));    // 99
System.debug(Math.round(4.6));  // 5
System.debug(Math.pow(3, 4));   // 81.0
System.debug(Math.sqrt(256));   // 16.0
System.debug(Math.max(42, 77)); // 77`,
      exercise: {
        title: 'Math Operations',
        instructions: "Debug:\n1. Absolute value of `-50`\n2. `2` to the power of `8`\n3. Square root of `81`\n\nExpected output:\n```\n50\n256.0\n9.0\n```",
        starterCode: `// Debug the three math results\n`,
        expectedOutput: ['50', '256.0', '9.0'],
        hint: "Math.abs(-50), Math.pow(2,8), Math.sqrt(81)",
        solution: `System.debug(Math.abs(-50));\nSystem.debug(Math.pow(2, 8));\nSystem.debug(Math.sqrt(81));`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 2 — CONTROL FLOW
// ═══════════════════════════════════════════════════════════
{
  id: 'control-flow', title: 'Control Flow', icon: '🔀', color: '#FF6B35', xpTotal: 220,
  description: 'Make decisions and repeat actions with conditionals, switches, and every type of loop.',
  quizQuestions: [
    { q: 'Which keyword exits a loop entirely?', options: ['exit', 'return', 'break', 'stop'], answer: 2 },
    { q: 'What does a ternary operator return if condition is false?', options: ['null', 'The first value', 'The second value', 'An error'], answer: 2 },
    { q: 'Which loop always executes at least once?', options: ['for', 'while', 'do-while', 'for-each'], answer: 2 },
    { q: 'In Apex switch statements, the default case keyword is:', options: ['default:', 'else:', 'when else', 'otherwise'], answer: 2 },
    { q: 'What does "continue" do inside a loop?', options: ['Exits the loop', 'Skips to next iteration', 'Pauses execution', 'Returns a value'], answer: 1 },
  ],
  lessons: [
    {
      id: 'if-else', title: 'If / Else Statements', xp: 25,
      theory: `## If / Else Statements

Conditionals let code take different paths based on whether conditions are true or false.

\`\`\`apex
if (condition) {
    // runs if TRUE
} else if (anotherCondition) {
    // runs if first false, this true
} else {
    // runs if ALL conditions false
}
\`\`\`

### Example: Grading System

\`\`\`apex
Integer score = 85;

if (score >= 90) {
    System.debug('Grade: A');
} else if (score >= 80) {
    System.debug('Grade: B');
} else if (score >= 70) {
    System.debug('Grade: C');
} else {
    System.debug('Grade: F — needs improvement');
}
// Grade: B
\`\`\`

### Null Checks — Critical in Apex!

Always check for null before calling methods:

\`\`\`apex
String email = null;
if (email != null && email.contains('@')) {
    System.debug('Valid email: ' + email);
} else {
    System.debug('Invalid or missing email');
}
\`\`\`

### Ternary Operator

One-liner for simple if/else:

\`\`\`apex
Integer age = 20;
String status = (age >= 18) ? 'Adult' : 'Minor';
System.debug(status); // Adult
\`\`\`

### Real-World: Account Tier

\`\`\`apex
Decimal revenue = 5_000_000; // underscores allowed for readability
String tier;

if      (revenue >= 10_000_000) tier = 'Enterprise';
else if (revenue >=  1_000_000) tier = 'Mid-Market';
else                             tier = 'SMB';

System.debug('Tier: ' + tier); // Mid-Market
\`\`\``,
      codeExample: `Integer temperature = 72;
String weather;

if (temperature > 85)      weather = 'Hot';
else if (temperature > 65) weather = 'Pleasant';
else if (temperature > 45) weather = 'Cool';
else                        weather = 'Cold';

System.debug('Weather: ' + weather); // Pleasant`,
      exercise: {
        title: 'Deal Size Classifier',
        instructions: 'Given `Integer dealSize = 75000`:\n- >= 100000 → debug `"Enterprise Deal"`\n- >= 50000 → debug `"Mid-Market Deal"`\n- else → debug `"SMB Deal"`\n\nExpected output:\n```\nMid-Market Deal\n```',
        starterCode: `Integer dealSize = 75000;\n// Your if/else here\n`,
        expectedOutput: ['Mid-Market Deal'],
        hint: "Check highest first: if (dealSize >= 100000) ... else if (dealSize >= 50000) ...",
        solution: `Integer dealSize = 75000;\nif (dealSize >= 100000) { System.debug('Enterprise Deal'); }\nelse if (dealSize >= 50000) { System.debug('Mid-Market Deal'); }\nelse { System.debug('SMB Deal'); }`,
      },
    },
    {
      id: 'switch', title: 'Switch Statements', xp: 20,
      theory: `## Switch Statements

When comparing one value against many possibilities, \`switch\` is cleaner than long \`if/else\` chains.

\`\`\`apex
switch on variable {
    when value1 {
        // code
    }
    when value2, value3 {
        // matches either
    }
    when else {
        // default
    }
}
\`\`\`

### Example: Lead Routing

\`\`\`apex
String leadSource = 'Web';

switch on leadSource {
    when 'Web' {
        System.debug('→ Digital Team');
    }
    when 'Phone', 'Cold Call' {
        System.debug('→ Inside Sales');
    }
    when 'Partner Referral' {
        System.debug('→ Channel Team');
    }
    when else {
        System.debug('→ General Queue');
    }
}
\`\`\`

### Switch on Integer

\`\`\`apex
Integer dayNum = 3;
switch on dayNum {
    when 1 { System.debug('Monday'); }
    when 2 { System.debug('Tuesday'); }
    when 3 { System.debug('Wednesday'); }
    when 4 { System.debug('Thursday'); }
    when 5 { System.debug('Friday'); }
    when else { System.debug('Weekend'); }
}
// Wednesday
\`\`\`

### Switch on SObject Type (Advanced)

\`\`\`apex
SObject record = new Account();
switch on record {
    when Account a { System.debug('Account: ' + a.Name); }
    when Contact c { System.debug('Contact: ' + c.LastName); }
    when else      { System.debug('Other object'); }
}
\`\`\``,
      codeExample: `String priority = 'High';
switch on priority {
    when 'Critical' { System.debug('Page on-call immediately'); }
    when 'High'     { System.debug('Escalate within 1 hour'); }
    when 'Medium'   { System.debug('Resolve within 4 hours'); }
    when 'Low'      { System.debug('Resolve within 24 hours'); }
    when else       { System.debug('Unknown priority'); }
}`,
      exercise: {
        title: 'Opportunity Stage Router',
        instructions: "Given `String stage = 'Closed Won'`, use switch to debug:\n- 'Closed Won' → `\"Book the revenue!\"`\n- 'Proposal/Price Quote' → `\"Follow up!\"`\n- 'Prospecting', 'Qualification' → `\"Nurture lead\"`\n- else → `\"Check CRM\"`\n\nExpected output:\n```\nBook the revenue!\n```",
        starterCode: `String stage = 'Closed Won';\n// Switch statement here\n`,
        expectedOutput: ['Book the revenue!'],
        hint: "when 'Closed Won' { System.debug('Book the revenue!'); }",
        solution: `String stage = 'Closed Won';\nswitch on stage {\n    when 'Closed Won' { System.debug('Book the revenue!'); }\n    when 'Proposal/Price Quote' { System.debug('Follow up!'); }\n    when 'Prospecting', 'Qualification' { System.debug('Nurture lead'); }\n    when else { System.debug('Check CRM'); }\n}`,
      },
    },
    {
      id: 'for-loops', title: 'For Loops', xp: 25,
      theory: `## For Loops

The traditional \`for\` loop gives you full control over iteration.

\`\`\`apex
// for (init; condition; increment)
for (Integer i = 0; i < 5; i++) {
    System.debug('i = ' + i);
}
// 0, 1, 2, 3, 4
\`\`\`

### Three Parts

1. **Init** — runs once: \`Integer i = 0\`
2. **Condition** — checked before each run: \`i < 5\`
3. **Increment** — runs after each iteration: \`i++\`

### Common Patterns

\`\`\`apex
// Count down
for (Integer i = 5; i > 0; i--) {
    System.debug(i);  // 5, 4, 3, 2, 1
}

// Step by 2
for (Integer i = 0; i <= 10; i += 2) {
    System.debug(i);  // 0, 2, 4, 6, 8, 10
}
\`\`\`

### Break and Continue

\`\`\`apex
// break — exit the loop entirely
for (Integer i = 0; i < 10; i++) {
    if (i == 5) break;
    System.debug(i);  // 0, 1, 2, 3, 4
}

// continue — skip this iteration, go to next
for (Integer i = 0; i < 5; i++) {
    if (i == 2) continue;
    System.debug(i);  // 0, 1, 3, 4
}
\`\`\`

### Nested Loops

\`\`\`apex
for (Integer i = 1; i <= 3; i++) {
    for (Integer j = 1; j <= 3; j++) {
        System.debug(i + ' × ' + j + ' = ' + (i * j));
    }
}
\`\`\``,
      codeExample: `// FizzBuzz — classic interview question in Apex
for (Integer i = 1; i <= 15; i++) {
    if (Math.mod(i, 15) == 0)      System.debug('FizzBuzz');
    else if (Math.mod(i, 3) == 0)  System.debug('Fizz');
    else if (Math.mod(i, 5) == 0)  System.debug('Buzz');
    else                           System.debug(i);
}`,
      exercise: {
        title: 'Sum of 1 to 5',
        instructions: 'Use a `for` loop to sum numbers 1 through 5, then debug the total.\n\nExpected output:\n```\n15\n```',
        starterCode: `Integer total = 0;\n// Loop from 1 to 5\nSystem.debug(total);\n`,
        expectedOutput: ['15'],
        hint: "for (Integer i = 1; i <= 5; i++) { total += i; }",
        solution: `Integer total = 0;\nfor (Integer i = 1; i <= 5; i++) { total += i; }\nSystem.debug(total);`,
      },
    },
    {
      id: 'while-loops', title: 'While & Do-While', xp: 20,
      theory: `## While & Do-While Loops

### While Loop

Repeats while a condition is true. Use when you don't know iterations upfront.

\`\`\`apex
Integer count = 0;
while (count < 5) {
    System.debug('Count: ' + count);
    count++;
}
\`\`\`

> ⚠️ Always ensure the condition eventually becomes false or you'll hit the **CPU governor limit** and get an exception!

### Do-While Loop

Runs the body **at least once**, then checks the condition.

\`\`\`apex
Integer x = 10;
do {
    System.debug('x = ' + x);
    x--;
} while (x > 8);
// x = 10, x = 9
\`\`\`

### When to Use Which

| Loop | Best For |
|------|----------|
| \`for\` | Known number of iterations |
| \`while\` | Unknown iterations, condition-based |
| \`do-while\` | Must run at least once (e.g., menus) |
| \`for-each\` | Iterating collections (next module!) |

### Retry Pattern (Real-World)

\`\`\`apex
Integer attempts = 0;
Boolean success = false;

while (!success && attempts < 3) {
    attempts++;
    System.debug('Attempt ' + attempts);
    if (attempts == 2) success = true;
}
System.debug('Done. Attempts: ' + attempts);
\`\`\``,
      codeExample: `// Find first power of 2 greater than 1000
Integer n = 1;
while (n <= 1000) {
    n *= 2;
}
System.debug(n); // 1024`,
      exercise: {
        title: 'Countdown',
        instructions: 'Use `while` to count down from 3 to 1, then debug `"Go!"`.\n\nExpected output:\n```\n3\n2\n1\nGo!\n```',
        starterCode: `Integer count = 3;\n// While loop here\nSystem.debug('Go!');\n`,
        expectedOutput: ['3', '2', '1', 'Go!'],
        hint: "while (count > 0) { System.debug(count); count--; }",
        solution: `Integer count = 3;\nwhile (count > 0) { System.debug(count); count--; }\nSystem.debug('Go!');`,
      },
    },
    {
      id: 'for-each', title: 'For-Each Loops', xp: 20,
      theory: `## For-Each Loops

The **for-each** loop (enhanced for loop) iterates directly over collections and lists — it's cleaner than a traditional for loop when you just need each element.

\`\`\`apex
for (ElementType element : collection) {
    // use element
}
\`\`\`

### Examples

\`\`\`apex
List<String> fruits = new List<String>{'Apple', 'Banana', 'Cherry'};

for (String fruit : fruits) {
    System.debug('Fruit: ' + fruit);
}
// Fruit: Apple
// Fruit: Banana
// Fruit: Cherry
\`\`\`

### With a Set

\`\`\`apex
Set<Integer> scores = new Set<Integer>{90, 85, 92, 88};
Integer total = 0;

for (Integer s : scores) {
    total += s;
}
System.debug('Total: ' + total); // 355
\`\`\`

### Iterating Salesforce Records

This is the most common pattern in real Apex code:

\`\`\`apex
List<Account> accounts = [SELECT Id, Name, Industry FROM Account LIMIT 50];

for (Account acc : accounts) {
    System.debug(acc.Name + ' — ' + acc.Industry);
}
\`\`\`

### Comparing Loop Types

\`\`\`apex
List<String> names = new List<String>{'Alice', 'Bob', 'Charlie'};

// Traditional for — use when you need the index
for (Integer i = 0; i < names.size(); i++) {
    System.debug(i + ': ' + names.get(i));
}

// For-each — cleaner, safer
for (String name : names) {
    System.debug(name);
}
\`\`\``,
      codeExample: `List<Integer> numbers = new List<Integer>{10, 20, 30, 40, 50};
Integer sum = 0;

for (Integer n : numbers) {
    sum += n;
}

System.debug('Sum: ' + sum);    // 150
System.debug('Count: ' + numbers.size()); // 5`,
      exercise: {
        title: 'Find the Max',
        instructions: "Loop through `{3, 7, 1, 9, 4}` and find the largest number, then debug it.\n\nExpected output:\n```\n9\n```",
        starterCode: `List<Integer> nums = new List<Integer>{3, 7, 1, 9, 4};\nInteger maxVal = 0;\n// Loop and find max\nSystem.debug(maxVal);\n`,
        expectedOutput: ['9'],
        hint: "Inside loop: if (n > maxVal) { maxVal = n; }",
        solution: `List<Integer> nums = new List<Integer>{3, 7, 1, 9, 4};\nInteger maxVal = 0;\nfor (Integer n : nums) { if (n > maxVal) maxVal = n; }\nSystem.debug(maxVal);`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 3 — COLLECTIONS
// ═══════════════════════════════════════════════════════════
{
  id: 'collections', title: 'Collections', icon: '📦', color: '#7B68EE', xpTotal: 280,
  description: 'Master Lists, Sets, and Maps — the backbone of bulk data processing in Apex.',
  quizQuestions: [
    { q: 'Which collection does NOT allow duplicates?', options: ['List', 'Set', 'Map', 'Array'], answer: 1 },
    { q: 'How do you add an element to a List?', options: ['.push()', '.append()', '.add()', '.insert()'], answer: 2 },
    { q: 'What does a Map store?', options: ['Ordered elements', 'Unique values only', 'Key-value pairs', 'Sorted integers'], answer: 2 },
    { q: 'List<Account> accounts = new Map<Id,Account>(records) — what does this shortcut do?', options: ['Sorts the list', 'Creates a map from Id to record', 'Counts records', 'Clones the list'], answer: 1 },
    { q: 'Which method checks if a Map has a given key?', options: ['.hasKey()', '.containsKey()', '.includesKey()', '.existsKey()'], answer: 1 },
  ],
  lessons: [
    {
      id: 'lists', title: 'Lists', xp: 30,
      theory: `## Lists

A **List** is an ordered, indexed collection. It's the most common collection in Apex — especially for SOQL results.

\`\`\`apex
List<Integer> scores = new List<Integer>();            // empty
List<String> names = new List<String>{'Al', 'Bob'};   // with values
\`\`\`

### Key Methods

\`\`\`apex
List<String> fruits = new List<String>{'Apple', 'Banana'};

fruits.add('Cherry');          // → ['Apple','Banana','Cherry']
fruits.add(0, 'Avocado');     // insert at index 0
fruits.remove(1);             // remove index 1 ('Apple')
fruits.set(0, 'Mango');       // replace at index 0
String f = fruits.get(0);     // get by index
Integer sz = fruits.size();   // count
Boolean has = fruits.contains('Cherry'); // true
fruits.sort();                // alphabetical sort
fruits.clear();               // empty the list

// Check before accessing!
if (!fruits.isEmpty()) {
    System.debug(fruits.get(0));
}
\`\`\`

### For-Each vs Index Loop

\`\`\`apex
List<Integer> nums = new List<Integer>{10, 20, 30};

// For-each (preferred for reading)
for (Integer n : nums) { System.debug(n); }

// Index loop (needed when modifying)
for (Integer i = 0; i < nums.size(); i++) {
    nums.set(i, nums.get(i) * 2); // double each
}
\`\`\`

### ⚠️ Governor Limit: 50,000 rows max from SOQL into a List

Always use LIMIT in queries!`,
      codeExample: `List<String> team = new List<String>{'Alice', 'Bob', 'Charlie'};
team.add('Diana');
team.remove(1); // removes Bob

System.debug('Size: ' + team.size()); // 3
for (String member : team) {
    System.debug('Member: ' + member);
}`,
      exercise: {
        title: 'List Builder',
        instructions: "Create `List<Integer>` with `{5, 10, 15}`, add `20`, then debug the size.\n\nExpected output:\n```\n4\n```",
        starterCode: `List<Integer> nums = new List<Integer>{5, 10, 15};\n// Add 20 then debug size\n`,
        expectedOutput: ['4'],
        hint: "nums.add(20); System.debug(nums.size());",
        solution: `List<Integer> nums = new List<Integer>{5, 10, 15};\nnums.add(20);\nSystem.debug(nums.size());`,
      },
    },
    {
      id: 'sets', title: 'Sets', xp: 25,
      theory: `## Sets

A **Set** stores **unique** values — duplicates are automatically ignored. Order is not guaranteed.

\`\`\`apex
Set<String> tags = new Set<String>{'apex', 'crm', 'apex'}; // only 2!
System.debug(tags.size()); // 2
\`\`\`

### Key Methods

\`\`\`apex
Set<Integer> ids = new Set<Integer>{1, 2, 3};

ids.add(4);                // add
ids.remove(1);             // remove
Boolean has = ids.contains(3); // true
Integer sz = ids.size();   // count
ids.clear();               // empty

// Instant deduplication from a List:
List<String> dupes = new List<String>{'a','b','a','c','b'};
Set<String> unique = new Set<String>(dupes);
System.debug(unique.size()); // 3
\`\`\`

### Real-World: Collecting Record IDs

This is the #1 use of Sets in Salesforce triggers:

\`\`\`apex
// Collect unique Account IDs from Opportunities
Set<Id> accountIds = new Set<Id>();
for (Opportunity opp : Trigger.new) {
    if (opp.AccountId != null) {
        accountIds.add(opp.AccountId);
    }
}
// Now query ALL related accounts in ONE query
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
\`\`\`

### Set Operations

\`\`\`apex
Set<Integer> a = new Set<Integer>{1, 2, 3, 4};
Set<Integer> b = new Set<Integer>{3, 4, 5, 6};

Set<Integer> union = a.clone(); union.addAll(b);        // {1,2,3,4,5,6}
Set<Integer> inter = a.clone(); inter.retainAll(b);     // {3,4}
Set<Integer> diff  = a.clone(); diff.removeAll(b);      // {1,2}
\`\`\``,
      codeExample: `Set<String> visited = new Set<String>();
visited.add('Home');
visited.add('Products');
visited.add('Home');   // duplicate — ignored
visited.add('Pricing');

System.debug('Pages visited: ' + visited.size()); // 3
System.debug('Visited Home: ' + visited.contains('Home')); // true`,
      exercise: {
        title: 'Deduplicate',
        instructions: "Convert `{'red','blue','red','green','blue','red'}` to a Set and debug its size.\n\nExpected output:\n```\n3\n```",
        starterCode: `List<String> colors = new List<String>{'red','blue','red','green','blue','red'};\n// Convert to Set and debug size\n`,
        expectedOutput: ['3'],
        hint: "Set<String> unique = new Set<String>(colors); System.debug(unique.size());",
        solution: `List<String> colors = new List<String>{'red','blue','red','green','blue','red'};\nSet<String> unique = new Set<String>(colors);\nSystem.debug(unique.size());`,
      },
    },
    {
      id: 'maps', title: 'Maps', xp: 35,
      theory: `## Maps

A **Map** stores key-value pairs. Keys are unique. Perfect for fast lookups without extra queries.

\`\`\`apex
Map<String, Integer> wordCount = new Map<String, Integer>{
    'apple' => 5,
    'banana' => 3
};
\`\`\`

### Key Methods

\`\`\`apex
Map<String, String> capitals = new Map<String, String>();

capitals.put('France', 'Paris');      // add/update
capitals.put('Japan', 'Tokyo');
capitals.remove('Japan');             // delete
String c = capitals.get('France');   // 'Paris'
Boolean has = capitals.containsKey('France'); // true
Integer sz = capitals.size();         // count
Set<String> keys = capitals.keySet(); // all keys
List<String> vals = capitals.values();// all values
capitals.clear();
\`\`\`

### Iterating

\`\`\`apex
Map<String, Integer> scores = new Map<String, Integer>{
    'Alice' => 95, 'Bob' => 87, 'Charlie' => 92
};

for (String name : scores.keySet()) {
    System.debug(name + ': ' + scores.get(name));
}
\`\`\`

### The Golden Pattern: Map<Id, SObject>

This is the most powerful pattern in Apex — create a Map from query results for O(1) lookup:

\`\`\`apex
// One query, instant lookup afterward
List<Account> accs = [SELECT Id, Name, Industry FROM Account WHERE Id IN :someIds];
Map<Id, Account> accMap = new Map<Id, Account>(accs);

// Later, get any account by ID instantly:
Account a = accMap.get(someId); // no extra query!
if (a != null) System.debug(a.Name);
\`\`\``,
      codeExample: `Map<String, Integer> inventory = new Map<String, Integer>{
    'Laptop' => 10, 'Mouse' => 50, 'Keyboard' => 30
};

inventory.put('Monitor', 15);
System.debug('Laptops: ' + inventory.get('Laptop')); // 10
System.debug('Items: ' + inventory.size());          // 4

for (String item : inventory.keySet()) {
    System.debug(item + ': ' + inventory.get(item));
}`,
      exercise: {
        title: 'Capital Lookup',
        instructions: "Build a Map with `'USA' => 'Washington D.C.'` and `'France' => 'Paris'`, then debug France's capital.\n\nExpected output:\n```\nParis\n```",
        starterCode: `Map<String, String> capitals = new Map<String, String>();\n// Add entries, debug France\n`,
        expectedOutput: ['Paris'],
        hint: "capitals.put('France', 'Paris'); System.debug(capitals.get('France'));",
        solution: `Map<String, String> capitals = new Map<String, String>();\ncapitals.put('USA', 'Washington D.C.');\ncapitals.put('France', 'Paris');\nSystem.debug(capitals.get('France'));`,
      },
    },
    {
      id: 'collection-sorting', title: 'Sorting & Utility Methods', xp: 25,
      theory: `## Sorting & Collection Utilities

### Sorting Lists

\`\`\`apex
List<Integer> nums = new List<Integer>{5, 2, 8, 1, 9, 3};
nums.sort(); // ascending by default
System.debug(nums); // (1, 2, 3, 5, 8, 9)

List<String> names = new List<String>{'Charlie','Alice','Bob'};
names.sort(); // alphabetical
System.debug(names); // (Alice, Bob, Charlie)
\`\`\`

### Clone

\`\`\`apex
List<Integer> original = new List<Integer>{1, 2, 3};
List<Integer> copy = original.clone();
copy.add(4);
System.debug(original.size()); // 3 — unaffected
System.debug(copy.size());     // 4
\`\`\`

### Converting Between Collections

\`\`\`apex
// List → Set (deduplicate)
List<String> dupes = new List<String>{'a','b','a'};
Set<String> unique = new Set<String>(dupes);

// Set → List (to sort or index)
List<String> sortable = new List<String>(unique);
sortable.sort();

// List → Map (by field — Salesforce pattern)
List<Account> accounts = [SELECT Id, Name FROM Account];
Map<Id, Account> accountMap = new Map<Id, Account>(accounts);
\`\`\`

### isEmpty() vs size() == 0

\`\`\`apex
List<String> lst = new List<String>();
System.debug(lst.isEmpty());    // true  — preferred
System.debug(lst.size() == 0);  // true  — also works
\`\`\`

### addAll() for Merging

\`\`\`apex
List<Integer> a = new List<Integer>{1, 2, 3};
List<Integer> b = new List<Integer>{4, 5, 6};
a.addAll(b);
System.debug(a); // (1, 2, 3, 4, 5, 6)
\`\`\``,
      codeExample: `List<Integer> scores = new List<Integer>{78, 92, 65, 88, 71, 95};
scores.sort();

System.debug('Lowest: ' + scores.get(0));
System.debug('Highest: ' + scores.get(scores.size() - 1));
System.debug('Count: ' + scores.size());`,
      exercise: {
        title: 'Sort and Find Minimum',
        instructions: "Sort `{44, 12, 99, 3, 67}` and debug the smallest value.\n\nExpected output:\n```\n3\n```",
        starterCode: `List<Integer> nums = new List<Integer>{44, 12, 99, 3, 67};\n// Sort and debug the smallest\n`,
        expectedOutput: ['3'],
        hint: "nums.sort(); System.debug(nums.get(0));",
        solution: `List<Integer> nums = new List<Integer>{44, 12, 99, 3, 67};\nnums.sort();\nSystem.debug(nums.get(0));`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 4 — METHODS & CLASSES
// ═══════════════════════════════════════════════════════════
{
  id: 'methods-classes', title: 'Methods & Classes', icon: '⚙️', color: '#00C9A7', xpTotal: 300,
  description: 'Write reusable methods, build your first classes, and understand static vs instance members.',
  quizQuestions: [
    { q: 'A static method can be called:', options: ['Only on an object instance', 'Without creating an object', 'Only inside a constructor', 'Only from triggers'], answer: 1 },
    { q: 'What keyword initializes parent class in a constructor?', options: ['parent()', 'base()', 'super()', 'this.init()'], answer: 2 },
    { q: 'Which access modifier makes a member only visible within its class?', options: ['public', 'protected', 'private', 'global'], answer: 2 },
    { q: 'A class with no constructor defined gets:', options: ['A compile error', 'A default no-argument constructor', 'A null constructor', 'Nothing — it fails'], answer: 1 },
    { q: 'What does "this" refer to inside an instance method?', options: ['The calling class', 'The current object instance', 'The parent class', 'The Apex runtime'], answer: 1 },
  ],
  lessons: [
    {
      id: 'methods', title: 'Methods', xp: 30,
      theory: `## Methods

A **method** is a named, reusable block of code that performs a specific task.

\`\`\`apex
accessModifier returnType methodName(paramType paramName) {
    // code
    return value; // if returnType is not void
}
\`\`\`

### Static Methods

Called on the class itself — no object needed:

\`\`\`apex
public class MathUtils {
    public static Integer add(Integer a, Integer b) {
        return a + b;
    }

    public static Boolean isEven(Integer n) {
        return Math.mod(n, 2) == 0;
    }
}

// Usage:
Integer result = MathUtils.add(5, 3);   // 8
Boolean check = MathUtils.isEven(10);   // true
\`\`\`

### Void Methods

Methods that do something but return nothing:

\`\`\`apex
public static void printGreeting(String name) {
    System.debug('Hello, ' + name + '!');
}
// printGreeting('World'); → Hello, World!
\`\`\`

### Method Overloading

Multiple methods with the same name but different parameters:

\`\`\`apex
public static String greet(String name) {
    return 'Hello, ' + name + '!';
}
public static String greet(String name, String lang) {
    if (lang == 'Spanish') return '¡Hola, ' + name + '!';
    return 'Hello, ' + name + '!';
}
// Both are valid — Apex picks based on arguments
\`\`\`

### Return Early

\`\`\`apex
public static Integer safeDivide(Integer a, Integer b) {
    if (b == 0) return 0; // early return
    return a / b;
}
\`\`\``,
      codeExample: `public class StringUtils {
    public static String reverse(String s) {
        String result = '';
        for (Integer i = s.length() - 1; i >= 0; i--) {
            result += s.charAt(i);
        }
        return result;
    }
    public static Boolean isPalindrome(String s) {
        String lower = s.toLowerCase();
        return lower.equals(reverse(lower));
    }
}

System.debug(StringUtils.reverse('Apex'));       // xepA
System.debug(StringUtils.isPalindrome('racecar')); // true`,
      exercise: {
        title: 'Write a Max Method',
        instructions: "Create a static method `max` that takes two Integers and returns the larger one. Call it with `(12, 7)` and debug the result.\n\nExpected output:\n```\n12\n```",
        starterCode: `public class MathHelper {\n    public static Integer max(Integer a, Integer b) {\n        // Return the larger value\n    }\n}\n\nSystem.debug(MathHelper.max(12, 7));\n`,
        expectedOutput: ['12'],
        hint: "return (a > b) ? a : b;",
        solution: `public class MathHelper {\n    public static Integer max(Integer a, Integer b) {\n        return (a > b) ? a : b;\n    }\n}\nSystem.debug(MathHelper.max(12, 7));`,
      },
    },
    {
      id: 'classes-objects', title: 'Classes & Objects', xp: 35,
      theory: `## Classes & Objects

A **class** is a blueprint. An **object** is an instance of that blueprint. This is the core of OOP.

\`\`\`apex
public class Car {
    // Properties (instance variables)
    public String make;
    public String model;
    public Integer year;
    private Integer mileage = 0;

    // Constructor
    public Car(String make, String model, Integer year) {
        this.make = make;     // 'this' = this specific object
        this.model = model;
        this.year = year;
    }

    // Instance method
    public String getInfo() {
        return year + ' ' + make + ' ' + model;
    }

    // Method that changes state
    public void drive(Integer miles) {
        mileage += miles;
    }

    public Integer getMileage() { return mileage; }
}
\`\`\`

### Creating Objects

\`\`\`apex
Car myCar = new Car('Toyota', 'Camry', 2023);
System.debug(myCar.getInfo()); // 2023 Toyota Camry

myCar.drive(150);
myCar.drive(300);
System.debug(myCar.getMileage()); // 450
\`\`\`

### Access Modifiers

| Modifier | Visible From |
|----------|-------------|
| \`public\` | Anywhere in your org |
| \`private\` | Only inside this class |
| \`protected\` | This class + subclasses |
| \`global\` | Anywhere + managed packages |

### Multiple Constructors

\`\`\`apex
public class Account {
    public String name;
    public String industry;

    public Account(String name) {
        this(name, 'Other'); // call sibling constructor
    }

    public Account(String name, String industry) {
        this.name = name;
        this.industry = industry;
    }
}
\`\`\``,
      codeExample: `public class BankAccount {
    public String owner;
    private Decimal balance;

    public BankAccount(String owner, Decimal initial) {
        this.owner = owner;
        this.balance = initial;
    }
    public void deposit(Decimal amount) { balance += amount; }
    public void withdraw(Decimal amount) {
        if (amount > balance) {
            System.debug('Insufficient funds!');
            return;
        }
        balance -= amount;
    }
    public Decimal getBalance() { return balance; }
}

BankAccount acc = new BankAccount('Alice', 1000);
acc.deposit(500);
acc.withdraw(200);
System.debug('Balance: ' + acc.getBalance()); // 1300`,
      exercise: {
        title: 'Build a Product Class',
        instructions: "Create class `Product` with `name` (String) and `price` (Decimal). Constructor sets both. Create `Product('Widget', 29.99)` and debug its name.\n\nExpected output:\n```\nWidget\n```",
        starterCode: `public class Product {\n    public String name;\n    public Decimal price;\n    // Constructor here\n}\nProduct p = new Product('Widget', 29.99);\nSystem.debug(p.name);\n`,
        expectedOutput: ['Widget'],
        hint: "public Product(String name, Decimal price) { this.name = name; this.price = price; }",
        solution: `public class Product {\n    public String name;\n    public Decimal price;\n    public Product(String name, Decimal price) { this.name = name; this.price = price; }\n}\nProduct p = new Product('Widget', 29.99);\nSystem.debug(p.name);`,
      },
    },
    {
      id: 'static-members', title: 'Static vs Instance Members', xp: 25,
      theory: `## Static vs Instance Members

### The Key Difference

**Static** members belong to the **class** — shared by all. Call them on the class name.

**Instance** members belong to each **object** — each object has its own copy. Call them on the object.

\`\`\`apex
public class Counter {
    // STATIC — one shared counter for all Counter objects
    public static Integer totalCreated = 0;

    // INSTANCE — each Counter has its own count
    public Integer count = 0;

    public Counter() {
        totalCreated++; // increment class-level counter
    }

    public void increment() { count++; }
    public Integer getCount() { return count; }

    // Static utility method
    public static Integer getTotal() { return totalCreated; }
}

Counter c1 = new Counter(); c1.increment(); c1.increment();
Counter c2 = new Counter(); c2.increment();

System.debug(c1.getCount());        // 2
System.debug(c2.getCount());        // 1
System.debug(Counter.getTotal());   // 2 (static — shared)
\`\`\`

### When to Use Static

- Utility/helper methods that don't need object state
- Constants shared across all instances
- Factory methods (create and return objects)
- Tracking class-level state

\`\`\`apex
public class Config {
    public static final String API_VERSION = 'v52.0';
    public static final Integer BATCH_SIZE = 200;

    // Factory method
    public static Config create() { return new Config(); }
}

System.debug(Config.API_VERSION); // v52.0
\`\`\`

### The Singleton Pattern (Preview)

\`\`\`apex
public class AppSettings {
    private static AppSettings instance;
    public String theme = 'dark';

    private AppSettings() {} // private constructor!

    public static AppSettings getInstance() {
        if (instance == null) instance = new AppSettings();
        return instance;
    }
}
\`\`\``,
      codeExample: `public class Temperature {
    public static final Decimal ABSOLUTE_ZERO = -273.15;

    public Decimal celsius;

    public Temperature(Decimal c) { this.celsius = c; }

    public Decimal toFahrenheit() {
        return (celsius * 9/5) + 32;
    }

    public static Boolean isAbsoluteZero(Decimal c) {
        return c == ABSOLUTE_ZERO;
    }
}

Temperature t = new Temperature(100);
System.debug(t.toFahrenheit()); // 212
System.debug(Temperature.ABSOLUTE_ZERO); // -273.15`,
      exercise: {
        title: 'Static Counter',
        instructions: "Create class `Widget` with a `static Integer count = 0`. Each constructor increments count. Create 3 Widget instances. Debug `Widget.count`.\n\nExpected output:\n```\n3\n```",
        starterCode: `public class Widget {\n    public static Integer count = 0;\n    public Widget() {\n        // Increment count\n    }\n}\nnew Widget(); new Widget(); new Widget();\nSystem.debug(Widget.count);\n`,
        expectedOutput: ['3'],
        hint: "Inside constructor: count++;",
        solution: `public class Widget {\n    public static Integer count = 0;\n    public Widget() { count++; }\n}\nnew Widget(); new Widget(); new Widget();\nSystem.debug(Widget.count);`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 5 — OBJECT-ORIENTED PROGRAMMING
// ═══════════════════════════════════════════════════════════
{
  id: 'oop', title: 'Object-Oriented Programming', icon: '🏛️', color: '#FF6B81', xpTotal: 320,
  description: 'Inheritance, abstract classes, interfaces, and polymorphism — OOP done right.',
  quizQuestions: [
    { q: 'Which keyword allows a method to be overridden in a subclass?', options: ['abstract', 'override', 'virtual', 'extends'], answer: 2 },
    { q: 'An abstract class:', options: ['Cannot have any methods', 'Cannot be instantiated directly', 'Must implement all methods', 'Can only have static methods'], answer: 1 },
    { q: 'A class can implement:', options: ['Only one interface', 'Multiple interfaces', 'Only abstract classes', 'No interfaces'], answer: 1 },
    { q: 'Which keyword calls the parent class constructor?', options: ['parent()', 'base()', 'super()', 'inherit()'], answer: 2 },
    { q: 'Polymorphism means:', options: ['A class has many properties', 'A method can take different forms', 'An object can be in multiple states', 'A class can extend multiple classes'], answer: 1 },
  ],
  lessons: [
    {
      id: 'inheritance', title: 'Inheritance', xp: 40,
      theory: `## Inheritance

Inheritance lets a **child class** reuse and extend a **parent class**. Use \`extends\`.

\`\`\`apex
public virtual class Animal {
    public String name;

    public Animal(String name) {
        this.name = name;
    }

    public virtual String speak() {
        return 'Some generic sound';
    }

    public String describe() {
        return name + ' says: ' + speak();
    }
}

public class Dog extends Animal {
    public String breed;

    public Dog(String name, String breed) {
        super(name); // MUST call parent constructor
        this.breed = breed;
    }

    public override String speak() { // override parent method
        return 'Woof!';
    }
}

public class Cat extends Animal {
    public Cat(String name) { super(name); }
    public override String speak() { return 'Meow!'; }
}

Dog d = new Dog('Rex', 'Labrador');
Cat c = new Cat('Whiskers');

System.debug(d.describe()); // Rex says: Woof!
System.debug(c.describe()); // Whiskers says: Meow!
\`\`\`

### Key Keywords

| Keyword | Purpose |
|---------|---------|
| \`extends\` | Inherit from a class |
| \`virtual\` | Method CAN be overridden |
| \`override\` | Overriding parent method |
| \`super\` | Call parent constructor/method |
| \`abstract\` | Must be implemented by subclass |

### Call Parent Method

\`\`\`apex
public override String speak() {
    return super.speak() + ' and also Woof!';
}
\`\`\``,
      codeExample: `public virtual class Shape {
    public String color;
    public Shape(String color) { this.color = color; }
    public virtual Decimal area() { return 0; }
    public String describe() {
        return color + ' shape with area: ' + area();
    }
}

public class Circle extends Shape {
    public Decimal radius;
    public Circle(String color, Decimal r) {
        super(color);
        radius = r;
    }
    public override Decimal area() {
        return 3.14159 * radius * radius;
    }
}

Circle c = new Circle('Red', 5);
System.debug(c.describe()); // Red shape with area: 78.53975`,
      exercise: {
        title: 'Rectangle Class',
        instructions: "Create `Rectangle extends Shape` (use above Shape class). Takes color, width, height. `area()` returns width*height. Create Rectangle with color='Blue', width=6, height=4. Debug its area.\n\nExpected output:\n```\n24\n```",
        starterCode: `public virtual class Shape {\n    public String color;\n    public Shape(String color) { this.color = color; }\n    public virtual Decimal area() { return 0; }\n}\n\npublic class Rectangle extends Shape {\n    public Decimal width, height;\n    // Constructor and area() override here\n}\n\nRectangle r = new Rectangle('Blue', 6, 4);\nSystem.debug(r.area());\n`,
        expectedOutput: ['24'],
        hint: "public Rectangle(String c, Decimal w, Decimal h) { super(c); width=w; height=h; } — override area() returns width*height",
        solution: `public virtual class Shape {\n    public String color;\n    public Shape(String color) { this.color = color; }\n    public virtual Decimal area() { return 0; }\n}\npublic class Rectangle extends Shape {\n    public Decimal width, height;\n    public Rectangle(String c, Decimal w, Decimal h) { super(c); width=w; height=h; }\n    public override Decimal area() { return width * height; }\n}\nRectangle r = new Rectangle('Blue', 6, 4);\nSystem.debug(r.area());`,
      },
    },
    {
      id: 'abstract-classes', title: 'Abstract Classes', xp: 35,
      theory: `## Abstract Classes

An **abstract class** cannot be instantiated directly. It exists to be extended. Abstract methods **must** be implemented by subclasses.

\`\`\`apex
public abstract class Discount {
    protected Decimal originalPrice;

    public Discount(Decimal price) {
        this.originalPrice = price;
    }

    // Must be implemented by subclasses
    public abstract Decimal getDiscountAmount();

    // Shared (non-abstract) method
    public Decimal getFinalPrice() {
        return originalPrice - getDiscountAmount();
    }
}

public class PercentDiscount extends Discount {
    private Decimal pct;
    public PercentDiscount(Decimal price, Decimal pct) {
        super(price);
        this.pct = pct;
    }
    public override Decimal getDiscountAmount() {
        return (originalPrice * pct / 100).setScale(2);
    }
}

public class FlatDiscount extends Discount {
    private Decimal amount;
    public FlatDiscount(Decimal price, Decimal amount) {
        super(price);
        this.amount = amount;
    }
    public override Decimal getDiscountAmount() {
        return amount;
    }
}

// Discount d = new Discount(100); // ❌ ERROR — can't instantiate abstract!
Discount pct  = new PercentDiscount(200, 20); // 20% off
Discount flat = new FlatDiscount(200, 30);    // $30 off

System.debug('Percent final: $' + pct.getFinalPrice());  // $160.00
System.debug('Flat final: $' + flat.getFinalPrice());    // $170.00
\`\`\`

### Abstract vs Virtual

| | \`abstract\` method | \`virtual\` method |
|-|---|---|
| Parent has body? | ❌ No | ✅ Yes |
| Subclass must override? | ✅ Yes | ❌ Optional |
| Class can be instantiated? | ❌ Never | ✅ If not abstract |`,
      codeExample: `public abstract class Report {
    public String title;
    public Report(String t) { title = t; }
    public abstract List<String> getData();
    public void render() {
        System.debug('=== ' + title + ' ===');
        for (String row : getData()) {
            System.debug(row);
        }
    }
}

public class SalesReport extends Report {
    public SalesReport() { super('Sales Report'); }
    public override List<String> getData() {
        return new List<String>{'Q1: $100k','Q2: $120k','Q3: $95k'};
    }
}

new SalesReport().render();`,
      exercise: {
        title: 'Abstract Area',
        instructions: "Create abstract class `Polygon` with abstract method `perimeter()`. Extend it with `Square` (side length). Square's perimeter is `side * 4`. Create Square(5) and debug perimeter.\n\nExpected output:\n```\n20\n```",
        starterCode: `public abstract class Polygon {\n    public abstract Decimal perimeter();\n}\npublic class Square extends Polygon {\n    public Decimal side;\n    public Square(Decimal side) { this.side = side; }\n    // Override perimeter()\n}\nSquare s = new Square(5);\nSystem.debug(s.perimeter());\n`,
        expectedOutput: ['20'],
        hint: "public override Decimal perimeter() { return side * 4; }",
        solution: `public abstract class Polygon {\n    public abstract Decimal perimeter();\n}\npublic class Square extends Polygon {\n    public Decimal side;\n    public Square(Decimal side) { this.side = side; }\n    public override Decimal perimeter() { return side * 4; }\n}\nSquare s = new Square(5);\nSystem.debug(s.perimeter());`,
      },
    },
    {
      id: 'interfaces', title: 'Interfaces', xp: 40,
      theory: `## Interfaces

An **interface** defines a contract — a set of method signatures that implementing classes must fulfill. Interfaces enable true polymorphism.

\`\`\`apex
public interface Serializable {
    String toJSON();
    String toCSV();
}

public interface Auditable {
    String getCreatedBy();
    DateTime getCreatedAt();
}

// A class can implement MULTIPLE interfaces
public class Contact implements Serializable, Auditable {
    public String name, email;
    private String createdBy;
    private DateTime createdAt;

    public Contact(String name, String email) {
        this.name = name;
        this.email = email;
        this.createdBy = UserInfo.getName();
        this.createdAt = DateTime.now();
    }

    public String toJSON() {
        return '{"name":"' + name + '","email":"' + email + '"}';
    }
    public String toCSV() { return name + ',' + email; }
    public String getCreatedBy() { return createdBy; }
    public DateTime getCreatedAt() { return createdAt; }
}
\`\`\`

### Interface vs Abstract Class

| | Interface | Abstract Class |
|-|-----------|----------------|
| Has method bodies? | ❌ No | ✅ Can |
| Multiple inheritance? | ✅ Yes (implements many) | ❌ No (extends one) |
| Has properties? | ❌ No | ✅ Yes |
| Instantiable? | ❌ No | ❌ No |

### Real-World: Trigger Handler Interface

\`\`\`apex
public interface ITriggerHandler {
    void beforeInsert(List<SObject> newList);
    void beforeUpdate(List<SObject> newList, Map<Id,SObject> oldMap);
    void afterInsert(List<SObject> newList, Map<Id,SObject> newMap);
}

public class AccountTriggerHandler implements ITriggerHandler {
    public void beforeInsert(List<SObject> newList) { /* ... */ }
    public void beforeUpdate(List<SObject> newList, Map<Id,SObject> oldMap) { /* ... */ }
    public void afterInsert(List<SObject> newList, Map<Id,SObject> newMap) { /* ... */ }
}
\`\`\``,
      codeExample: `public interface Printable {
    String format();
}

public class Invoice implements Printable {
    public Integer invoiceNum;
    public Decimal amount;
    public Invoice(Integer n, Decimal amt) { invoiceNum = n; amount = amt; }
    public String format() {
        return 'INV-' + invoiceNum + ': $' + amount;
    }
}

public class Receipt implements Printable {
    public String store;
    public Decimal total;
    public Receipt(String s, Decimal t) { store = s; total = t; }
    public String format() { return store + ' — Total: $' + total; }
}

List<Printable> docs = new List<Printable>{
    new Invoice(1001, 299.99),
    new Receipt('Starbucks', 6.75)
};
for (Printable doc : docs) {
    System.debug(doc.format());
}`,
      exercise: {
        title: 'Implement an Interface',
        instructions: "Implement `Greetable` interface (has `greet()` returning String) in class `FrenchGreeter`. `greet()` returns `'Bonjour!'`. Debug its output.\n\nExpected output:\n```\nBonjour!\n```",
        starterCode: `public interface Greetable {\n    String greet();\n}\npublic class FrenchGreeter implements Greetable {\n    // Implement greet()\n}\nFrenchGreeter g = new FrenchGreeter();\nSystem.debug(g.greet());\n`,
        expectedOutput: ['Bonjour!'],
        hint: "public String greet() { return 'Bonjour!'; }",
        solution: `public interface Greetable {\n    String greet();\n}\npublic class FrenchGreeter implements Greetable {\n    public String greet() { return 'Bonjour!'; }\n}\nFrenchGreeter g = new FrenchGreeter();\nSystem.debug(g.greet());`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 6 — SOQL
// ═══════════════════════════════════════════════════════════
{
  id: 'soql', title: 'SOQL — Querying Data', icon: '🗄️', color: '#FFD700', xpTotal: 300,
  description: 'Query Salesforce records with SOQL — filters, relationships, aggregates, and dynamic queries.',
  quizQuestions: [
    { q: 'What is the maximum SOQL queries allowed per transaction?', options: ['50', '75', '100', '200'], answer: 2 },
    { q: 'Which keyword is used to inject an Apex variable into a SOQL query?', options: ['@', '$', ':', '#'], answer: 2 },
    { q: 'To query child records in the same query, you use:', options: ['A JOIN clause', 'A subquery in SELECT', 'A second query', 'UNION'], answer: 1 },
    { q: 'What does COUNT() return in SOQL?', options: ['A List of records', 'An Integer', 'A Boolean', 'A Map'], answer: 1 },
    { q: 'Dynamic SOQL is built using:', options: ['SQL.query()', 'Database.query()', 'SOQL.run()', 'Apex.query()'], answer: 1 },
  ],
  lessons: [
    {
      id: 'soql-basics', title: 'SOQL Basics', xp: 30,
      theory: `## SOQL — Salesforce Object Query Language

SOQL reads data from Salesforce. Syntax is similar to SQL but Salesforce-specific.

\`\`\`apex
List<Account> results = [SELECT Id, Name, Phone FROM Account WHERE ... LIMIT 100];
\`\`\`

### Core Clauses

\`\`\`apex
[SELECT field1, field2, ...   // Required: what fields to return
 FROM ObjectName               // Required: which object
 WHERE condition               // Filter records
 ORDER BY field ASC|DESC       // Sort results
 LIMIT n                       // Max records to return
 OFFSET n]                     // Skip first n records (pagination)
\`\`\`

### WHERE Operators

\`\`\`apex
// Comparison
[SELECT Name FROM Account WHERE AnnualRevenue > 1000000]
[SELECT Name FROM Account WHERE Industry != 'Technology']
[SELECT Name FROM Contact WHERE Email != null]

// LIKE — % is wildcard
[SELECT Name FROM Account WHERE Name LIKE 'Acme%']   // starts with
[SELECT Name FROM Account WHERE Name LIKE '%Corp']   // ends with
[SELECT Name FROM Account WHERE Name LIKE '%Tech%']  // contains

// IN / NOT IN
[SELECT Name FROM Account WHERE Industry IN ('Technology', 'Finance')]
[SELECT Name FROM Contact WHERE AccountId NOT IN :excludedIds]

// Boolean
[SELECT Name FROM Lead WHERE IsConverted = false AND Rating = 'Hot']
\`\`\`

### Bind Variables (:)

Always use bind variables — never concatenate strings into queries (SOQL injection!):

\`\`\`apex
String industry = 'Technology';
Integer minRevenue = 1000000;

List<Account> result = [
    SELECT Id, Name
    FROM Account
    WHERE Industry = :industry
    AND AnnualRevenue > :minRevenue
    ORDER BY Name
    LIMIT 50
];
\`\`\`

### ⚠️ NEVER query inside a loop — will hit the 100 SOQL limit!`,
      codeExample: `// Pattern: query → process → (DML if needed)
String targetIndustry = 'Technology';
List<Account> techAccounts = [
    SELECT Id, Name, AnnualRevenue, Phone
    FROM Account
    WHERE Industry = :targetIndustry
    AND AnnualRevenue != null
    ORDER BY AnnualRevenue DESC
    LIMIT 10
];

System.debug('Found: ' + techAccounts.size());
for (Account a : techAccounts) {
    System.debug(a.Name + ': $' + a.AnnualRevenue);
}`,
      exercise: {
        title: 'SOQL Structure',
        instructions: "Debug `'SOQL ready'` after writing a comment with a SOQL query that selects `Name` and `Email` from `Contact` where `Email != null` ordered by `LastName` limited to 10.\n\nExpected output:\n```\nSOQL ready\n```",
        starterCode: `// [SELECT Name, Email FROM Contact WHERE Email != null ORDER BY LastName LIMIT 10]\nSystem.debug('SOQL ready');\n`,
        expectedOutput: ['SOQL ready'],
        hint: "The query is already written in the comment — just run it!",
        solution: `// [SELECT Name, Email FROM Contact WHERE Email != null ORDER BY LastName LIMIT 10]\nSystem.debug('SOQL ready');`,
      },
    },
    {
      id: 'soql-relationships', title: 'Relationship Queries', xp: 35,
      theory: `## Relationship Queries

### Child-to-Parent (Dot Notation)

Traverse parent relationships using dot notation in SELECT:

\`\`\`apex
// Contact → Account (parent)
List<Contact> contacts = [
    SELECT Id, Name,
           Account.Name,        // parent field
           Account.Industry,
           Account.Owner.Name   // grandparent!
    FROM Contact
    WHERE Account.Industry = 'Technology'
];

for (Contact c : contacts) {
    System.debug(c.Name + ' works at ' + c.Account.Name);
}
\`\`\`

### Parent-to-Child (Subquery)

Query child records in a subquery using the child relationship name:

\`\`\`apex
// Account → Contacts (children)
List<Account> accounts = [
    SELECT Id, Name,
        (SELECT Id, FirstName, LastName, Email
         FROM Contacts          // ← relationship name (plural)
         WHERE Email != null
         ORDER BY LastName)
    FROM Account
    WHERE Id IN :accountIds
];

for (Account acc : accounts) {
    System.debug('Account: ' + acc.Name);
    for (Contact c : acc.Contacts) {
        System.debug('  Contact: ' + c.FirstName + ' ' + c.LastName);
    }
}
\`\`\`

### Common Relationship Names

| Object | Parent | Child |
|--------|--------|-------|
| Contact | Account | Contacts |
| Opportunity | Account | Opportunities |
| Case | Account | Cases |
| Task | Who/What | ActivityHistories |

### Custom Relationships

For custom objects, use the \`__r\` suffix:

\`\`\`apex
[SELECT Name, Project__r.Name FROM Task__c]
\`\`\``,
      codeExample: `// Parent-to-child query pattern
List<Account> accsWithCases = [
    SELECT Name,
        (SELECT Subject, Status, Priority
         FROM Cases
         WHERE Status != 'Closed'
         ORDER BY Priority)
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Case WHERE Status != 'Closed')
    LIMIT 20
];

for (Account a : accsWithCases) {
    System.debug(a.Name + ' has ' + a.Cases.size() + ' open cases');
}`,
      exercise: {
        title: 'Relationship Understanding',
        instructions: "Debug the two SOQL relationship directions:\n1. `'Child to Parent: dot notation'`\n2. `'Parent to Child: subquery'`\n\nExpected output:\n```\nChild to Parent: dot notation\nParent to Child: subquery\n```",
        starterCode: `// Debug the two relationship directions\n`,
        expectedOutput: ['Child to Parent: dot notation', 'Parent to Child: subquery'],
        hint: "Two System.debug calls with the strings.",
        solution: `System.debug('Child to Parent: dot notation');\nSystem.debug('Parent to Child: subquery');`,
      },
    },
    {
      id: 'soql-aggregate', title: 'Aggregate Functions', xp: 30,
      theory: `## Aggregate Functions

SOQL supports aggregate functions for summarizing data — great for dashboards.

\`\`\`apex
// COUNT — total records
Integer total = [SELECT COUNT() FROM Account WHERE Industry = 'Technology'];
System.debug('Tech accounts: ' + total);

// COUNT, SUM, AVG, MAX, MIN with GROUP BY
AggregateResult[] grouped = [
    SELECT Industry,
           COUNT(Id) recordCount,
           SUM(AnnualRevenue) totalRevenue,
           AVG(AnnualRevenue) avgRevenue,
           MAX(AnnualRevenue) maxRevenue
    FROM Account
    WHERE Industry != null
    GROUP BY Industry
    HAVING COUNT(Id) > 5
    ORDER BY COUNT(Id) DESC
];

for (AggregateResult ar : grouped) {
    String industry = (String) ar.get('Industry');
    Integer cnt = (Integer) ar.get('recordCount');
    Decimal totalRev = (Decimal) ar.get('totalRevenue');
    System.debug(industry + ': ' + cnt + ' accounts, $' + totalRev);
}
\`\`\`

### Key Aggregate Functions

| Function | Returns |
|----------|---------|
| \`COUNT()\` | Integer — total rows |
| \`COUNT(field)\` | Integer — non-null values |
| \`SUM(field)\` | Total |
| \`AVG(field)\` | Average |
| \`MAX(field)\` | Largest value |
| \`MIN(field)\` | Smallest value |

### AggregateResult.get()

Access results by alias (or auto-generated name \`expr0\`, \`expr1\`, etc.):

\`\`\`apex
AggregateResult ar = [SELECT COUNT(Id) total FROM Account];
Integer cnt = (Integer) ar.get('total'); // use alias
\`\`\``,
      codeExample: `// Count opportunities by stage
AggregateResult[] stageSummary = [
    SELECT StageName,
           COUNT(Id) count,
           SUM(Amount) totalAmount
    FROM Opportunity
    WHERE CloseDate = THIS_YEAR
    GROUP BY StageName
    ORDER BY SUM(Amount) DESC
];

for (AggregateResult row : stageSummary) {
    System.debug(row.get('StageName') + ': ' +
        row.get('count') + ' deals, $' + row.get('totalAmount'));
}`,
      exercise: {
        title: 'Aggregate Knowledge',
        instructions: "Debug the 5 aggregate function names in order:\n```\nCOUNT\nSUM\nAVG\nMAX\nMIN\n```",
        starterCode: `// Debug the 5 SOQL aggregate function names\n`,
        expectedOutput: ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'],
        hint: "Five System.debug calls",
        solution: `System.debug('COUNT');\nSystem.debug('SUM');\nSystem.debug('AVG');\nSystem.debug('MAX');\nSystem.debug('MIN');`,
      },
    },
    {
      id: 'dynamic-soql', title: 'Dynamic SOQL', xp: 35,
      theory: `## Dynamic SOQL

Static SOQL (inside brackets \`[]\`) is compiled at save time. Dynamic SOQL builds query strings at runtime using \`Database.query()\`.

\`\`\`apex
// Static SOQL — compiled and validated at save time
List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 10];

// Dynamic SOQL — string built at runtime
String query = 'SELECT Id, Name FROM Account';
query += ' WHERE Industry = \'Technology\'';
query += ' LIMIT 10';
List<Account> dynAccounts = Database.query(query);
\`\`\`

### When to Use Dynamic SOQL

- Variable field lists (user picks what to show)
- Optional WHERE clauses
- Runtime object type determination

\`\`\`apex
public List<SObject> searchRecords(String objectName, String searchTerm, List<String> fields) {
    String fieldList = String.join(fields, ', ');
    String query = 'SELECT ' + fieldList +
                   ' FROM ' + objectName +
                   ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchTerm) + '%\'' +
                   ' LIMIT 50';
    return Database.query(query);
}
\`\`\`

### ⚠️ SOQL Injection Prevention

**Always** use \`String.escapeSingleQuotes()\` when inserting user input:

\`\`\`apex
// ❌ VULNERABLE
String query = 'SELECT Id FROM Account WHERE Name = \\'' + userInput + '\\'';

// ✅ SAFE
String safe = String.escapeSingleQuotes(userInput);
String query = 'SELECT Id FROM Account WHERE Name = \\'' + safe + '\\'';
\`\`\``,
      codeExample: `// Dynamic query builder
String obj = 'Account';
String filter = 'Technology';
String query = 'SELECT Id, Name, Industry ' +
               'FROM ' + obj + ' ' +
               'WHERE Industry = \'' +
               String.escapeSingleQuotes(filter) + '\' ' +
               'ORDER BY Name LIMIT 20';

System.debug('Query: ' + query);
// List<SObject> results = Database.query(query); // real org only`,
      exercise: {
        title: 'Dynamic SOQL Method',
        instructions: "Debug the method name used to run dynamic SOQL queries.\n\nExpected output:\n```\nDatabase.query\n```",
        starterCode: `// Debug the dynamic SOQL method name\n`,
        expectedOutput: ['Database.query'],
        hint: "System.debug('Database.query');",
        solution: `System.debug('Database.query');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 7 — DML OPERATIONS
// ═══════════════════════════════════════════════════════════
{
  id: 'dml', title: 'DML Operations', icon: '✍️', color: '#2ED573', xpTotal: 250,
  description: 'Create, update, delete, and merge Salesforce records with DML. Master the bulk-safe patterns.',
  quizQuestions: [
    { q: 'How many DML statements are allowed per transaction?', options: ['100', '150', '200', '250'], answer: 1 },
    { q: 'Which DML operation inserts if no match, updates if found?', options: ['merge', 'update', 'upsert', 'sync'], answer: 2 },
    { q: 'What is a savepoint used for?', options: ['Saving a file', 'Rolling back DML to a prior state', 'Committing a transaction', 'Creating a backup'], answer: 1 },
    { q: 'Database.insert with allOrNone=false:', options: ['Throws error on any failure', 'Allows partial success', 'Only inserts first record', 'Prevents all inserts'], answer: 1 },
    { q: 'After an insert, when is the record ID available?', options: ['Never', 'Before the insert', 'Immediately after the insert', 'Only after a query'], answer: 2 },
  ],
  lessons: [
    {
      id: 'dml-basics', title: 'Insert, Update & Delete', xp: 35,
      theory: `## DML — Data Manipulation Language

DML statements change records in Salesforce's database.

### The 5 DML Statements

\`\`\`apex
// INSERT — creates new records (ID auto-assigned)
Account acc = new Account(Name = 'ACME', Industry = 'Technology');
insert acc;
System.debug('New ID: ' + acc.Id); // ID is populated after insert!

// UPDATE — modifies existing records (must have Id)
acc.Phone = '555-1234';
acc.AnnualRevenue = 5000000;
update acc;

// DELETE — moves to Recycle Bin
delete acc;

// UNDELETE — restores from Recycle Bin
undelete acc;

// UPSERT — insert if new, update if exists
acc.External_ID__c = 'EXT-001';
upsert acc Account.External_ID__c; // field used to match
\`\`\`

### Bulk DML — ALWAYS preferred

One DML for many records — uses only 1 of your 150 DML limit:

\`\`\`apex
// ✅ One DML for 200 records
List<Contact> contacts = new List<Contact>();
for (Integer i = 1; i <= 200; i++) {
    contacts.add(new Contact(
        LastName = 'User ' + i,
        AccountId = parentAccountId
    ));
}
insert contacts; // ONE statement!

// ❌ NEVER do this — 200 DML statements!
for (Contact c : someList) {
    insert c; // hits limit fast!
}
\`\`\`

### ID Availability After DML

\`\`\`apex
Account a = new Account(Name = 'Test');
System.debug(a.Id); // null — not saved yet
insert a;
System.debug(a.Id); // 0015...xxxx — populated!
\`\`\``,
      codeExample: `// Pattern: build list → bulk DML
List<Account> toCreate = new List<Account>{
    new Account(Name = 'Alpha LLC', Industry = 'Finance'),
    new Account(Name = 'Beta Corp', Industry = 'Technology'),
    new Account(Name = 'Gamma Inc', Industry = 'Healthcare')
};

insert toCreate;
System.debug('Inserted: ' + toCreate.size());
// Update all to add a description
for (Account a : toCreate) {
    a.Description = 'Bulk created on ' + Date.today();
}
update toCreate;
System.debug('Updated: ' + toCreate.size());`,
      exercise: {
        title: 'DML Sequence',
        instructions: "Debug the correct DML operation for each:\n1. Creating new records → `\"insert\"`\n2. Modifying existing records → `\"update\"`\n3. Removing records → `\"delete\"`\n\nExpected output:\n```\ninsert\nupdate\ndelete\n```",
        starterCode: `// Debug the three DML operations in order\n`,
        expectedOutput: ['insert', 'update', 'delete'],
        hint: "Three System.debug calls",
        solution: `System.debug('insert');\nSystem.debug('update');\nSystem.debug('delete');`,
      },
    },
    {
      id: 'database-methods', title: 'Database Methods & Savepoints', xp: 35,
      theory: `## Database Methods

Standard DML throws exceptions on **any** failure. \`Database\` methods give you more control.

### Database.insert() with Partial Success

\`\`\`apex
List<Account> accounts = new List<Account>{
    new Account(Name = 'Valid Account'),
    new Account(), // ❌ Missing required Name field
    new Account(Name = 'Another Valid')
};

// allOrNone = false → allows partial success
List<Database.SaveResult> results = Database.insert(accounts, false);

for (Integer i = 0; i < results.size(); i++) {
    Database.SaveResult sr = results[i];
    if (sr.isSuccess()) {
        System.debug('✅ Inserted: ' + sr.getId());
    } else {
        for (Database.Error e : sr.getErrors()) {
            System.debug('❌ Row ' + i + ': ' + e.getMessage());
            System.debug('   Fields: ' + e.getFields());
        }
    }
}
\`\`\`

### Database.UpsertResult

\`\`\`apex
List<Database.UpsertResult> upsertResults =
    Database.upsert(records, ExternalId__c, false);

for (Database.UpsertResult ur : upsertResults) {
    if (ur.isSuccess()) {
        System.debug(ur.isCreated() ? 'Inserted' : 'Updated');
        System.debug('ID: ' + ur.getId());
    }
}
\`\`\`

### Savepoints — Transaction Control

\`\`\`apex
Savepoint sp = Database.setSavepoint();

try {
    insert account1;
    insert account2; // if this fails...
    insert contact;
} catch (Exception e) {
    Database.rollback(sp); // ...roll back everything to sp
    System.debug('Rolled back: ' + e.getMessage());
}
\`\`\``,
      codeExample: `// Safe bulk insert with error handling
List<Contact> contacts = new List<Contact>{
    new Contact(LastName = 'Smith', Email = 'smith@test.com'),
    new Contact(),  // will fail — no LastName
    new Contact(LastName = 'Jones', Email = 'jones@test.com')
};

List<Database.SaveResult> results = Database.insert(contacts, false);
Integer success = 0, failed = 0;

for (Database.SaveResult sr : results) {
    if (sr.isSuccess()) success++;
    else failed++;
}
System.debug('Success: ' + success + ', Failed: ' + failed);`,
      exercise: {
        title: 'Savepoint Method',
        instructions: "Debug the two key Database methods for transaction rollback:\n1. `\"Database.setSavepoint\"`\n2. `\"Database.rollback\"`\n\nExpected output:\n```\nDatabase.setSavepoint\nDatabase.rollback\n```",
        starterCode: `// Debug the two savepoint-related methods\n`,
        expectedOutput: ['Database.setSavepoint', 'Database.rollback'],
        hint: "Two System.debug calls",
        solution: `System.debug('Database.setSavepoint');\nSystem.debug('Database.rollback');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 8 — APEX TRIGGERS
// ═══════════════════════════════════════════════════════════
{
  id: 'triggers', title: 'Apex Triggers', icon: '⚡', color: '#FF4757', xpTotal: 320,
  description: 'Automatically execute Apex when records change. Master context variables, patterns, and best practices.',
  quizQuestions: [
    { q: 'How many triggers should you have per Salesforce object?', options: ['As many as needed', 'One', 'Two (before/after)', 'Three max'], answer: 1 },
    { q: 'Trigger.new in a before insert trigger contains:', options: ['Old record versions', 'Records with IDs already set', 'New records not yet saved', 'A Map of records'], answer: 2 },
    { q: 'You can modify Trigger.new records in:', options: ['After triggers only', 'Before triggers only', 'Both before and after', 'Neither'], answer: 1 },
    { q: 'Which is the correct place to put business logic in the trigger handler pattern?', options: ['Directly in the trigger', 'In a separate handler class', 'In a flow', 'In a workflow'], answer: 1 },
    { q: 'Trigger.oldMap provides:', options: ['A list of new records', 'A Map<Id, SObject> of records before the change', 'A count of changed records', 'A boolean per record'], answer: 1 },
  ],
  lessons: [
    {
      id: 'trigger-basics', title: 'Trigger Basics', xp: 35,
      theory: `## Apex Triggers

A trigger automatically executes Apex code when a Salesforce record event occurs.

### Trigger Syntax

\`\`\`apex
trigger TriggerName on ObjectName (event1, event2) {
    // code
}
\`\`\`

### Trigger Events

| Event | Fires When |
|-------|-----------|
| \`before insert\` | Before new record saved |
| \`after insert\` | After new record saved (ID available) |
| \`before update\` | Before existing record saved |
| \`after update\` | After existing record saved |
| \`before delete\` | Before record deleted |
| \`after delete\` | After record deleted |
| \`after undelete\` | After record restored |

### Context Variables

\`\`\`apex
trigger AccountTrigger on Account (before insert, before update, after insert) {

    Trigger.new        // List<SObject> — new/updated records
    Trigger.old        // List<SObject> — old versions (update/delete)
    Trigger.newMap     // Map<Id, SObject> — new records by ID
    Trigger.oldMap     // Map<Id, SObject> — old records by ID

    Trigger.isInsert   // Boolean
    Trigger.isUpdate   // Boolean
    Trigger.isDelete   // Boolean
    Trigger.isBefore   // Boolean
    Trigger.isAfter    // Boolean
    Trigger.size       // Integer — # records in batch
}
\`\`\`

### Simple Trigger: Auto-fill Field

\`\`\`apex
trigger AccountTrigger on Account (before insert) {
    for (Account acc : Trigger.new) {
        // Set default phone if missing
        if (acc.Phone == null) {
            acc.Phone = 'TBD';
        }
        // before trigger — can modify Trigger.new directly!
        acc.Description = 'Created: ' + System.now();
    }
}
\`\`\`

### ⚠️ NEVER modify Trigger.new in an after trigger!`,
      codeExample: `// Before update — detect field changes
trigger OpportunityTrigger on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);

        // Stage changed to Closed Won
        if (opp.StageName == 'Closed Won' &&
            oldOpp.StageName != 'Closed Won') {
            opp.CloseDate = Date.today(); // auto-set close date
        }

        // Amount increased
        if (opp.Amount > oldOpp.Amount) {
            opp.Description = 'Amount increased from $' +
                oldOpp.Amount + ' to $' + opp.Amount;
        }
    }
}`,
      exercise: {
        title: 'Trigger Context Variables',
        instructions: "Debug the names of the 4 main trigger context variables:\n```\nTrigger.new\nTrigger.old\nTrigger.newMap\nTrigger.oldMap\n```",
        starterCode: `// Debug the four main trigger context variables\n`,
        expectedOutput: ['Trigger.new', 'Trigger.old', 'Trigger.newMap', 'Trigger.oldMap'],
        hint: "Four System.debug calls",
        solution: `System.debug('Trigger.new');\nSystem.debug('Trigger.old');\nSystem.debug('Trigger.newMap');\nSystem.debug('Trigger.oldMap');`,
      },
    },
    {
      id: 'trigger-handler', title: 'Trigger Handler Pattern', xp: 45,
      theory: `## The Trigger Handler Pattern

Professional Salesforce developers never put logic directly in triggers. They delegate to **handler classes**. Here's why and how.

### Why Handlers?

- Triggers can't be unit tested as cleanly
- Logic in triggers is harder to reuse
- Multiple developers editing one trigger = merge conflicts
- Handlers can implement interfaces for consistency

### The Pattern

\`\`\`apex
// Trigger — thin, just dispatches
trigger AccountTrigger on Account (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    handler.run();
}
\`\`\`

\`\`\`apex
// Handler class — all logic lives here
public class AccountTriggerHandler {
    private List<Account> newList    = Trigger.new;
    private List<Account> oldList    = Trigger.old;
    private Map<Id, Account> newMap  = Trigger.newMap;
    private Map<Id, Account> oldMap  = Trigger.oldMap;

    public void run() {
        if (Trigger.isBefore) {
            if (Trigger.isInsert) beforeInsert();
            if (Trigger.isUpdate) beforeUpdate();
        }
        if (Trigger.isAfter) {
            if (Trigger.isInsert) afterInsert();
            if (Trigger.isUpdate) afterUpdate();
        }
    }

    private void beforeInsert() {
        // Set defaults, validate, auto-fill
        for (Account acc : newList) {
            if (String.isBlank(acc.Phone)) {
                acc.Phone = 'TBD';
            }
        }
    }

    private void afterInsert() {
        // Create related records, send notifications
        sendWelcomeNotification(newMap.keySet());
    }

    private void beforeUpdate() {
        // Detect changes, enforce rules
        for (Account acc : newList) {
            Account old = oldMap.get(acc.Id);
            if (acc.AnnualRevenue != old.AnnualRevenue) {
                recalculateTier(acc);
            }
        }
    }

    private void afterUpdate() { /* ... */ }

    private void sendWelcomeNotification(Set<Id> ids) { /* ... */ }
    private void recalculateTier(Account acc) { /* ... */ }
}
\`\`\`

### The Golden Rules

1. **One trigger per object** — never multiple triggers on one SObject
2. **Zero logic in triggers** — everything in the handler
3. **Always bulkify** — write for 200 records, not 1
4. **No SOQL/DML inside loops** — use maps, do it outside
5. **Handle both insert and update** where logic applies`,
      codeExample: `// Trigger Handler best practice template
public class ContactTriggerHandler {

    public void beforeInsert(List<Contact> contacts) {
        // Collect Account IDs first (no SOQL here yet)
        Set<Id> accountIds = new Set<Id>();
        for (Contact c : contacts) {
            if (c.AccountId != null) accountIds.add(c.AccountId);
        }

        // ONE query outside the loop
        Map<Id, Account> accounts = new Map<Id, Account>(
            [SELECT Id, Industry FROM Account WHERE Id IN :accountIds]
        );

        // Process all records
        for (Contact c : contacts) {
            if (c.AccountId != null) {
                Account acc = accounts.get(c.AccountId);
                if (acc != null) c.Department = acc.Industry;
            }
        }
    }
}`,
      exercise: {
        title: 'Handler Pattern Steps',
        instructions: "Debug the correct order of the handler pattern:\n1. `\"1. One trigger per object\"`\n2. `\"2. Logic in handler class\"`\n3. `\"3. Bulkify for 200 records\"`\n\nExpected output:\n```\n1. One trigger per object\n2. Logic in handler class\n3. Bulkify for 200 records\n```",
        starterCode: `// Debug the three handler pattern rules\n`,
        expectedOutput: ['1. One trigger per object', '2. Logic in handler class', '3. Bulkify for 200 records'],
        hint: "Three System.debug calls with the numbered strings",
        solution: `System.debug('1. One trigger per object');\nSystem.debug('2. Logic in handler class');\nSystem.debug('3. Bulkify for 200 records');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 9 — GOVERNOR LIMITS
// ═══════════════════════════════════════════════════════════
{
  id: 'governor-limits', title: 'Governor Limits', icon: '🛡️', color: '#FFA502', xpTotal: 220,
  description: 'Understand Salesforce\'s limits, write bulkified code, and never hit a governor limit in production.',
  quizQuestions: [
    { q: 'Max SOQL queries per synchronous transaction?', options: ['50', '75', '100', '200'], answer: 2 },
    { q: 'Max DML rows per transaction?', options: ['1,000', '5,000', '10,000', '50,000'], answer: 2 },
    { q: 'What method checks remaining SOQL queries?', options: ['Limits.getQueries()', 'Apex.getSOQL()', 'Governor.queries()', 'System.soqlCount()'], answer: 0 },
    { q: 'CPU time limit for synchronous Apex is:', options: ['5 seconds', '10 seconds', '30 seconds', '60 seconds'], answer: 1 },
    { q: 'Triggers fire in batches of up to how many records?', options: ['50', '100', '200', '500'], answer: 2 },
  ],
  lessons: [
    {
      id: 'limits-overview', title: 'Understanding Limits', xp: 30,
      theory: `## Governor Limits

Apex runs in a **multi-tenant environment** — thousands of companies share the same Salesforce servers. Governor limits ensure no single org starves others.

### Key Limits Per Transaction

| Resource | Sync | Async |
|----------|------|-------|
| SOQL queries | **100** | **200** |
| DML statements | **150** | **150** |
| DML rows | **10,000** | **10,000** |
| CPU time | **10,000ms** | **60,000ms** |
| Heap size | **6 MB** | **12 MB** |
| Callouts | **100** | **100** |
| Future calls | **50** | — |
| SOQL rows returned | **50,000** | **50,000** |

### Check Limits Programmatically

\`\`\`apex
// How many queries have I used vs. how many I have left?
System.debug('SOQL used: '  + Limits.getQueries()         + ' / ' + Limits.getLimitQueries());
System.debug('DML used: '   + Limits.getDmlStatements()   + ' / ' + Limits.getLimitDmlStatements());
System.debug('DML rows: '   + Limits.getDmlRows()         + ' / ' + Limits.getLimitDmlRows());
System.debug('CPU time: '   + Limits.getCpuTime()         + 'ms / ' + Limits.getLimitCpuTime() + 'ms');
System.debug('Heap: '       + Limits.getHeapSize()        + ' / ' + Limits.getLimitHeapSize());
\`\`\`

### When You Hit a Limit

Apex throws a \`System.LimitException\` that **cannot be caught**. The entire transaction rolls back.

\`\`\`
System.LimitException: Too many SOQL queries: 101
\`\`\`

This is the most feared error in Salesforce dev — so design for limits from day one!`,
      codeExample: `// Good practice: guard clauses before expensive operations
public static void processRecords(List<Account> accounts) {
    // Check before querying
    if (Limits.getQueries() >= Limits.getLimitQueries() - 5) {
        System.debug('WARNING: Low on SOQL queries!');
        return;
    }

    System.debug('SOQL remaining: ' +
        (Limits.getLimitQueries() - Limits.getQueries()));

    // ... do work
}`,
      exercise: {
        title: 'Core Limits',
        instructions: "Debug the 3 most critical limit numbers:\n1. Max SOQL queries: `100`\n2. Max DML statements: `150`\n3. Max DML rows: `10000`\n\nExpected output:\n```\n100\n150\n10000\n```",
        starterCode: `// Debug the three most important limits\n`,
        expectedOutput: ['100', '150', '10000'],
        hint: "System.debug(100); System.debug(150); System.debug(10000);",
        solution: `System.debug(100);\nSystem.debug(150);\nSystem.debug(10000);`,
      },
    },
    {
      id: 'bulkification', title: 'Bulkification Patterns', xp: 40,
      theory: `## Bulkification

Triggers fire in batches of **up to 200 records**. Your code must handle all 200 correctly — not just 1.

### The #1 Anti-Pattern: SOQL in a Loop

\`\`\`apex
// ❌ DESTROYS LIMITS — 200 queries for 200 records
for (Opportunity opp : Trigger.new) {
    Account acc = [SELECT Name FROM Account WHERE Id = :opp.AccountId]; // 1 query × 200!
    opp.Description = acc.Name;
}

// ✅ CORRECT — 1 query for all 200 records
Set<Id> accountIds = new Set<Id>();
for (Opportunity opp : Trigger.new) {
    accountIds.add(opp.AccountId);
}

Map<Id, Account> accounts = new Map<Id, Account>(
    [SELECT Id, Name FROM Account WHERE Id IN :accountIds] // 1 query!
);

for (Opportunity opp : Trigger.new) {
    Account acc = accounts.get(opp.AccountId);
    if (acc != null) opp.Description = acc.Name;
}
\`\`\`

### The #2 Anti-Pattern: DML in a Loop

\`\`\`apex
// ❌ 200 DML statements!
for (Contact c : contacts) {
    c.Department = 'Sales';
    update c; // DML inside loop!
}

// ✅ 1 DML statement
for (Contact c : contacts) {
    c.Department = 'Sales';
}
update contacts; // ONE bulk DML
\`\`\`

### The Bulkification Template

\`\`\`apex
// Step 1: Collect data from trigger records
Set<Id> relatedIds = new Set<Id>();
for (SObject record : Trigger.new) {
    relatedIds.add((Id) record.get('RelatedId__c'));
}

// Step 2: ONE query outside the loop
Map<Id, RelatedObject__c> relatedMap = new Map<Id, RelatedObject__c>(
    [SELECT Id, Field1, Field2 FROM RelatedObject__c WHERE Id IN :relatedIds]
);

// Step 3: Process all records, no more queries
List<SObject> toUpdate = new List<SObject>();
for (SObject record : Trigger.new) {
    RelatedObject__c rel = relatedMap.get((Id) record.get('RelatedId__c'));
    if (rel != null) {
        record.put('Description__c', rel.Field1);
        toUpdate.add(record);
    }
}

// Step 4: ONE DML at the end
if (!toUpdate.isEmpty()) update toUpdate;
\`\`\``,
      codeExample: `// SOQL in a loop (bad) vs. outside loop (good)
List<String> names = new List<String>{'Alice', 'Bob', 'Charlie'};

// Bad pattern example (conceptual — don't do this!)
// for (String n : names) {
//     List<Contact> c = [SELECT Id FROM Contact WHERE Name = :n]; // BAD!
// }

// Good pattern: collect → query once → process
Set<String> nameSet = new Set<String>(names);
// List<Contact> allContacts = [SELECT Id, Name FROM Contact WHERE Name IN :nameSet]; // ONE query

System.debug('Pattern: Collect IDs first, then ONE query');
System.debug('Never SOQL inside a loop');`,
      exercise: {
        title: 'Bulkification Mantra',
        instructions: "Debug the two rules of bulkification:\n1. `\"Never SOQL inside a loop\"`\n2. `\"Never DML inside a loop\"`\n\nExpected output:\n```\nNever SOQL inside a loop\nNever DML inside a loop\n```",
        starterCode: `// Debug the two golden bulkification rules\n`,
        expectedOutput: ['Never SOQL inside a loop', 'Never DML inside a loop'],
        hint: "Two System.debug calls with the rule strings",
        solution: `System.debug('Never SOQL inside a loop');\nSystem.debug('Never DML inside a loop');`,
      },
    },
  ],
},
];
