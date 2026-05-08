export const CURRICULUM = [
  {
    id: 'foundations',
    title: 'Apex Foundations',
    icon: '🏗️',
    color: '#00A1E0',
    xpTotal: 150,
    description: 'What Apex is, how it works, and your first lines of code.',
    lessons: [
      {
        id: 'what-is-apex',
        title: 'What is Apex?',
        xp: 10,
        theory: `
## What is Apex?

Apex is Salesforce's proprietary, strongly-typed, object-oriented programming language. Think of it as **Java for the Salesforce cloud** — it runs entirely on Salesforce servers, not on your computer.

### Key Characteristics

**☁️ Cloud-hosted** — Your code lives and runs on Salesforce servers. No local setup required once you have a Developer Org.

**🔒 Strongly-typed** — Every variable must have a declared type (\`Integer\`, \`String\`, etc.). This catches bugs at compile time.

**📦 Object-oriented** — Apex supports classes, interfaces, and inheritance, just like Java or C#.

**🗄️ Database-integrated** — You can query and manipulate Salesforce records directly in code using **SOQL** (Salesforce Object Query Language).

**🛡️ Governor Limits** — Apex runs in a multi-tenant environment (shared with thousands of other companies). To protect everyone, Salesforce enforces hard limits on queries, DML operations, CPU time, and more.

### What is Apex Used For?

- **Triggers** — Automatically run code when records are created, updated, or deleted
- **Classes** — Business logic, utility methods, helper code
- **REST/SOAP Services** — Expose Apex as a web service
- **Batch Jobs** — Process millions of records asynchronously
- **Test Classes** — Unit tests (mandatory — 75%+ code coverage required!)
- **HTTP Callouts** — Call external APIs from Salesforce

### The Developer Console

Salesforce has a built-in **Developer Console** (Setup → Developer Console) where you can write and run Apex code anonymously. The \`System.debug()\` method prints output to the Debug Log — that's your \`console.log()\`.

\`\`\`apex
System.debug('Hello, Salesforce!');
\`\`\`
        `,
        codeExample: `// This is an Apex comment
// System.debug() is your best friend for testing

String greeting = 'Hello, Apex World!';
System.debug(greeting);

// You can also debug expressions directly
System.debug('2 + 2 = ' + (2 + 2));`,
        exercise: {
          title: 'Your First Debug Statement',
          instructions: 'Write a \`System.debug()\` statement that outputs exactly: **Hello, ApexLearn!**',
          starterCode: `// Write your code below\n`,
          expectedOutput: ['Hello, ApexLearn!'],
          hint: "Use System.debug() with a string. Strings in Apex use single quotes: 'like this'",
          solution: `System.debug('Hello, ApexLearn!');`,
        },
      },
      {
        id: 'variables-types',
        title: 'Variables & Data Types',
        xp: 20,
        theory: `
## Variables & Data Types

In Apex, every variable has a **type** that tells Salesforce what kind of data it holds. You declare a variable like this:

\`\`\`apex
DataType variableName = value;
\`\`\`

### Primitive Types

| Type | Description | Example |
|------|-------------|---------|
| \`Integer\` | Whole numbers (-2B to 2B) | \`Integer age = 25;\` |
| \`Long\` | Very large whole numbers | \`Long bigNum = 9999999999L;\` |
| \`Double\` | Floating-point numbers | \`Double pi = 3.14159;\` |
| \`Decimal\` | Precise decimals (use for money!) | \`Decimal price = 99.99;\` |
| \`String\` | Text in single quotes | \`String name = 'Alice';\` |
| \`Boolean\` | true or false | \`Boolean isActive = true;\` |
| \`Id\` | Salesforce record ID (18 chars) | \`Id acctId = '001...';\` |
| \`Date\` | Calendar date | \`Date d = Date.today();\` |
| \`DateTime\` | Date + time | \`DateTime dt = DateTime.now();\` |

### Null Values

Any variable that hasn't been assigned a value is **null**. Always check for null before using a variable to avoid \`NullPointerException\`.

\`\`\`apex
String name; // This is null!
System.debug(name); // Outputs: null
\`\`\`

### String Concatenation

Use \`+\` to join strings together:

\`\`\`apex
String first = 'John';
String last = 'Doe';
String full = first + ' ' + last;
System.debug(full); // John Doe
\`\`\`

### Type Conversion

\`\`\`apex
Integer num = Integer.valueOf('42'); // String → Integer
String s = String.valueOf(100);      // Integer → String
Decimal d = Decimal.valueOf('19.99'); // String → Decimal
\`\`\`
        `,
        codeExample: `Integer score = 95;
String name = 'Alex';
Boolean isPassing = true;
Decimal gpa = 3.87;

System.debug('Name: ' + name);
System.debug('Score: ' + score);
System.debug('Passing: ' + isPassing);
System.debug('GPA: ' + gpa);`,
        exercise: {
          title: 'Variable Declaration',
          instructions: "Declare an `Integer` named `age` with value **30**, a `String` named `city` with value **'London'**, and debug both on separate lines. Output should be:\n```\n30\nLondon\n```",
          starterCode: `// Declare your variables here\n\n// Debug them\n`,
          expectedOutput: ['30', 'London'],
          hint: "Integer age = 30;  then System.debug(age); — same pattern for city.",
          solution: `Integer age = 30;\nString city = 'London';\nSystem.debug(age);\nSystem.debug(city);`,
        },
      },
      {
        id: 'operators',
        title: 'Operators & Expressions',
        xp: 20,
        theory: `
## Operators & Expressions

### Arithmetic Operators

\`\`\`apex
Integer a = 10, b = 3;

System.debug(a + b);  // 13 — Addition
System.debug(a - b);  // 7  — Subtraction
System.debug(a * b);  // 30 — Multiplication
System.debug(a / b);  // 3  — Division (integer division!)
System.debug(Math.mod(a, b)); // 1  — Modulo (remainder)
\`\`\`

> ⚠️ **Integer division** truncates! \`10 / 3 = 3\`, not \`3.33\`. Use \`Decimal\` for precision.

### Comparison Operators

\`\`\`apex
System.debug(5 == 5);  // true
System.debug(5 != 3);  // true
System.debug(10 > 7);  // true
System.debug(10 >= 10); // true
System.debug(3 < 5);   // true
System.debug(3 <= 2);  // false
\`\`\`

### Logical Operators

\`\`\`apex
Boolean a = true, b = false;

System.debug(a && b); // false — AND (both must be true)
System.debug(a || b); // true  — OR  (at least one must be true)
System.debug(!a);     // false — NOT (flips true/false)
\`\`\`

### Compound Assignment

\`\`\`apex
Integer x = 10;
x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
x /= 4;  // x = x / 4 → 6
\`\`\`

### String Operators

\`\`\`apex
String s = 'Apex';
s += ' is awesome'; // 'Apex is awesome'
System.debug(s.length()); // 16
System.debug(s.toUpperCase()); // APEX IS AWESOME
\`\`\`
        `,
        codeExample: `Integer x = 20;
Integer y = 6;

System.debug(x + y);         // 26
System.debug(x - y);         // 14
System.debug(x * y);         // 120
System.debug(x / y);         // 3 (integer division)
System.debug(Math.mod(x, y)); // 2

Boolean result = (x > 10) && (y < 10);
System.debug(result); // true`,
        exercise: {
          title: 'Calculate and Debug',
          instructions: 'Given `Integer a = 15` and `Integer b = 4`, debug:\n1. Their sum\n2. Their product\n3. The remainder of `a / b`\n\nExpected output:\n```\n19\n60\n3\n```',
          starterCode: `Integer a = 15;\nInteger b = 4;\n\n// Debug sum, product, and remainder\n`,
          expectedOutput: ['19', '60', '3'],
          hint: "For remainder in Apex, use Math.mod(a, b)",
          solution: `Integer a = 15;\nInteger b = 4;\nSystem.debug(a + b);\nSystem.debug(a * b);\nSystem.debug(Math.mod(a, b));`,
        },
      },
    ],
  },

  {
    id: 'control-flow',
    title: 'Control Flow',
    icon: '🔀',
    color: '#FF6B35',
    xpTotal: 200,
    description: 'Make decisions and repeat actions with conditionals and loops.',
    lessons: [
      {
        id: 'if-else',
        title: 'If / Else Statements',
        xp: 25,
        theory: `
## If / Else Statements

Conditionals let your code make decisions — run different code based on whether a condition is true or false.

\`\`\`apex
if (condition) {
    // runs if condition is TRUE
} else if (anotherCondition) {
    // runs if first was FALSE but this is TRUE
} else {
    // runs if ALL conditions were FALSE
}
\`\`\`

### Basic Example

\`\`\`apex
Integer score = 85;

if (score >= 90) {
    System.debug('Grade: A');
} else if (score >= 80) {
    System.debug('Grade: B');
} else if (score >= 70) {
    System.debug('Grade: C');
} else {
    System.debug('Grade: F');
}
// Output: Grade: B
\`\`\`

### Null Checks (Critical in Apex!)

Always check for null before using a value. A \`NullPointerException\` will crash your code:

\`\`\`apex
String name = null;

if (name != null) {
    System.debug('Hello, ' + name);
} else {
    System.debug('Name is empty!');
}
\`\`\`

### Ternary Operator

A one-liner shortcut for simple if/else:

\`\`\`apex
Integer age = 20;
String status = (age >= 18) ? 'Adult' : 'Minor';
System.debug(status); // Adult
\`\`\`

### Salesforce Real-World Example

\`\`\`apex
// Assign account tier based on revenue
Decimal annualRevenue = 5000000;
String tier;

if (annualRevenue >= 10000000) {
    tier = 'Enterprise';
} else if (annualRevenue >= 1000000) {
    tier = 'Mid-Market';
} else {
    tier = 'SMB';
}
System.debug('Tier: ' + tier);
\`\`\`
        `,
        codeExample: `Integer temperature = 72;
String weather;

if (temperature > 85) {
    weather = 'Hot';
} else if (temperature > 65) {
    weather = 'Pleasant';
} else if (temperature > 45) {
    weather = 'Cool';
} else {
    weather = 'Cold';
}

System.debug('Weather: ' + weather);`,
        exercise: {
          title: 'Opportunity Stage Classifier',
          instructions: 'Given `Integer dealSize = 75000`, write logic to:\n- If dealSize >= 100000: debug `"Enterprise Deal"`\n- If dealSize >= 50000: debug `"Mid-Market Deal"`\n- Otherwise: debug `"SMB Deal"`\n\nExpected output:\n```\nMid-Market Deal\n```',
          starterCode: `Integer dealSize = 75000;\n\n// Write your if/else logic here\n`,
          expectedOutput: ['Mid-Market Deal'],
          hint: "Start with the highest value check: if (dealSize >= 100000)",
          solution: `Integer dealSize = 75000;\nif (dealSize >= 100000) {\n    System.debug('Enterprise Deal');\n} else if (dealSize >= 50000) {\n    System.debug('Mid-Market Deal');\n} else {\n    System.debug('SMB Deal');\n}`,
        },
      },
      {
        id: 'switch',
        title: 'Switch Statements',
        xp: 20,
        theory: `
## Switch Statements

When you're comparing one value against many options, \`switch\` is cleaner than a long chain of \`if/else if\`.

\`\`\`apex
switch on variable {
    when value1 {
        // code
    }
    when value2, value3 {
        // code for either value2 or value3
    }
    when else {
        // default case (like 'else')
    }
}
\`\`\`

### Example: Account Rating

\`\`\`apex
String rating = 'Hot';

switch on rating {
    when 'Hot' {
        System.debug('Priority: HIGH');
    }
    when 'Warm' {
        System.debug('Priority: MEDIUM');
    }
    when 'Cold' {
        System.debug('Priority: LOW');
    }
    when else {
        System.debug('Priority: UNKNOWN');
    }
}
// Output: Priority: HIGH
\`\`\`

### Switch with Integers

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
\`\`\`

### Multiple Values in One \`when\`

\`\`\`apex
String stage = 'Closed Won';

switch on stage {
    when 'Closed Won' {
        System.debug('Deal closed! 🎉');
    }
    when 'Prospecting', 'Qualification' {
        System.debug('Early stage');
    }
    when 'Proposal/Price Quote', 'Value Proposition' {
        System.debug('Mid stage');
    }
    when else {
        System.debug('Other stage');
    }
}
\`\`\`
        `,
        codeExample: `String leadSource = 'Web';

switch on leadSource {
    when 'Web' {
        System.debug('Route to Digital Team');
    }
    when 'Phone', 'Cold Call' {
        System.debug('Route to Inside Sales');
    }
    when 'Partner Referral' {
        System.debug('Route to Channel Team');
    }
    when else {
        System.debug('Route to General Queue');
    }
}`,
        exercise: {
          title: 'Case Priority Router',
          instructions: 'Given `String priority = "High"`, use a switch statement to debug:\n- "High" → `"Escalate immediately"`\n- "Medium" → `"Handle within 4 hours"`\n- "Low" → `"Handle within 24 hours"`\n- else → `"Unknown priority"`\n\nExpected output:\n```\nEscalate immediately\n```',
          starterCode: `String priority = 'High';\n\n// Write your switch statement\n`,
          expectedOutput: ['Escalate immediately'],
          hint: "switch on priority { when 'High' { ... } ... }",
          solution: `String priority = 'High';\nswitch on priority {\n    when 'High' { System.debug('Escalate immediately'); }\n    when 'Medium' { System.debug('Handle within 4 hours'); }\n    when 'Low' { System.debug('Handle within 24 hours'); }\n    when else { System.debug('Unknown priority'); }\n}`,
        },
      },
      {
        id: 'for-loops',
        title: 'For Loops',
        xp: 25,
        theory: `
## For Loops

Loops let you repeat code. The traditional \`for\` loop gives you full control:

\`\`\`apex
for (Integer i = 0; i < 5; i++) {
    System.debug('Count: ' + i);
}
// Count: 0, Count: 1, Count: 2, Count: 3, Count: 4
\`\`\`

### Three Parts of a For Loop

\`\`\`apex
for (initialization; condition; increment) { ... }
//   Integer i = 0  i < 5     i++
\`\`\`

1. **Initialization** — runs once before the loop starts
2. **Condition** — checked before each iteration; loop stops when false
3. **Increment** — runs after each iteration

### Counting Down

\`\`\`apex
for (Integer i = 5; i > 0; i--) {
    System.debug(i);
}
// 5, 4, 3, 2, 1
\`\`\`

### Nested Loops

\`\`\`apex
for (Integer i = 1; i <= 3; i++) {
    for (Integer j = 1; j <= 3; j++) {
        System.debug(i + ' x ' + j + ' = ' + (i * j));
    }
}
\`\`\`

### Break and Continue

\`\`\`apex
// break — exits the loop entirely
for (Integer i = 0; i < 10; i++) {
    if (i == 5) break;
    System.debug(i); // 0,1,2,3,4
}

// continue — skips to next iteration
for (Integer i = 0; i < 5; i++) {
    if (i == 2) continue;
    System.debug(i); // 0,1,3,4
}
\`\`\`
        `,
        codeExample: `// Print multiplication table for 3
for (Integer i = 1; i <= 5; i++) {
    System.debug('3 x ' + i + ' = ' + (3 * i));
}`,
        exercise: {
          title: 'Sum Calculator',
          instructions: 'Use a `for` loop to calculate the sum of numbers from 1 to 5 (1+2+3+4+5=15), then debug the total.\n\nExpected output:\n```\n15\n```',
          starterCode: `Integer total = 0;\n\n// Loop from 1 to 5, adding each number to total\n\nSystem.debug(total);\n`,
          expectedOutput: ['15'],
          hint: "total += i; inside the loop will accumulate the sum.",
          solution: `Integer total = 0;\nfor (Integer i = 1; i <= 5; i++) {\n    total += i;\n}\nSystem.debug(total);`,
        },
      },
      {
        id: 'while-loops',
        title: 'While & Do-While Loops',
        xp: 20,
        theory: `
## While & Do-While Loops

### While Loop

Repeats as long as a condition is true. Useful when you don't know how many iterations upfront.

\`\`\`apex
Integer count = 0;
while (count < 5) {
    System.debug('Count: ' + count);
    count++;
}
\`\`\`

> ⚠️ **Infinite Loop Warning!** Always make sure your condition will eventually become false, or Apex will hit a CPU time governor limit and throw an exception.

### Do-While Loop

Like a \`while\` loop, but runs the body **at least once** before checking the condition:

\`\`\`apex
Integer x = 10;
do {
    System.debug('x = ' + x);
    x--;
} while (x > 8);
// x = 10
// x = 9
\`\`\`

### When to Use Which

| Loop | Use When |
|------|----------|
| \`for\` | You know the number of iterations |
| \`while\` | Condition-based, unknown iterations |
| \`do-while\` | Must run at least once |

### Real-World Example: Retry Logic

\`\`\`apex
Integer attempts = 0;
Boolean success = false;
Integer maxRetries = 3;

while (!success && attempts < maxRetries) {
    attempts++;
    System.debug('Attempt #' + attempts);
    if (attempts == 2) {
        success = true;
    }
}
System.debug('Succeeded: ' + success);
\`\`\`
        `,
        codeExample: `Integer n = 1;
Integer sum = 0;

while (n <= 10) {
    sum += n;
    n++;
}

System.debug('Sum 1-10: ' + sum); // 55`,
        exercise: {
          title: 'Countdown',
          instructions: 'Use a `while` loop to count down from 3 to 1, then debug `"Go!"`. Expected output:\n```\n3\n2\n1\nGo!\n```',
          starterCode: `Integer count = 3;\n\n// While loop here\n\nSystem.debug('Go!');\n`,
          expectedOutput: ['3', '2', '1', 'Go!'],
          hint: "While count > 0, debug count then decrement it.",
          solution: `Integer count = 3;\nwhile (count > 0) {\n    System.debug(count);\n    count--;\n}\nSystem.debug('Go!');`,
        },
      },
    ],
  },

  {
    id: 'collections',
    title: 'Collections',
    icon: '📦',
    color: '#7B68EE',
    xpTotal: 250,
    description: 'Work with Lists, Sets, and Maps — the backbone of bulk data processing.',
    lessons: [
      {
        id: 'lists',
        title: 'Lists',
        xp: 30,
        theory: `
## Lists

A **List** is an ordered collection of elements — like an array in other languages. Lists are the most used collection in Apex.

\`\`\`apex
// Create an empty list
List<Integer> scores = new List<Integer>();

// Create with initial values
List<String> names = new List<String>{'Alice', 'Bob', 'Charlie'};
\`\`\`

### Common List Methods

\`\`\`apex
List<String> fruits = new List<String>{'Apple', 'Banana'};

fruits.add('Cherry');         // Add to end
fruits.add(0, 'Avocado');    // Add at index 0
fruits.remove(1);             // Remove by index
Integer sz = fruits.size();   // Count of elements → 3
String first = fruits.get(0); // Get by index → 'Avocado'
Boolean has = fruits.contains('Cherry'); // → true
fruits.sort();                // Sort alphabetically
\`\`\`

### For-Each Loop on Lists

\`\`\`apex
List<Integer> numbers = new List<Integer>{10, 20, 30, 40};

for (Integer num : numbers) {
    System.debug('Value: ' + num);
}
\`\`\`

### Lists in Salesforce (Critical!)

In Apex, SOQL queries return **Lists of SObjects**:

\`\`\`apex
// This is how you query records (more on SOQL later)
List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 10];

for (Account acc : accounts) {
    System.debug(acc.Name);
}
\`\`\`

### Governor Limit: List Size

Lists can hold up to 1,000 records from a SOQL query by default. Always use \`LIMIT\` in queries!
        `,
        codeExample: `List<String> cities = new List<String>{'New York', 'London', 'Tokyo'};
cities.add('Sydney');

System.debug('Size: ' + cities.size());

for (String city : cities) {
    System.debug(city);
}`,
        exercise: {
          title: 'List Operations',
          instructions: "Create a `List<Integer>` with values `{5, 10, 15}`, add `20` to it, then debug the size.\n\nExpected output:\n```\n4\n```",
          starterCode: `List<Integer> nums = new List<Integer>{5, 10, 15};\n\n// Add 20 to the list\n\n// Debug the size\n`,
          expectedOutput: ['4'],
          hint: "Use nums.add(20); then System.debug(nums.size());",
          solution: `List<Integer> nums = new List<Integer>{5, 10, 15};\nnums.add(20);\nSystem.debug(nums.size());`,
        },
      },
      {
        id: 'sets',
        title: 'Sets',
        xp: 25,
        theory: `
## Sets

A **Set** is an unordered collection of **unique** values — duplicates are automatically ignored. Perfect for deduplication!

\`\`\`apex
Set<String> uniqueEmails = new Set<String>();
uniqueEmails.add('alice@co.com');
uniqueEmails.add('bob@co.com');
uniqueEmails.add('alice@co.com'); // IGNORED — duplicate!

System.debug(uniqueEmails.size()); // 2, not 3
\`\`\`

### Common Set Methods

\`\`\`apex
Set<Integer> ids = new Set<Integer>{1, 2, 3, 4, 5};

ids.add(6);              // Add element
ids.remove(1);           // Remove element
Boolean has = ids.contains(3); // → true
Integer sz = ids.size();       // → 5
ids.clear();             // Remove all elements

// Convert List to Set (instant deduplication!)
List<String> dupes = new List<String>{'a', 'b', 'a', 'c', 'b'};
Set<String> unique = new Set<String>(dupes);
System.debug(unique.size()); // 3
\`\`\`

### Real-World Use: Collecting IDs

\`\`\`apex
// Collect unique Account IDs from Opportunities
List<Opportunity> opps = [SELECT AccountId FROM Opportunity LIMIT 200];
Set<Id> accountIds = new Set<Id>();

for (Opportunity opp : opps) {
    accountIds.add(opp.AccountId);
}

// Now query just those accounts (no duplicates!)
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
\`\`\`
        `,
        codeExample: `Set<String> tags = new Set<String>{'apex', 'salesforce', 'apex', 'crm'};
System.debug('Size: ' + tags.size()); // 3 — duplicate removed

tags.add('lwc');
System.debug('Contains apex: ' + tags.contains('apex')); // true
System.debug('Contains python: ' + tags.contains('python')); // false`,
        exercise: {
          title: 'Deduplication',
          instructions: "Create a `Set<String>` from this list `{'red', 'blue', 'red', 'green', 'blue'}` and debug its size.\n\nExpected output:\n```\n3\n```",
          starterCode: `List<String> colors = new List<String>{'red', 'blue', 'red', 'green', 'blue'};\n\n// Convert to Set and debug size\n`,
          expectedOutput: ['3'],
          hint: "Set<String> uniqueColors = new Set<String>(colors); then debug uniqueColors.size();",
          solution: `List<String> colors = new List<String>{'red', 'blue', 'red', 'green', 'blue'};\nSet<String> uniqueColors = new Set<String>(colors);\nSystem.debug(uniqueColors.size());`,
        },
      },
      {
        id: 'maps',
        title: 'Maps',
        xp: 35,
        theory: `
## Maps

A **Map** stores key-value pairs. Think of a dictionary or a lookup table. Each key is unique; values can repeat.

\`\`\`apex
Map<String, Integer> wordCount = new Map<String, Integer>();
wordCount.put('apple', 5);
wordCount.put('banana', 3);
wordCount.put('apple', 7); // Overwrites the old value!

System.debug(wordCount.get('apple'));  // 7
System.debug(wordCount.size());        // 2
\`\`\`

### Common Map Methods

\`\`\`apex
Map<String, String> capitals = new Map<String, String>{
    'France' => 'Paris',
    'Japan' => 'Tokyo',
    'USA' => 'Washington D.C.'
};

capitals.put('UK', 'London');           // Add/update
capitals.remove('USA');                  // Remove
Boolean has = capitals.containsKey('Japan'); // → true
String cap = capitals.get('France');    // → 'Paris'
Set<String> keys = capitals.keySet();   // All keys
List<String> vals = capitals.values();  // All values
\`\`\`

### Iterating a Map

\`\`\`apex
Map<String, Integer> scores = new Map<String, Integer>{
    'Alice' => 95,
    'Bob' => 87,
    'Charlie' => 92
};

for (String name : scores.keySet()) {
    System.debug(name + ': ' + scores.get(name));
}
\`\`\`

### Real-World: Map for Fast Lookups

\`\`\`apex
// Create a Map from Account ID → Account (avoids multiple queries)
List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 100];
Map<Id, Account> accountMap = new Map<Id, Account>(accounts);

// Now look up any account by ID instantly — O(1) lookup!
Account acc = accountMap.get(someId);
\`\`\`
        `,
        codeExample: `Map<String, Integer> inventory = new Map<String, Integer>{
    'Laptop' => 10,
    'Mouse' => 50,
    'Keyboard' => 30
};

System.debug('Laptops: ' + inventory.get('Laptop'));
inventory.put('Monitor', 15);
System.debug('Total items: ' + inventory.size());

for (String item : inventory.keySet()) {
    System.debug(item + ': ' + inventory.get(item));
}`,
        exercise: {
          title: 'Map Lookup',
          instructions: "Create a Map with: `'USA' => 'Washington D.C.'` and `'France' => 'Paris'`. Debug the capital of France.\n\nExpected output:\n```\nParis\n```",
          starterCode: `Map<String, String> capitals = new Map<String, String>();\n\n// Add USA and France entries\n\n// Debug France's capital\n`,
          expectedOutput: ['Paris'],
          hint: "Use capitals.put('France', 'Paris'); then System.debug(capitals.get('France'));",
          solution: `Map<String, String> capitals = new Map<String, String>();\ncapitals.put('USA', 'Washington D.C.');\ncapitals.put('France', 'Paris');\nSystem.debug(capitals.get('France'));`,
        },
      },
    ],
  },

  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    icon: '🏛️',
    color: '#00C9A7',
    xpTotal: 350,
    description: 'Classes, objects, constructors, inheritance, and interfaces.',
    lessons: [
      {
        id: 'classes-basics',
        title: 'Classes & Objects',
        xp: 40,
        theory: `
## Classes & Objects

A **class** is a blueprint. An **object** is an instance of that blueprint. This is the foundation of object-oriented programming.

\`\`\`apex
public class Car {
    // Properties (instance variables)
    public String make;
    public String model;
    public Integer year;

    // Constructor — called when you create a new object
    public Car(String make, String model, Integer year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    // Method
    public String getInfo() {
        return year + ' ' + make + ' ' + model;
    }
}
\`\`\`

### Creating Objects (Instantiation)

\`\`\`apex
// Using the constructor
Car myCar = new Car('Toyota', 'Camry', 2023);
System.debug(myCar.getInfo()); // 2023 Toyota Camry
System.debug(myCar.make);      // Toyota
\`\`\`

### Access Modifiers

| Modifier | Visibility |
|----------|-----------|
| \`public\` | Accessible from anywhere |
| \`private\` | Only within this class |
| \`protected\` | Class + subclasses |
| \`global\` | Across namespaces/packages |

### Static vs Instance

\`\`\`apex
public class MathHelper {
    // Static — call without creating an object
    public static Integer square(Integer n) {
        return n * n;
    }

    // Instance — requires an object
    public Integer multiplier;
    public Integer multiply(Integer n) {
        return n * multiplier;
    }
}

// Static call
System.debug(MathHelper.square(5)); // 25

// Instance call
MathHelper helper = new MathHelper();
helper.multiplier = 3;
System.debug(helper.multiply(4)); // 12
\`\`\`
        `,
        codeExample: `public class Employee {
    public String name;
    public String department;
    public Decimal salary;

    public Employee(String name, String dept, Decimal salary) {
        this.name = name;
        this.department = dept;
        this.salary = salary;
    }

    public String getSummary() {
        return name + ' | ' + department + ' | $' + salary;
    }
}

Employee emp = new Employee('Jane Smith', 'Engineering', 95000);
System.debug(emp.getSummary());
System.debug(emp.department);`,
        exercise: {
          title: 'Create a Product Class',
          instructions: "Write a class `Product` with `name` (String) and `price` (Decimal). Create a product named `'Widget'` with price `29.99` and debug its name.\n\nExpected output:\n```\nWidget\n```",
          starterCode: `public class Product {\n    public String name;\n    public Decimal price;\n\n    public Product(String name, Decimal price) {\n        // Complete the constructor\n    }\n}\n\n// Create a Product and debug its name\n`,
          expectedOutput: ['Widget'],
          hint: "this.name = name; in the constructor, then Product p = new Product('Widget', 29.99); System.debug(p.name);",
          solution: `public class Product {\n    public String name;\n    public Decimal price;\n    public Product(String name, Decimal price) {\n        this.name = name;\n        this.price = price;\n    }\n}\nProduct p = new Product('Widget', 29.99);\nSystem.debug(p.name);`,
        },
      },
      {
        id: 'inheritance',
        title: 'Inheritance & Interfaces',
        xp: 45,
        theory: `
## Inheritance

Inheritance lets a class **extend** another, inheriting its properties and methods. Use \`extends\` keyword.

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
    public Dog(String name) {
        super(name); // Call parent constructor
    }

    public override String speak() {
        return 'Woof!';
    }
}

Dog d = new Dog('Rex');
System.debug(d.describe()); // Rex says: Woof!
\`\`\`

### Key Keywords

| Keyword | Meaning |
|---------|---------|
| \`virtual\` | Method can be overridden |
| \`override\` | Overriding a parent method |
| \`abstract\` | Class/method that MUST be implemented |
| \`super\` | Reference to parent class |
| \`extends\` | Inherit from a class |
| \`implements\` | Implement an interface |

### Interfaces

An interface defines a **contract** — it says "you MUST implement these methods."

\`\`\`apex
public interface Payable {
    Decimal calculatePay();
    String getPaymentType();
}

public class SalariedEmployee implements Payable {
    public Decimal annualSalary;

    public Decimal calculatePay() {
        return annualSalary / 12; // Monthly
    }

    public String getPaymentType() {
        return 'Salary';
    }
}
\`\`\`

### Real-World: Trigger Handler Pattern

In Salesforce, the trigger handler pattern uses interfaces:

\`\`\`apex
public interface ITriggerHandler {
    void beforeInsert(List<SObject> newRecords);
    void afterInsert(List<SObject> newRecords, Map<Id,SObject> newMap);
}
\`\`\`
        `,
        codeExample: `public virtual class Shape {
    public virtual Decimal area() {
        return 0;
    }
    public String describe() {
        return 'Area: ' + area();
    }
}

public class Rectangle extends Shape {
    public Decimal width, height;
    public Rectangle(Decimal w, Decimal h) {
        width = w; height = h;
    }
    public override Decimal area() {
        return width * height;
    }
}

Rectangle r = new Rectangle(5, 3);
System.debug(r.describe()); // Area: 15`,
        exercise: {
          title: 'Shape Hierarchy',
          instructions: "Create a `Circle` class that extends `Shape` (already defined in context). Give it a `radius` property, and override `area()` to return `3 * radius * radius` (simplified π). Create a Circle with radius `4` and debug its area.\n\nExpected output:\n```\n48\n```",
          starterCode: `public virtual class Shape {\n    public virtual Decimal area() { return 0; }\n}\n\npublic class Circle extends Shape {\n    public Decimal radius;\n    // Constructor and override here\n}\n\n// Create Circle with radius 4 and debug area\n`,
          expectedOutput: ['48'],
          hint: "public override Decimal area() { return 3 * radius * radius; } — then new Circle with radius=4",
          solution: `public virtual class Shape {\n    public virtual Decimal area() { return 0; }\n}\npublic class Circle extends Shape {\n    public Decimal radius;\n    public Circle(Decimal r) { radius = r; }\n    public override Decimal area() { return 3 * radius * radius; }\n}\nCircle c = new Circle(4);\nSystem.debug(c.area());`,
        },
      },
    ],
  },

  {
    id: 'soql-dml',
    title: 'SOQL & DML',
    icon: '🗄️',
    color: '#FFD700',
    xpTotal: 300,
    description: 'Query and manipulate Salesforce data with SOQL and DML operations.',
    lessons: [
      {
        id: 'soql-basics',
        title: 'SOQL Basics',
        xp: 35,
        theory: `
## SOQL — Salesforce Object Query Language

SOQL is how you read data from Salesforce. It's similar to SQL but tailored for Salesforce objects.

\`\`\`apex
// Basic structure
List<SObjectType> results = [SELECT field1, field2 FROM ObjectName WHERE condition];
\`\`\`

### Basic Examples

\`\`\`apex
// Get all Accounts (limited to 50,000 — always use LIMIT!)
List<Account> accounts = [SELECT Id, Name, Phone FROM Account LIMIT 100];

// Filter with WHERE
List<Contact> vipContacts = [
    SELECT Id, FirstName, LastName, Email
    FROM Contact
    WHERE AccountId = :someAccountId
    AND Email != null
    LIMIT 50
];

// Order results
List<Opportunity> bigDeals = [
    SELECT Name, Amount, CloseDate
    FROM Opportunity
    WHERE Amount > 10000
    ORDER BY Amount DESC
    LIMIT 10
];
\`\`\`

### Bind Variables (\`:\`)

Use \`:\` to inject Apex variables into SOQL:

\`\`\`apex
String searchName = 'Acme%';
List<Account> found = [SELECT Name FROM Account WHERE Name LIKE :searchName];
\`\`\`

### Aggregate Functions

\`\`\`apex
Integer count = [SELECT COUNT() FROM Account WHERE Industry = 'Technology'];
AggregateResult[] results = [
    SELECT Industry, COUNT(Id) total, AVG(AnnualRevenue) avgRev
    FROM Account
    GROUP BY Industry
];
\`\`\`

### Relationship Queries

\`\`\`apex
// Parent → Child (subquery)
List<Account> accsWithOpps = [
    SELECT Name, (SELECT Name, Amount FROM Opportunities)
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Opportunity)
];

// Child → Parent
List<Contact> contacts = [
    SELECT Name, Account.Name, Account.Industry
    FROM Contact
];
\`\`\`

### Governor Limit: 100 SOQL queries per transaction!

Always put SOQL **outside** of loops. Never query inside a for loop.
        `,
        codeExample: `// ⚠️ This code references Salesforce objects.
// In a real org, run this in Execute Anonymous (Developer Console)

// Query with filters
List<Account> techAccounts = [
    SELECT Id, Name, AnnualRevenue
    FROM Account
    WHERE Industry = 'Technology'
    AND AnnualRevenue > 1000000
    ORDER BY AnnualRevenue DESC
    LIMIT 5
];

for (Account acc : techAccounts) {
    System.debug(acc.Name + ': $' + acc.AnnualRevenue);
}`,
        exercise: {
          title: 'SOQL Query Builder',
          instructions: "Write a SOQL query comment that would select the `Name` and `Email` fields from `Contact` where `Email != null`, ordered by `Name`, limited to 10. Then debug `'Query written!'`\n\nExpected output:\n```\nQuery written!\n```",
          starterCode: `// Write your SOQL query as a comment:\n// List<Contact> contacts = [...]\n\nSystem.debug('Query written!');\n`,
          expectedOutput: ['Query written!'],
          hint: "The query: [SELECT Name, Email FROM Contact WHERE Email != null ORDER BY Name LIMIT 10]",
          solution: `// List<Contact> contacts = [SELECT Name, Email FROM Contact WHERE Email != null ORDER BY Name LIMIT 10];\nSystem.debug('Query written!');`,
        },
      },
      {
        id: 'dml-operations',
        title: 'DML Operations',
        xp: 40,
        theory: `
## DML — Data Manipulation Language

DML statements let you **create, update, and delete** records in Salesforce.

### The 5 DML Operations

\`\`\`apex
// INSERT — Create new records
Account newAcc = new Account(Name = 'ACME Corp', Industry = 'Technology');
insert newAcc;
System.debug('New ID: ' + newAcc.Id); // ID is populated after insert!

// UPDATE — Modify existing records
newAcc.Phone = '555-1234';
update newAcc;

// DELETE — Remove records
delete newAcc;

// UPSERT — Insert if new, Update if exists (based on external ID)
Account acc = new Account(Name = 'Test', External_Id__c = 'EXT-001');
upsert acc Account.External_Id__c;

// UNDELETE — Restore from Recycle Bin
undelete newAcc;
\`\`\`

### Bulk DML (Always prefer this!)

\`\`\`apex
// ✅ Good — One DML for 200 records
List<Contact> contacts = new List<Contact>();
for (Integer i = 0; i < 200; i++) {
    contacts.add(new Contact(
        LastName = 'Contact ' + i,
        AccountId = someAccountId
    ));
}
insert contacts; // ONE DML statement!

// ❌ Bad — DML inside a loop!
for (Contact c : someList) {
    insert c; // NEVER DO THIS — hits 150 DML limit fast!
}
\`\`\`

### Database Methods (for error handling)

\`\`\`apex
// insert throws exception on any error
// Database.insert with allOrNone=false handles partial success
List<Database.SaveResult> results = Database.insert(contacts, false);

for (Database.SaveResult sr : results) {
    if (sr.isSuccess()) {
        System.debug('Inserted: ' + sr.getId());
    } else {
        for (Database.Error err : sr.getErrors()) {
            System.debug('Error: ' + err.getMessage());
        }
    }
}
\`\`\`

### Governor Limit: 150 DML statements per transaction!
        `,
        codeExample: `// ⚠️ DML requires a Salesforce org to run.
// This shows the pattern:

// Build a list of records to insert
List<Account> newAccounts = new List<Account>();
newAccounts.add(new Account(Name = 'Alpha Corp', Industry = 'Finance'));
newAccounts.add(new Account(Name = 'Beta Inc', Industry = 'Technology'));
newAccounts.add(new Account(Name = 'Gamma LLC', Industry = 'Healthcare'));

// One DML for all records
insert newAccounts;

System.debug('Inserted ' + newAccounts.size() + ' accounts');
System.debug('First ID: ' + newAccounts[0].Id);`,
        exercise: {
          title: 'DML Pattern Recognition',
          instructions: "Debug the correct DML operation for each scenario:\n1. Creating new records → debug `\"insert\"`\n2. Removing records → debug `\"delete\"`\n3. Create or update → debug `\"upsert\"`\n\nExpected output:\n```\ninsert\ndelete\nupsert\n```",
          starterCode: `// Debug the correct DML operation names\n`,
          expectedOutput: ['insert', 'delete', 'upsert'],
          hint: "Three System.debug calls with the operation names as strings",
          solution: `System.debug('insert');\nSystem.debug('delete');\nSystem.debug('upsert');`,
        },
      },
    ],
  },

  {
    id: 'triggers',
    title: 'Apex Triggers',
    icon: '⚡',
    color: '#FF4757',
    xpTotal: 300,
    description: 'Respond to record events automatically with before/after triggers.',
    lessons: [
      {
        id: 'trigger-basics',
        title: 'Trigger Basics',
        xp: 40,
        theory: `
## Apex Triggers

A **trigger** automatically executes Apex code when a record event occurs (insert, update, delete).

### Trigger Syntax

\`\`\`apex
trigger TriggerName on ObjectName (events) {
    // code
}
\`\`\`

### Events

| Event | When |
|-------|------|
| \`before insert\` | Before a new record is saved |
| \`after insert\` | After a new record is saved |
| \`before update\` | Before an existing record is saved |
| \`after update\` | After an existing record is saved |
| \`before delete\` | Before a record is deleted |
| \`after delete\` | After a record is deleted |
| \`after undelete\` | After a record is restored |

### Context Variables

\`\`\`apex
trigger AccountTrigger on Account (before insert, before update) {
    Trigger.new        // List of new records (insert/update)
    Trigger.old        // List of old records (update/delete)
    Trigger.newMap     // Map<Id, SObject> of new records
    Trigger.oldMap     // Map<Id, SObject> of old records
    Trigger.isInsert   // Boolean
    Trigger.isUpdate   // Boolean
    Trigger.isDelete   // Boolean
    Trigger.isBefore   // Boolean
    Trigger.isAfter    // Boolean
    Trigger.size       // Number of records in the trigger
}
\`\`\`

### Simple Example: Auto-fill a Field

\`\`\`apex
trigger AccountTrigger on Account (before insert) {
    for (Account acc : Trigger.new) {
        if (acc.Phone == null) {
            acc.Phone = '000-0000'; // default phone
        }
        // Set description with timestamp
        acc.Description = 'Created via Trigger on ' + Date.today();
    }
}
\`\`\`

### Golden Rules of Triggers

1. **ONE trigger per object** — avoid multiple triggers on one object
2. **No SOQL/DML in loops** — use Maps and bulk patterns
3. **Logic in handler classes** — triggers should be thin, delegating to classes
4. **Handle both insert AND update** — triggers fire in bulk (up to 200 records at once)
        `,
        codeExample: `// One-trigger-per-object handler pattern
trigger OpportunityTrigger on Opportunity (
    before insert, before update,
    after insert, after update
) {
    OpportunityHandler handler = new OpportunityHandler();

    if (Trigger.isBefore) {
        if (Trigger.isInsert) handler.beforeInsert(Trigger.new);
        if (Trigger.isUpdate) handler.beforeUpdate(Trigger.new, Trigger.oldMap);
    }
    if (Trigger.isAfter) {
        if (Trigger.isInsert) handler.afterInsert(Trigger.new, Trigger.newMap);
        if (Trigger.isUpdate) handler.afterUpdate(Trigger.new, Trigger.newMap, Trigger.oldMap);
    }
}`,
        exercise: {
          title: 'Trigger Context Variables',
          instructions: "Debug the names of the three main trigger context variables that hold records:\n1. New records list\n2. Old records list  \n3. New records map\n\nExpected output:\n```\nTrigger.new\nTrigger.old\nTrigger.newMap\n```",
          starterCode: `// Debug the three main trigger context variable names\n`,
          expectedOutput: ['Trigger.new', 'Trigger.old', 'Trigger.newMap'],
          hint: "Three System.debug calls with the names as strings",
          solution: `System.debug('Trigger.new');\nSystem.debug('Trigger.old');\nSystem.debug('Trigger.newMap');`,
        },
      },
    ],
  },

  {
    id: 'governor-limits',
    title: 'Governor Limits',
    icon: '🛡️',
    color: '#FFA502',
    xpTotal: 200,
    description: 'Understand and work within Salesforce\'s execution limits.',
    lessons: [
      {
        id: 'limits-overview',
        title: 'Understanding Limits',
        xp: 30,
        theory: `
## Governor Limits

Apex runs in a **multi-tenant** environment — thousands of companies share the same servers. Governor Limits prevent any single org from hogging resources.

### Key Limits (Per Transaction)

| Limit | Value |
|-------|-------|
| SOQL Queries | **100** |
| DML Statements | **150** |
| DML Rows | **10,000** |
| CPU Time | **10,000ms** (sync), **60,000ms** (async) |
| Heap Size | **6MB** (sync), **12MB** (async) |
| Callouts | **100** |
| Future Methods | **50** |
| Batch Apex concurrent jobs | **5** |

### Check Limits Programmatically

\`\`\`apex
System.debug('SOQL used: ' + Limits.getQueries());
System.debug('SOQL limit: ' + Limits.getLimitQueries());
System.debug('DML used: ' + Limits.getDmlStatements());
System.debug('CPU used: ' + Limits.getCpuTime() + 'ms');
\`\`\`

### The #1 Mistake: SOQL in a Loop ❌

\`\`\`apex
// ❌ NEVER — could hit 100 SOQL limit immediately!
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ CORRECT — One query with all IDs
Set<Id> accountIds = new Map<Id, Account>(accounts).keySet();
List<Contact> contacts = [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds];
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();

for (Contact c : contacts) {
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}
\`\`\`

### Bulkification Pattern

Always write code that handles **up to 200 records** in one transaction (triggers fire in batches of up to 200):

\`\`\`apex
trigger ContactTrigger on Contact (before insert) {
    // ✅ Collect all Account IDs first
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (c.AccountId != null) accountIds.add(c.AccountId);
    }

    // ✅ One SOQL query for all related accounts
    Map<Id, Account> accounts = new Map<Id, Account>(
        [SELECT Id, Name, Industry FROM Account WHERE Id IN :accountIds]
    );

    // ✅ Process all records
    for (Contact c : Trigger.new) {
        Account acc = accounts.get(c.AccountId);
        if (acc != null) {
            c.Department = acc.Industry;
        }
    }
}
\`\`\`
        `,
        codeExample: `// Checking limits in code
Integer queriesUsed = Limits.getQueries();
Integer queriesLimit = Limits.getLimitQueries();
Integer dmlUsed = Limits.getDmlStatements();

System.debug('SOQL: ' + queriesUsed + '/' + queriesLimit);
System.debug('DML: ' + dmlUsed + '/' + Limits.getLimitDmlStatements());

// A quick limit check utility
Boolean isSafe = (queriesUsed < (queriesLimit - 10));
System.debug('Safe to query: ' + isSafe);`,
        exercise: {
          title: 'Limits Knowledge Check',
          instructions: "Debug the key governor limit numbers:\n1. Max SOQL queries per transaction: `100`\n2. Max DML statements: `150`\n3. Max DML rows: `10000`\n\nExpected output:\n```\n100\n150\n10000\n```",
          starterCode: `// Debug the three key limit numbers\n`,
          expectedOutput: ['100', '150', '10000'],
          hint: "Three System.debug calls with the numeric values",
          solution: `System.debug(100);\nSystem.debug(150);\nSystem.debug(10000);`,
        },
      },
    ],
  },

  {
    id: 'async-apex',
    title: 'Asynchronous Apex',
    icon: '⏳',
    color: '#5352ED',
    xpTotal: 350,
    description: 'Future methods, Queueable, Batch Apex, and Scheduled Apex.',
    lessons: [
      {
        id: 'future-methods',
        title: 'Future Methods',
        xp: 35,
        theory: `
## Future Methods

A **future method** runs in its own transaction — asynchronously, in the background. Use it when you need to:
- Make an HTTP callout from a trigger (callouts can't run synchronously in triggers)
- Avoid mixed DML (can't insert Setup objects and non-Setup objects in same transaction)
- Run code with higher governor limits

### Syntax

\`\`\`apex
@future
public static void myFutureMethod(List<Id> recordIds) {
    // Runs asynchronously — separate transaction
    List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :recordIds];
    for (Account acc : accounts) {
        // do something
    }
    update accounts;
}
\`\`\`

### Rules for Future Methods

1. Must be **\`static\`** and return **\`void\`**
2. Parameters must be **primitive types** (no SObjects!) — use IDs instead
3. Can't call future from future
4. Limit: 50 future calls per transaction, 250,000 per 24 hours

### Future with Callout

\`\`\`apex
@future(callout=true) // Required annotation for HTTP callouts!
public static void syncWithExternalSystem(Set<Id> contactIds) {
    List<Contact> contacts = [SELECT Id, Email, Name FROM Contact WHERE Id IN :contactIds];

    HttpRequest req = new HttpRequest();
    req.setEndpoint('https://api.example.com/sync');
    req.setMethod('POST');
    // ... set headers, body, etc.

    Http http = new Http();
    HttpResponse res = http.send(req);
    System.debug('Response: ' + res.getStatusCode());
}
\`\`\`
        `,
        codeExample: `// Future method pattern
public class AccountSyncService {

    @future(callout=true)
    public static void syncAccountsToERP(List<Id> accountIds) {
        // Runs in background — separate transaction
        List<Account> accounts = [
            SELECT Id, Name, AnnualRevenue, Industry
            FROM Account
            WHERE Id IN :accountIds
        ];

        // Make callout to ERP system
        // (callout code here)

        System.debug('Syncing ' + accounts.size() + ' accounts to ERP');
    }

    // Called from trigger or other class:
    public static void triggerSync(List<Account> accounts) {
        List<Id> ids = new List<Id>();
        for (Account a : accounts) ids.add(a.Id);
        syncAccountsToERP(ids);
    }
}`,
        exercise: {
          title: 'Future Method Syntax',
          instructions: "Debug the two annotations used for future methods:\n1. Basic future: `\"@future\"`\n2. Future with callout: `\"@future(callout=true)\"`\n\nExpected output:\n```\n@future\n@future(callout=true)\n```",
          starterCode: `// Debug the future method annotations\n`,
          expectedOutput: ['@future', '@future(callout=true)'],
          hint: "Two System.debug calls with the annotation strings",
          solution: `System.debug('@future');\nSystem.debug('@future(callout=true)');`,
        },
      },
      {
        id: 'batch-apex',
        title: 'Batch Apex',
        xp: 50,
        theory: `
## Batch Apex

**Batch Apex** lets you process millions of records by breaking them into chunks. Each chunk runs in its own transaction with fresh governor limits.

### Interface: \`Database.Batchable\`

\`\`\`apex
public class AccountCleanupBatch implements Database.Batchable<SObject> {

    // 1. START — Define the records to process
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name, Phone FROM Account WHERE Phone = null'
        );
    }

    // 2. EXECUTE — Process each chunk (default 200 records)
    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Account> accounts = (List<Account>) scope;
        for (Account acc : accounts) {
            acc.Phone = '000-UNKNOWN';
        }
        update accounts;
    }

    // 3. FINISH — Run after all chunks complete
    public void finish(Database.BatchableContext bc) {
        System.debug('Batch complete!');
        // Send email notification, etc.
    }
}

// RUN IT:
AccountCleanupBatch batch = new AccountCleanupBatch();
Database.executeBatch(batch, 200); // 200 = batch size
\`\`\`

### Batch with State (\`Database.Stateful\`)

To maintain state across batches (e.g., a counter):

\`\`\`apex
public class CountingBatch implements Database.Batchable<SObject>, Database.Stateful {
    public Integer totalProcessed = 0; // Persists across execute() calls

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM Contact');
    }

    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        totalProcessed += scope.size();
        // process records...
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Total processed: ' + totalProcessed);
    }
}
\`\`\`

### Limits
- Max **5 concurrent batch jobs**
- Batch size: 1–2,000 records (default 200, recommended 200)
- Use \`Database.getQueryLocator\` for up to 50M records
        `,
        codeExample: `// Template for a Batch Apex class
public class DataMigrationBatch implements Database.Batchable<SObject>, Database.Stateful {

    public Integer successCount = 0;
    public Integer errorCount = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // Query all records to process
        return Database.getQueryLocator('SELECT Id, Name, OldField__c FROM Account');
    }

    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Account> accounts = (List<Account>) scope;
        List<Account> toUpdate = new List<Account>();

        for (Account acc : accounts) {
            if (acc.OldField__c != null) {
                acc.NewField__c = acc.OldField__c;
                toUpdate.add(acc);
            }
        }

        try {
            update toUpdate;
            successCount += toUpdate.size();
        } catch (Exception e) {
            errorCount += scope.size();
            System.debug('Error: ' + e.getMessage());
        }
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('✅ Success: ' + successCount);
        System.debug('❌ Errors: ' + errorCount);
    }
}`,
        exercise: {
          title: 'Batch Apex Methods',
          instructions: "Debug the three method names that a Batch Apex class must implement:\n```\nstart\nexecute\nfinish\n```",
          starterCode: `// Debug the three required Batch Apex method names\n`,
          expectedOutput: ['start', 'execute', 'finish'],
          hint: "Three System.debug calls: start, execute, finish",
          solution: `System.debug('start');\nSystem.debug('execute');\nSystem.debug('finish');`,
        },
      },
    ],
  },

  {
    id: 'testing',
    title: 'Apex Testing',
    icon: '🧪',
    color: '#2ED573',
    xpTotal: 300,
    description: 'Write unit tests, achieve 75%+ code coverage, and mock callouts.',
    lessons: [
      {
        id: 'test-basics',
        title: 'Writing Test Classes',
        xp: 40,
        theory: `
## Apex Testing

Salesforce **requires 75%+ code coverage** before deploying to production. Test classes don't count against your org's code, and they run in isolation.

### Test Class Structure

\`\`\`apex
@isTest // Marks this as a test class
public class AccountServiceTest {

    // Runs before ALL tests — set up data
    @TestSetup
    static void makeData() {
        Account acc = new Account(Name = 'Test Account', Industry = 'Technology');
        insert acc;
    }

    // Each test method
    @isTest
    static void testGetAccountsByIndustry() {
        // Arrange — get test data
        List<Account> techAccounts = [SELECT Id, Name FROM Account WHERE Industry = 'Technology'];

        // Act — call the method you're testing
        Test.startTest();
        List<Account> result = AccountService.getByIndustry('Technology');
        Test.stopTest();

        // Assert — verify results
        System.assertEquals(1, result.size(), 'Should return 1 account');
        System.assertEquals('Test Account', result[0].Name, 'Name should match');
    }

    @isTest
    static void testGetAccountsByIndustry_NoResults() {
        Test.startTest();
        List<Account> result = AccountService.getByIndustry('NonExistent');
        Test.stopTest();

        System.assertEquals(0, result.size(), 'Should return empty list');
        System.assertNotEquals(null, result, 'Should never return null');
    }
}
\`\`\`

### Assert Methods

\`\`\`apex
System.assertEquals(expected, actual, 'message');     // Must be equal
System.assertNotEquals(expected, actual, 'message');  // Must not be equal
System.assert(condition, 'message');                   // Must be true

// Modern (preferred):
Assert.areEqual(expected, actual, 'message');
Assert.isTrue(condition, 'message');
Assert.isNotNull(value, 'message');
\`\`\`

### Best Practices

1. **Create test data in the test** — never use real org data (\`@SeeAllData=false\` is default)
2. **One assertion per test** method (clean, readable)
3. **Test happy path AND error cases**
4. **Use \`Test.startTest()\`/\`Test.stopTest()\`** — resets governor limits, runs async code
5. **Test bulk** — test with 200 records, not just 1
        `,
        codeExample: `@isTest
public class MathUtilTest {

    @isTest
    static void testAddPositiveNumbers() {
        Test.startTest();
        Integer result = MathUtil.add(5, 3);
        Test.stopTest();

        System.assertEquals(8, result, '5 + 3 should equal 8');
    }

    @isTest
    static void testAddNegativeNumbers() {
        Test.startTest();
        Integer result = MathUtil.add(-5, -3);
        Test.stopTest();

        System.assertEquals(-8, result, '-5 + -3 should equal -8');
    }

    @isTest
    static void testAddZero() {
        Test.startTest();
        Integer result = MathUtil.add(10, 0);
        Test.stopTest();

        System.assertEquals(10, result, 'Adding 0 should return original value');
    }
}`,
        exercise: {
          title: 'Test Assertions',
          instructions: "Debug the minimum code coverage percentage required for Salesforce production deployments.\n\nExpected output:\n```\n75\n```",
          starterCode: `// Debug the minimum code coverage percentage\n`,
          expectedOutput: ['75'],
          hint: "System.debug(75);",
          solution: `System.debug(75);`,
        },
      },
    ],
  },

  {
    id: 'exception-handling',
    title: 'Exception Handling',
    icon: '🚨',
    color: '#FF6B81',
    xpTotal: 200,
    description: 'Handle errors gracefully with try/catch and custom exceptions.',
    lessons: [
      {
        id: 'try-catch',
        title: 'Try / Catch / Finally',
        xp: 30,
        theory: `
## Exception Handling

Exceptions are runtime errors. Without handling them, your transaction fails and rolls back. Use \`try/catch\` to handle errors gracefully.

### Basic Structure

\`\`\`apex
try {
    // Code that might throw an error
    Integer result = 10 / 0; // ArithmeticException!
} catch (Exception e) {
    // Handle the error
    System.debug('Error: ' + e.getMessage());
    System.debug('Type: ' + e.getTypeName());
    System.debug('Stack: ' + e.getStackTraceString());
} finally {
    // ALWAYS runs, error or not (use for cleanup)
    System.debug('Transaction complete');
}
\`\`\`

### Common Exception Types

\`\`\`apex
try {
    // NullPointerException
    String s = null;
    Integer len = s.length(); // Boom!
} catch (NullPointerException e) {
    System.debug('Null value accessed');
}

try {
    // DmlException
    Account acc = new Account(); // Missing required Name!
    insert acc;
} catch (DmlException e) {
    System.debug('DML failed: ' + e.getDmlMessage(0));
    System.debug('Field: ' + e.getDmlFieldNames(0));
}

try {
    // QueryException — more than one row returned for singleton query
    Account acc = [SELECT Id FROM Account WHERE Name = 'Common Name'];
} catch (QueryException e) {
    System.debug('Query error: ' + e.getMessage());
}

try {
    // ListException — index out of bounds
    List<String> lst = new List<String>();
    String s = lst[0]; // Empty list!
} catch (ListException e) {
    System.debug('List error: ' + e.getMessage());
}
\`\`\`

### Custom Exceptions

\`\`\`apex
public class InsufficientFundsException extends Exception {}
public class InvalidAccountException extends Exception {}

public class BankService {
    public static void transfer(Decimal amount, Account from) {
        if (from == null) throw new InvalidAccountException('Account cannot be null');
        if (amount <= 0) throw new InsufficientFundsException('Amount must be positive');
        // ... transfer logic
    }
}

// Usage:
try {
    BankService.transfer(-100, null);
} catch (InvalidAccountException e) {
    System.debug('Invalid account: ' + e.getMessage());
} catch (InsufficientFundsException e) {
    System.debug('Insufficient funds: ' + e.getMessage());
}
\`\`\`
        `,
        codeExample: `try {
    Integer x = 10;
    Integer y = 0;
    
    if (y == 0) {
        throw new MathException('Cannot divide by zero');
    }
    
    Integer result = x / y;
    System.debug('Result: ' + result);
    
} catch (MathException e) {
    System.debug('Math error: ' + e.getMessage());
} catch (Exception e) {
    System.debug('Unexpected error: ' + e.getMessage());
} finally {
    System.debug('Execution complete');
}`,
        exercise: {
          title: 'Exception Handling Flow',
          instructions: "Write a try/catch that tries to debug `10/0` (which will throw), catches any Exception `e` and debugs its message, then has a finally block that debugs `\"done\"`.\n\nHint: In our runner, integer division by zero outputs the string `\"Division by zero\"`\n\nExpected output:\n```\nDivision by zero\ndone\n```",
          starterCode: `try {\n    // Try dividing by zero\n    Integer result = 10 / 0;\n    System.debug(result);\n} catch (Exception e) {\n    // Debug the exception message\n} finally {\n    // Debug 'done'\n}\n`,
          expectedOutput: ['Division by zero', 'done'],
          hint: "In the catch: System.debug(e.getMessage()); In finally: System.debug('done');",
          solution: `try {\n    Integer result = 10 / 0;\n    System.debug(result);\n} catch (Exception e) {\n    System.debug(e.getMessage());\n} finally {\n    System.debug('done');\n}`,
        },
      },
    ],
  },

  {
    id: 'callouts',
    title: 'HTTP Callouts',
    icon: '🌐',
    color: '#1E90FF',
    xpTotal: 250,
    description: 'Call external REST APIs from Apex and handle responses.',
    lessons: [
      {
        id: 'http-basics',
        title: 'REST Callouts',
        xp: 40,
        theory: `
## HTTP Callouts

Apex can call external APIs using the \`Http\`, \`HttpRequest\`, and \`HttpResponse\` classes.

### Basic GET Request

\`\`\`apex
HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.example.com/users/123');
req.setMethod('GET');
req.setHeader('Authorization', 'Bearer my-token');
req.setTimeout(10000); // 10 seconds max

Http http = new Http();
HttpResponse res = http.send(req);

System.debug('Status: ' + res.getStatusCode()); // 200
System.debug('Body: ' + res.getBody());          // JSON string
\`\`\`

### POST Request with JSON Body

\`\`\`apex
HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.example.com/contacts');
req.setMethod('POST');
req.setHeader('Content-Type', 'application/json');
req.setHeader('Authorization', 'Bearer my-token');

// Build JSON body
String jsonBody = JSON.serialize(new Map<String, Object>{
    'name' => 'John Doe',
    'email' => 'john@example.com'
});
req.setBody(jsonBody);

Http http = new Http();
HttpResponse res = http.send(req);

if (res.getStatusCode() == 201) {
    System.debug('Created: ' + res.getBody());
} else {
    System.debug('Error: ' + res.getStatus());
}
\`\`\`

### JSON Parsing

\`\`\`apex
// Parse a simple JSON response
String jsonStr = '{"id": 1, "name": "Acme Corp", "active": true}';
Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonStr);

String name = (String) data.get('name');
Boolean active = (Boolean) data.get('active');
Integer id = (Integer) data.get('id');
\`\`\`

### Callout Rules

1. **Must be in \`@future(callout=true)\`** or **Queueable** from triggers
2. **Named Credentials** — store endpoint + auth safely (don't hardcode!)
3. **Remote Site Settings** — must whitelist the endpoint URL
4. **Mocking in tests** — must use \`HttpCalloutMock\` interface in test classes

### Mock for Testing

\`\`\`apex
@isTest
public class ExternalServiceMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"status": "ok"}');
        return res;
    }
}

@isTest
static void testCallout() {
    Test.setMock(HttpCalloutMock.class, new ExternalServiceMock());
    Test.startTest();
    // Call your service method
    Test.stopTest();
}
\`\`\`
        `,
        codeExample: `// REST Callout Service Pattern
public class WeatherService {

    public static String getWeather(String city) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Weather_API/weather?q=' + EncodingUtil.urlEncode(city, 'UTF-8'));
        req.setMethod('GET');
        req.setTimeout(5000);

        Http http = new Http();

        try {
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                return (String) data.get('description');
            } else {
                System.debug('API Error: ' + res.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            System.debug('Callout failed: ' + e.getMessage());
            return null;
        }
    }
}`,
        exercise: {
          title: 'HTTP Methods',
          instructions: "Debug the HTTP methods used for:\n1. Retrieving data → `\"GET\"`\n2. Creating data → `\"POST\"`\n3. Updating data → `\"PUT\"`\n4. Deleting data → `\"DELETE\"`\n\nExpected output:\n```\nGET\nPOST\nPUT\nDELETE\n```",
          starterCode: `// Debug the four main HTTP methods\n`,
          expectedOutput: ['GET', 'POST', 'PUT', 'DELETE'],
          hint: "Four System.debug calls with the HTTP method names",
          solution: `System.debug('GET');\nSystem.debug('POST');\nSystem.debug('PUT');\nSystem.debug('DELETE');`,
        },
      },
    ],
  },
];

export const BADGES = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🚀' },
  { id: 'foundations-done', title: 'Foundation Builder', description: 'Complete Apex Foundations', icon: '🏗️' },
  { id: 'streak-3', title: '3-Day Streak', description: 'Learn 3 days in a row', icon: '🔥' },
  { id: 'streak-7', title: 'Week Warrior', description: 'Learn 7 days in a row', icon: '⚡' },
  { id: 'xp-100', title: 'First 100 XP', description: 'Earn 100 XP', icon: '⭐' },
  { id: 'xp-500', title: 'Power Learner', description: 'Earn 500 XP', icon: '💫' },
  { id: 'collections-done', title: 'Data Wrangler', description: 'Master Collections', icon: '📦' },
  { id: 'oop-done', title: 'Object Architect', description: 'Master OOP', icon: '🏛️' },
  { id: 'halfway', title: 'Halfway There', description: 'Complete 5 modules', icon: '🎯' },
  { id: 'champion', title: 'Apex Champion', description: 'Complete all modules', icon: '🏆' },
];
