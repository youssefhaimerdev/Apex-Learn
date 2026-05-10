// ─────────────────────────────────────────────────────────────────────────────
// APEXLEARN — Flashcard Database (SRS)
// Each card: { id, deck, front, back, code? }
// ─────────────────────────────────────────────────────────────────────────────

export const FLASHCARD_DECKS = [
  {
    id: 'syntax',
    title: 'Apex Syntax',
    icon: '📝',
    color: '#00A1E0',
    description: 'Core language syntax and primitives',
  },
  {
    id: 'collections',
    title: 'Collections',
    icon: '📦',
    color: '#7B68EE',
    description: 'List, Set, Map methods',
  },
  {
    id: 'soql',
    title: 'SOQL',
    icon: '🗄️',
    color: '#FFD700',
    description: 'Query language and patterns',
  },
  {
    id: 'limits',
    title: 'Governor Limits',
    icon: '🛡️',
    color: '#FFA502',
    description: 'All the critical numbers',
  },
  {
    id: 'triggers',
    title: 'Triggers',
    icon: '⚡',
    color: '#FF4757',
    description: 'Events, context vars, patterns',
  },
  {
    id: 'async',
    title: 'Async Apex',
    icon: '⏳',
    color: '#5352ED',
    description: 'Future, Queueable, Batch, Schedule',
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: '🧪',
    color: '#2ED573',
    description: 'Test classes, coverage, mocking',
  },
  {
    id: 'oop',
    title: 'OOP',
    icon: '🏛️',
    color: '#FF6B81',
    description: 'Classes, inheritance, interfaces',
  },
  {
    id: 'dml',
    title: 'DML',
    icon: '✍️',
    color: '#2ED573',
    description: 'Data manipulation operations',
  },
  {
    id: 'security',
    title: 'Security',
    icon: '🔐',
    color: '#6C5CE7',
    description: 'Sharing, CRUD, FLS',
  },
];

export const FLASHCARDS = [

  // ── SYNTAX ────────────────────────────────────────────────────────────────
  { id: 's1',  deck: 'syntax', front: 'How do you declare an Integer variable named `count` with value 10?', back: 'Integer count = 10;', code: 'Integer count = 10;' },
  { id: 's2',  deck: 'syntax', front: 'What is the correct way to print output in Apex?', back: 'System.debug(value)\n\nThis outputs to the Debug Log in Developer Console.', code: "System.debug('Hello!');" },
  { id: 's3',  deck: 'syntax', front: 'What decimal type should ALWAYS be used for monetary values?', back: 'Decimal\n\nNever use Double for money — Decimal gives precise arithmetic without floating-point errors.', code: 'Decimal price = 19.99;' },
  { id: 's4',  deck: 'syntax', front: 'What is a null value in Apex and why is it dangerous?', back: 'null means "no value assigned". Calling any method on a null reference throws NullPointerException and crashes the transaction.', code: 'String s = null;\nif (s != null) { // always check!\n    System.debug(s.length());\n}' },
  { id: 's5',  deck: 'syntax', front: 'How do you declare a constant in Apex?', back: 'Use the final keyword. The value cannot be changed after assignment.', code: 'final Integer MAX = 200;\nfinal String APP = \'MyApp\';' },
  { id: 's6',  deck: 'syntax', front: 'What is the difference between Integer division and Decimal division?', back: 'Integer division truncates: 10/3 = 3\nDecimal division is precise: 10.0/3 = 3.333…\n\nAlways cast to Decimal when you need fractions.', code: 'System.debug(10/3);     // 3\nSystem.debug(10.0/3);   // 3.333...' },
  { id: 's7',  deck: 'syntax', front: 'How do you get the remainder (modulo) in Apex?', back: 'Use Math.mod(a, b) — the % operator does NOT exist in Apex!', code: 'System.debug(Math.mod(10, 3)); // 1' },
  { id: 's8',  deck: 'syntax', front: 'Name the 5 basic primitive types in Apex', back: '1. Integer — whole numbers\n2. Decimal — precise decimals\n3. String — text\n4. Boolean — true/false\n5. Id — Salesforce record ID\n\nAlso: Long, Double, Date, DateTime, Blob' },
  { id: 's9',  deck: 'syntax', front: 'How do you convert a String to an Integer?', back: 'Integer.valueOf(\'42\') returns 42\n\nAlso: String.valueOf(42) goes the other way.', code: 'Integer n = Integer.valueOf(\'42\');\nString s = String.valueOf(42);' },
  { id: 's10', deck: 'syntax', front: 'What does the ternary operator look like in Apex?', back: 'condition ? valueIfTrue : valueIfFalse', code: 'Integer age = 20;\nString s = (age >= 18) ? \'Adult\' : \'Minor\';\nSystem.debug(s); // Adult' },
  { id: 's11', deck: 'syntax', front: 'How do you check if a String is null or empty?', back: 'String.isBlank(s) — returns true if null, empty, or whitespace\nString.isNotBlank(s) — the opposite', code: 'String.isBlank(null);  // true\nString.isBlank(\'\');    // true\nString.isBlank(\' \');   // true\nString.isBlank(\'hi\'); // false' },
  { id: 's12', deck: 'syntax', front: 'What is the correct way to compare two Strings in Apex?', back: 'Use .equals() — never ==\nThe == operator can be unreliable for String comparison.', code: 'String a = \'hello\';\nBoolean same = a.equals(\'hello\'); // true ✅\nBoolean bad = (a == \'hello\');    // unreliable ❌' },
  { id: 's13', deck: 'syntax', front: 'How does a switch statement look in Apex?', back: 'switch on variable {\n    when value1 { }\n    when value2, value3 { }\n    when else { }\n}', code: 'switch on status {\n    when \'Open\'   { System.debug(\'Open\'); }\n    when \'Closed\' { System.debug(\'Closed\'); }\n    when else     { System.debug(\'Other\'); }\n}' },
  { id: 's14', deck: 'syntax', front: 'What is the difference between break and continue in a loop?', back: 'break — exits the loop entirely\ncontinue — skips the rest of this iteration and goes to the next', code: 'for (Integer i = 0; i < 5; i++) {\n    if (i == 2) continue; // skip 2\n    if (i == 4) break;    // stop at 4\n    System.debug(i); // 0, 1, 3\n}' },
  { id: 's15', deck: 'syntax', front: 'What is the for-each loop syntax in Apex?', back: 'for (ElementType element : collection) { }', code: 'List<String> names = new List<String>{\'Alice\', \'Bob\'};\nfor (String name : names) {\n    System.debug(name);\n}' },

  // ── COLLECTIONS ───────────────────────────────────────────────────────────
  { id: 'c1',  deck: 'collections', front: 'How do you create an empty List of Strings?', back: 'List<String> names = new List<String>();', code: 'List<String> names = new List<String>();\nList<Integer> nums = new List<Integer>{1, 2, 3};' },
  { id: 'c2',  deck: 'collections', front: 'What is the difference between List, Set, and Map?', back: 'List — ordered, indexed, allows duplicates\nSet — unordered, NO duplicates\nMap — key-value pairs, unique keys' },
  { id: 'c3',  deck: 'collections', front: 'How do you add an element to a List?', back: '.add(element) — adds to the end\n.add(index, element) — inserts at position', code: 'List<String> lst = new List<String>();\nlst.add(\'Apple\');\nlst.add(0, \'Banana\'); // insert at start' },
  { id: 'c4',  deck: 'collections', front: 'How do you get the number of elements in any collection?', back: '.size() works on List, Set, and Map', code: 'lst.size()   // List count\nset.size()   // Set count\nmap.size()   // Map count' },
  { id: 'c5',  deck: 'collections', front: 'How do you instantly deduplicate a List?', back: 'Convert to Set — it removes duplicates automatically', code: 'List<String> dupes = new List<String>{\'a\',\'b\',\'a\'};\nSet<String> unique = new Set<String>(dupes);\nSystem.debug(unique.size()); // 2' },
  { id: 'c6',  deck: 'collections', front: 'What are the key Map methods?', back: '.put(key, value) — add/update\n.get(key) — retrieve\n.containsKey(key) — check\n.keySet() — all keys as Set\n.values() — all values as List\n.size() — count', code: 'Map<String, Integer> m = new Map<String, Integer>();\nm.put(\'Alice\', 95);\nSystem.debug(m.get(\'Alice\')); // 95\nSystem.debug(m.containsKey(\'Bob\')); // false' },
  { id: 'c7',  deck: 'collections', front: 'What is the Map<Id, SObject> pattern and why is it used?', back: 'Create a map from a list of records for O(1) lookups without extra queries.\n\nnew Map<Id, Account>(accountList) creates the map in one line.', code: 'List<Account> accs = [SELECT Id, Name FROM Account];\nMap<Id, Account> accMap = new Map<Id, Account>(accs);\n// Now: accMap.get(someId) — instant lookup!' },
  { id: 'c8',  deck: 'collections', front: 'How do you sort a List?', back: '.sort() — sorts ascending (alphabetical for Strings, numerical for numbers)', code: 'List<Integer> nums = new List<Integer>{5, 2, 8, 1};\nnums.sort();\nSystem.debug(nums); // (1, 2, 5, 8)' },
  { id: 'c9',  deck: 'collections', front: 'How do you check if a collection is empty?', back: '.isEmpty() — preferred\nAlternatively: .size() == 0', code: 'List<String> lst = new List<String>();\nSystem.debug(lst.isEmpty()); // true' },
  { id: 'c10', deck: 'collections', front: 'How do you merge two Lists in Apex?', back: '.addAll(otherList) — appends all elements from other into this list', code: 'List<Integer> a = new List<Integer>{1,2,3};\nList<Integer> b = new List<Integer>{4,5,6};\na.addAll(b);\nSystem.debug(a); // (1,2,3,4,5,6)' },
  { id: 'c11', deck: 'collections', front: 'What does .clone() do on a collection?', back: 'Creates a shallow copy — changes to the copy do NOT affect the original', code: 'List<Integer> original = new List<Integer>{1,2,3};\nList<Integer> copy = original.clone();\ncopy.add(4);\nSystem.debug(original.size()); // still 3!' },
  { id: 'c12', deck: 'collections', front: 'How do you perform Set intersection (keep only elements in BOTH sets)?', back: '.retainAll(otherSet) — modifies the set in place, keeping only shared elements', code: 'Set<Integer> a = new Set<Integer>{1,2,3,4};\nSet<Integer> b = new Set<Integer>{3,4,5,6};\na.retainAll(b);\nSystem.debug(a); // {3, 4}' },

  // ── SOQL ──────────────────────────────────────────────────────────────────
  { id: 'q1',  deck: 'soql', front: 'What is the basic SOQL query structure?', back: 'SELECT field1, field2\nFROM ObjectName\nWHERE condition\nORDER BY field ASC|DESC\nLIMIT n', code: 'List<Account> accs = [\n    SELECT Id, Name, Phone\n    FROM Account\n    WHERE Industry = \'Technology\'\n    ORDER BY Name\n    LIMIT 50\n];' },
  { id: 'q2',  deck: 'soql', front: 'How do you inject an Apex variable into a SOQL query?', back: 'Use the : (colon) bind variable syntax. Never concatenate strings — that causes SOQL injection!', code: 'String industry = \'Technology\';\nList<Account> accs = [\n    SELECT Name FROM Account\n    WHERE Industry = :industry // ✅ safe\n];' },
  { id: 'q3',  deck: 'soql', front: 'How do you query child records in a parent query?', back: 'Use a subquery in the SELECT clause using the child relationship name (usually plural)', code: 'List<Account> accs = [\n    SELECT Name,\n        (SELECT FirstName, Email FROM Contacts)\n    FROM Account\n];' },
  { id: 'q4',  deck: 'soql', front: 'How do you query a parent field from a child object?', back: 'Use dot notation: ParentRelationship.FieldName', code: 'List<Contact> cons = [\n    SELECT Name, Account.Name, Account.Industry\n    FROM Contact\n];' },
  { id: 'q5',  deck: 'soql', front: 'What SOQL date literal means "this calendar year"?', back: 'THIS_YEAR\n\nOther useful literals:\nTODAY, YESTERDAY, THIS_WEEK, THIS_MONTH, THIS_QUARTER\nLAST_N_DAYS:30, NEXT_N_DAYS:7' },
  { id: 'q6',  deck: 'soql', front: 'How do you get a count of records in SOQL?', back: 'SELECT COUNT() FROM ObjectName\n\nThis returns an Integer directly — not a List', code: 'Integer total = [SELECT COUNT() FROM Account\n    WHERE Industry = \'Technology\'];' },
  { id: 'q7',  deck: 'soql', front: 'What SOQL wildcard is used for partial matching?', back: '% in a LIKE clause\n  % = any characters\n  _ = single character', code: '[SELECT Name FROM Account WHERE Name LIKE \'Acme%\']\n// starts with Acme\n[SELECT Name FROM Account WHERE Name LIKE \'%Corp\']\n// ends with Corp\n[SELECT Name FROM Account WHERE Name LIKE \'%Tech%\']\n// contains Tech' },
  { id: 'q8',  deck: 'soql', front: 'What is the #1 SOQL anti-pattern?', back: 'Querying inside a loop!\n\nEach loop iteration uses one of your 100 SOQL limit. With 200 trigger records, you hit the limit immediately.', code: '// ❌ NEVER\nfor (Opportunity opp : opps) {\n    Account a = [SELECT Name FROM Account\n        WHERE Id = :opp.AccountId]; // BAD!\n}\n\n// ✅ CORRECT: one query, use a Map' },
  { id: 'q9',  deck: 'soql', front: 'What does WITH SECURITY_ENFORCED do in SOQL?', back: 'Enforces field-level security — throws QueryException if the user lacks access to any field in the query. Use it for security-compliant queries.', code: 'List<Account> accs = [\n    SELECT Id, Name, AnnualRevenue\n    FROM Account\n    WITH SECURITY_ENFORCED\n    LIMIT 100\n];' },
  { id: 'q10', deck: 'soql', front: 'What is the difference between static SOQL and dynamic SOQL?', back: 'Static SOQL — inside [ ] brackets, validated at compile time. Safer.\n\nDynamic SOQL — string passed to Database.query(), built at runtime. More flexible but risks SOQL injection if not careful.', code: '// Static (preferred)\nList<Account> a = [SELECT Id FROM Account];\n\n// Dynamic\nString q = \'SELECT Id FROM Account\';\nList<Account> b = Database.query(q);' },
  { id: 'q11', deck: 'soql', front: 'What do GROUP BY and HAVING do in SOQL?', back: 'GROUP BY — aggregates results by a field\nHAVING — filters aggregated groups (like WHERE but for groups)', code: 'AggregateResult[] r = [\n    SELECT Industry, COUNT(Id) total\n    FROM Account\n    GROUP BY Industry\n    HAVING COUNT(Id) > 5\n];' },
  { id: 'q12', deck: 'soql', front: 'How does OFFSET work in SOQL?', back: 'OFFSET n — skips the first n records. Used for pagination.\n\nMax offset: 2,000', code: '// Page 2 (records 51-100)\nList<Account> p2 = [\n    SELECT Name FROM Account\n    ORDER BY Name\n    LIMIT 50\n    OFFSET 50\n];' },

  // ── GOVERNOR LIMITS ───────────────────────────────────────────────────────
  { id: 'l1',  deck: 'limits', front: 'Max SOQL queries per synchronous transaction?', back: '100\n\nAsync: 200' },
  { id: 'l2',  deck: 'limits', front: 'Max DML statements per transaction?', back: '150\n\n(Both sync and async)' },
  { id: 'l3',  deck: 'limits', front: 'Max DML rows per transaction?', back: '10,000 rows\n\nThis is the total number of records across all DML operations.' },
  { id: 'l4',  deck: 'limits', front: 'Max CPU time for synchronous Apex?', back: '10,000 ms (10 seconds)\n\nAsync: 60,000 ms (60 seconds)' },
  { id: 'l5',  deck: 'limits', front: 'Max heap size in synchronous Apex?', back: '6 MB sync\n12 MB async' },
  { id: 'l6',  deck: 'limits', front: 'Max SOQL rows returned in a query?', back: '50,000 rows\n\nWith Database.getQueryLocator (Batch only): 50 million' },
  { id: 'l7',  deck: 'limits', front: 'Max HTTP callouts per transaction?', back: '100 callouts\n\nMax timeout per callout: 120 seconds' },
  { id: 'l8',  deck: 'limits', front: 'How do you check how many SOQL queries you\'ve used?', back: 'Limits.getQueries() — used so far\nLimits.getLimitQueries() — the max (100)', code: 'System.debug(\'SOQL used: \' + Limits.getQueries()\n    + \'/\' + Limits.getLimitQueries());' },
  { id: 'l9',  deck: 'limits', front: 'What happens when you hit a governor limit?', back: 'Apex throws System.LimitException — which CANNOT be caught. The entire transaction is rolled back.' },
  { id: 'l10', deck: 'limits', front: 'Max trigger batch size (records per trigger execution)?', back: '200 records per batch\n\nAlways write trigger code to handle 200 records at once — never assume only 1 record.' },
  { id: 'l11', deck: 'limits', front: 'Max future method calls per transaction?', back: '50 @future calls per transaction\n250,000 per 24 hours' },
  { id: 'l12', deck: 'limits', front: 'Max concurrent batch jobs per org?', back: '5 concurrent batch jobs\n\n100 scheduled jobs per org' },

  // ── TRIGGERS ──────────────────────────────────────────────────────────────
  { id: 't1',  deck: 'triggers', front: 'List all 7 trigger events in Apex', back: '1. before insert\n2. after insert\n3. before update\n4. after update\n5. before delete\n6. after delete\n7. after undelete' },
  { id: 't2',  deck: 'triggers', front: 'What is Trigger.new?', back: 'A List<SObject> containing the new/updated versions of records.\n\nAvailable in: insert, update, undelete triggers.\nIn before triggers: records can still be modified.', code: 'for (Account acc : Trigger.new) {\n    acc.Description = \'Updated\';\n}' },
  { id: 't3',  deck: 'triggers', front: 'What is Trigger.oldMap?', back: 'A Map<Id, SObject> of records BEFORE the change.\n\nAvailable in: update and delete triggers.\nUse it to detect which fields changed.', code: 'for (Account acc : Trigger.new) {\n    Account old = Trigger.oldMap.get(acc.Id);\n    if (acc.Name != old.Name) {\n        // Name changed!\n    }\n}' },
  { id: 't4',  deck: 'triggers', front: 'Can you modify records in an after trigger?', back: 'NO — you cannot modify Trigger.new in an after trigger. Records are already saved.\n\nIn after triggers, you need to query and update records separately.' },
  { id: 't5',  deck: 'triggers', front: 'What is the #1 trigger rule?', back: 'ONE trigger per object.\n\nMultiple triggers on the same object fire in unpredictable order. Use a single trigger that delegates to a handler class.' },
  { id: 't6',  deck: 'triggers', front: 'What context variables are available in ALL triggers?', back: 'Trigger.isInsert, Trigger.isUpdate, Trigger.isDelete\nTrigger.isBefore, Trigger.isAfter\nTrigger.size — number of records in the batch\nTrigger.operationType' },
  { id: 't7',  deck: 'triggers', front: 'What is the Trigger Handler pattern?', back: '1. Trigger file = THIN (just routes to handler)\n2. Handler class = all logic\n3. Handler implements an interface\n4. One handler method per event (beforeInsert, afterUpdate, etc.)' },
  { id: 't8',  deck: 'triggers', front: 'How do you detect a field change in a trigger?', back: 'Compare Trigger.new value to Trigger.oldMap value', code: 'for (Opportunity opp : Trigger.new) {\n    Opportunity old = Trigger.oldMap.get(opp.Id);\n    if (opp.StageName != old.StageName) {\n        // Stage changed!\n    }\n}' },

  // ── ASYNC ─────────────────────────────────────────────────────────────────
  { id: 'a1',  deck: 'async', front: 'What are the 4 types of asynchronous Apex?', back: '1. @future — simple background method\n2. Queueable — chainable, non-primitive params\n3. Batch Apex — process millions of records\n4. Schedulable — run on a time schedule' },
  { id: 'a2',  deck: 'async', front: 'What are the rules for @future methods?', back: '1. Must be static void\n2. Parameters must be primitives (no SObjects!)\n3. Cannot call future from future\n4. Add (callout=true) for HTTP calls\n5. Max 50 per transaction', code: '@future(callout=true)\npublic static void sync(List<Id> ids) {\n    // runs async\n}' },
  { id: 'a3',  deck: 'async', front: 'What interface does Queueable implement?', back: 'Queueable — one method: execute(QueueableContext ctx)\n\nFor callouts: also implement Database.AllowsCallouts', code: 'public class MyJob implements Queueable {\n    public void execute(QueueableContext ctx) {\n        // your logic\n        System.enqueueJob(new NextJob()); // chain!\n    }\n}' },
  { id: 'a4',  deck: 'async', front: 'What are the 3 methods required for Batch Apex?', back: '1. start(BatchableContext) → QueryLocator\n2. execute(BatchableContext, List<SObject>) → void\n3. finish(BatchableContext) → void', code: 'implements Database.Batchable<SObject>' },
  { id: 'a5',  deck: 'async', front: 'How do you preserve state across Batch execute() calls?', back: 'Implement Database.Stateful interface.\n\nWithout it, instance variables reset between execute() calls.', code: 'public class MyBatch implements\n    Database.Batchable<SObject>, Database.Stateful {\n    public Integer totalCount = 0; // persists!\n}' },
  { id: 'a6',  deck: 'async', front: 'How do you run a Batch Apex job?', back: 'Database.executeBatch(new MyBatch(), batchSize)\n\nDefault batch size: 200. Max: 2,000.', code: 'Id jobId = Database.executeBatch(new CleanupBatch(), 200);' },
  { id: 'a7',  deck: 'async', front: 'How do you schedule a recurring Apex job?', back: 'Implement Schedulable, call System.schedule(name, cron, job)', code: 'String cron = \'0 0 2 * * ?\';\n// Every day at 2 AM\nSystem.schedule(\'Nightly Job\', cron, new MyJob());' },
  { id: 'a8',  deck: 'async', front: 'What is the CRON format in Apex Scheduler?', back: 'Seconds Minutes Hours Day Month Weekday Year\n\n0 0 2 * * ?  = every day at 2 AM\n0 0 12 ? * MON = every Monday at noon' },

  // ── TESTING ───────────────────────────────────────────────────────────────
  { id: 'ts1', deck: 'testing', front: 'What code coverage is required to deploy to production?', back: '75% overall code coverage across ALL Apex code.\n\nIndividual test methods don\'t have a minimum, but all test methods must pass.' },
  { id: 'ts2', deck: 'testing', front: 'What annotation marks a test class?', back: '@isTest on the class\n@isTest on each test method\n\nTest code doesn\'t count toward your org\'s code limit.' },
  { id: 'ts3', deck: 'testing', front: 'What does @TestSetup do?', back: 'Runs ONCE before all test methods in the class. Creates shared test data.\n\nMore efficient than creating data in each method. Data is rolled back after each test.' },
  { id: 'ts4', deck: 'testing', front: 'Why use Test.startTest() and Test.stopTest()?', back: '1. Resets governor limits for code inside\n2. Forces async operations (future, Queueable) to execute synchronously before stopTest() returns', code: 'Test.startTest();\n// code under test runs here with fresh limits\nTest.stopTest();\n// assert results here' },
  { id: 'ts5', deck: 'testing', front: 'What are the main System.assert methods?', back: 'System.assertEquals(expected, actual, msg)\nSystem.assertNotEquals(expected, actual, msg)\nSystem.assert(condition, msg)\n\nModern: Assert.areEqual(), Assert.isTrue(), Assert.isNull()' },
  { id: 'ts6', deck: 'testing', front: 'How do you test HTTP callouts?', back: '1. Create a class implementing HttpCalloutMock\n2. Call Test.setMock(HttpCalloutMock.class, new MyMock())\n3. Real HTTP requests are intercepted and your mock\'s respond() is called instead' },
  { id: 'ts7', deck: 'testing', front: 'Should test classes use @SeeAllData=true?', back: 'NO — almost never.\n\n@SeeAllData=true lets tests see real org data, making tests brittle and environment-dependent. Always create your own test data.' },
  { id: 'ts8', deck: 'testing', front: 'What is the Test Data Factory pattern?', back: 'A separate @isTest class with static methods that create test records.\n\nAvoids duplicating test data creation across test classes.', code: '@isTest\npublic class TestFactory {\n    public static Account createAccount(String name) {\n        Account a = new Account(Name = name);\n        insert a;\n        return a;\n    }\n}' },

  // ── OOP ───────────────────────────────────────────────────────────────────
  { id: 'o1',  deck: 'oop', front: 'What is the difference between virtual and abstract methods?', back: 'virtual — CAN be overridden, has a default body\nabstract — MUST be overridden, has NO body\n\nAn abstract class cannot be instantiated.' },
  { id: 'o2',  deck: 'oop', front: 'What keyword is required to override a parent method?', back: 'override\n\nThe parent method must be declared virtual or abstract.', code: 'public class Dog extends Animal {\n    public override String speak() {\n        return \'Woof!\';\n    }\n}' },
  { id: 'o3',  deck: 'oop', front: 'Can a class extend multiple classes in Apex?', back: 'NO — Apex only supports single inheritance (extends one class).\n\nBut a class can implement MULTIPLE interfaces.' },
  { id: 'o4',  deck: 'oop', front: 'What does super() do?', back: 'Calls the parent class constructor. Must be the first statement in the child constructor.', code: 'public class Dog extends Animal {\n    public Dog(String name) {\n        super(name); // calls Animal(name)\n    }\n}' },
  { id: 'o5',  deck: 'oop', front: 'What is an interface vs an abstract class?', back: 'Interface:\n• No method bodies\n• No properties\n• A class can implement multiple\n\nAbstract Class:\n• Can have method bodies (virtual)\n• Can have properties\n• A class can only extend one' },
  { id: 'o6',  deck: 'oop', front: 'What are the 4 access modifiers in Apex?', back: 'public — accessible anywhere in the org\nprivate — only within the same class\nprotected — class + subclasses\nglobal — anywhere + managed packages' },
  { id: 'o7',  deck: 'oop', front: 'What is the Singleton design pattern?', back: 'Ensures only ONE instance of a class is ever created. Use a private constructor and a static getInstance() method.', code: 'public class Config {\n    private static Config instance;\n    private Config() {}\n    public static Config getInstance() {\n        if (instance == null) instance = new Config();\n        return instance;\n    }\n}' },

  // ── DML ───────────────────────────────────────────────────────────────────
  { id: 'd1',  deck: 'dml', front: 'List the 5 DML operations in Apex', back: '1. insert — create new records\n2. update — modify existing (needs Id)\n3. delete — move to Recycle Bin\n4. undelete — restore from Recycle Bin\n5. upsert — insert if new, update if exists' },
  { id: 'd2',  deck: 'dml', front: 'When is a record\'s Id populated after insert?', back: 'Immediately after the insert statement.\n\nBefore insert: Id is null\nAfter insert: Id is populated on the same object reference', code: 'Account a = new Account(Name = \'Test\');\nSystem.debug(a.Id); // null\ninsert a;\nSystem.debug(a.Id); // 0015... populated!' },
  { id: 'd3',  deck: 'dml', front: 'What is the difference between insert and Database.insert?', back: 'insert — throws exception if any record fails (all-or-nothing)\n\nDatabase.insert(records, false) — allows partial success, returns SaveResult[] with success/error per record' },
  { id: 'd4',  deck: 'dml', front: 'What is a Savepoint and when do you use it?', back: 'A checkpoint you can roll back to.\n\nUse when you need to undo a series of DML operations on error.', code: 'Savepoint sp = Database.setSavepoint();\ntry {\n    insert a; insert b;\n} catch (Exception e) {\n    Database.rollback(sp); // undo both!\n}' },
  { id: 'd5',  deck: 'dml', front: 'What does upsert use to decide insert vs update?', back: 'An external ID field specified in the upsert statement.\n\nIf a record with that external ID exists → update\nIf not → insert', code: 'upsert account Account.External_Id__c;\n// Matches on External_Id__c field' },
  { id: 'd6',  deck: 'dml', front: 'What is the DML inside a loop anti-pattern?', back: 'Putting insert/update/delete inside a for loop — each iteration counts as a DML statement. With 150 records you hit the 150 DML limit.\n\nFix: Build a list first, then ONE DML after the loop.' },

  // ── SECURITY ──────────────────────────────────────────────────────────────
  { id: 'sec1', deck: 'security', front: 'What does "with sharing" mean on a class?', back: 'The running user\'s sharing rules are enforced — they only see records they have access to.\n\nThis is the SAFEST default for user-facing code.' },
  { id: 'sec2', deck: 'security', front: 'What does "without sharing" mean?', back: 'Sharing rules are ignored — the code runs as system and can see ALL records.\n\nUse only for admin/system utilities where sharing bypass is intentional.' },
  { id: 'sec3', deck: 'security', front: 'What is "inherited sharing"?', back: 'The class inherits the sharing context of the code that called it.\n\nBest for reusable service classes that should behave differently depending on who calls them.' },
  { id: 'sec4', deck: 'security', front: 'How do you check if a user can create an Account?', back: 'Schema.sObjectType.Account.isCreateable()\n\nAlso: isAccessible() (read), isUpdateable() (edit), isDeletable() (delete)', code: 'if (!Schema.sObjectType.Account.isCreateable()) {\n    throw new SecurityException(\'No create access\');\n}\ninsert new Account(Name = \'Test\');' },
  { id: 'sec5', deck: 'security', front: 'What is SOQL injection and how do you prevent it?', back: 'SOQL injection = user input that manipulates a dynamic query to expose or corrupt data.\n\nPrevention:\n1. Use bind variables (:variable) in static SOQL\n2. Use String.escapeSingleQuotes() in dynamic SOQL\n3. Whitelist allowed values', code: '// SAFE\nString safe = String.escapeSingleQuotes(userInput);\nString q = \'SELECT Id FROM Account WHERE Name = \\\'\' + safe + \'\\\'\';' },
];

export const TOTAL_CARDS = FLASHCARDS.length;
