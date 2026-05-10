// ─────────────────────────────────────────────────────────────────────────────
// CURRICULUM PART 2 — Modules 10–15
// ─────────────────────────────────────────────────────────────────────────────

export const CURRICULUM_PART2 = [

// ═══════════════════════════════════════════════════════════
// MODULE 10 — ASYNCHRONOUS APEX
// ═══════════════════════════════════════════════════════════
{
  id: 'async-apex', title: 'Asynchronous Apex', icon: '⏳', color: '#5352ED', xpTotal: 350,
  description: 'Future methods, Queueable, Batch Apex, and Scheduled Apex — run heavy work in the background.',
  quizQuestions: [
    { q: 'Future method parameters must be:', options: ['SObjects', 'Primitive types only', 'Any type', 'Lists only'], answer: 1 },
    { q: 'To make HTTP callouts in async Apex you need:', options: ['@future only', '@future(callout=true)', 'callout=true annotation', 'No special annotation'], answer: 1 },
    { q: 'Batch Apex processes records in chunks called:', options: ['Batches', 'Scope', 'Pages', 'Chunks'], answer: 1 },
    { q: 'Scheduled Apex implements which interface?', options: ['Database.Batchable', 'Queueable', 'Schedulable', 'Callable'], answer: 2 },
    { q: 'Queueable is preferred over future when you need:', options: ['Higher limits', 'Faster execution', 'Chaining and non-primitive parameters', 'Less code'], answer: 2 },
  ],
  lessons: [
    {
      id: 'future-methods', title: 'Future Methods', xp: 35,
      theory: `## Future Methods

A \`@future\` method runs **asynchronously** — in a separate transaction after the current one completes.

### When to Use

- HTTP callouts from triggers (callouts not allowed in sync trigger context)
- Mixed DML (Setup + non-Setup objects in same transaction)
- Heavy processing you don't want blocking the UI

### Syntax

\`\`\`apex
public class IntegrationService {

    @future
    public static void syncRecords(List<Id> recordIds) {
        // Runs in background — fresh governor limits!
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :recordIds];
        // ... process
    }

    @future(callout=true)  // Required for HTTP callouts!
    public static void syncToExternalSystem(Set<Id> contactIds) {
        List<Contact> contacts = [SELECT Name, Email FROM Contact WHERE Id IN :contactIds];
        // Make HTTP callout here
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com/contacts');
        req.setMethod('POST');
        // ...
        Http http = new Http();
        HttpResponse res = http.send(req);
    }
}
\`\`\`

### Rules

1. **Must be \`static\` and return \`void\`**
2. **Parameters must be primitives** — no SObjects! Pass IDs instead.
3. **Cannot call future from future**
4. **Cannot be called from Batch Apex**
5. Limit: 50 future calls per transaction, 250,000/24 hours

\`\`\`apex
// ❌ Can't pass SObjects
@future
public static void bad(Account acc) { ... } // ERROR!

// ✅ Pass the ID, re-query inside
@future
public static void good(Id accountId) {
    Account acc = [SELECT Id, Name FROM Account WHERE Id = :accountId];
    // ...
}
\`\`\``,
      codeExample: `// Real usage pattern: called from trigger
public class AccountSyncService {

    @future(callout=true)
    public static void syncAccountsToERP(List<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, Name, AnnualRevenue, Industry
            FROM Account WHERE Id IN :accountIds
        ];

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:ERP_System/accounts');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(JSON.serialize(accounts));
        req.setTimeout(10000);

        Http http = new Http();
        HttpResponse res = http.send(req);
        System.debug('ERP sync: ' + res.getStatusCode());
    }

    // Called from trigger:
    public static void triggerSync(List<Account> accounts) {
        List<Id> ids = new List<Id>();
        for (Account a : accounts) ids.add(a.Id);
        syncAccountsToERP(ids);
    }
}`,
      exercise: {
        title: 'Future Method Rules',
        instructions: "Debug the two annotations for future methods:\n1. Basic future: `\"@future\"`\n2. With callout: `\"@future(callout=true)\"`\n\nExpected output:\n```\n@future\n@future(callout=true)\n```",
        starterCode: `// Debug the two future annotations\n`,
        expectedOutput: ['@future', '@future(callout=true)'],
        hint: "Two System.debug calls",
        solution: `System.debug('@future');\nSystem.debug('@future(callout=true)');`,
      },
    },
    {
      id: 'queueable', title: 'Queueable Apex', xp: 40,
      theory: `## Queueable Apex

**Queueable** is the modern replacement for \`@future\`. It supports non-primitive parameters, chaining, and job IDs.

### Interface: \`Queueable\`

\`\`\`apex
public class AccountProcessor implements Queueable {

    private List<Account> accounts; // Non-primitive — not allowed in @future!

    public AccountProcessor(List<Account> accounts) {
        this.accounts = accounts;
    }

    public void execute(QueueableContext ctx) {
        // Runs asynchronously
        System.debug('Job ID: ' + ctx.getJobId());

        for (Account acc : accounts) {
            acc.Description = 'Processed async: ' + System.now();
        }
        update accounts;
    }
}

// Enqueue the job:
List<Account> accs = [SELECT Id, Description FROM Account LIMIT 50];
Id jobId = System.enqueueJob(new AccountProcessor(accs));
System.debug('Enqueued: ' + jobId);
\`\`\`

### Chaining Queueable Jobs

\`\`\`apex
public class Step1Job implements Queueable {
    public void execute(QueueableContext ctx) {
        // Do step 1 work...
        System.debug('Step 1 done');

        // Chain step 2
        System.enqueueJob(new Step2Job());
    }
}

public class Step2Job implements Queueable {
    public void execute(QueueableContext ctx) {
        System.debug('Step 2 done');
    }
}
\`\`\`

### Queueable with Callout

\`\`\`apex
public class CalloutJob implements Queueable, Database.AllowsCallouts {
    public void execute(QueueableContext ctx) {
        // Callouts allowed when implementing Database.AllowsCallouts
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        // ...
    }
}
\`\`\`

### Future vs Queueable

| Feature | @future | Queueable |
|---------|---------|-----------|
| Non-primitive params | ❌ | ✅ |
| Chaining | ❌ | ✅ |
| Job ID | ❌ | ✅ |
| Called from Batch | ❌ | ✅ |`,
      codeExample: `public class EmailNotificationJob implements Queueable {
    private Set<Id> contactIds;
    private String subject;

    public EmailNotificationJob(Set<Id> ids, String subject) {
        this.contactIds = ids;
        this.subject = subject;
    }

    public void execute(QueueableContext ctx) {
        List<Contact> contacts = [
            SELECT Name, Email FROM Contact WHERE Id IN :contactIds
        ];
        // Send emails...
        System.debug('Sending ' + subject + ' to ' + contacts.size() + ' contacts');
    }
}

// In your service:
// Set<Id> ids = new Set<Id>{'003...', '003...'};
// System.enqueueJob(new EmailNotificationJob(ids, 'Welcome!'));`,
      exercise: {
        title: 'Queueable Interface',
        instructions: "Debug the interface name and the method to enqueue a job:\n1. `\"Queueable\"`\n2. `\"System.enqueueJob\"`\n\nExpected output:\n```\nQueueable\nSystem.enqueueJob\n```",
        starterCode: `// Debug the Queueable interface and enqueue method\n`,
        expectedOutput: ['Queueable', 'System.enqueueJob'],
        hint: "Two System.debug calls",
        solution: `System.debug('Queueable');\nSystem.debug('System.enqueueJob');`,
      },
    },
    {
      id: 'batch-apex', title: 'Batch Apex', xp: 50,
      theory: `## Batch Apex

**Batch Apex** processes millions of records by breaking them into chunks. Each chunk runs in its own transaction with fresh limits.

### Interface: \`Database.Batchable<T>\`

Three mandatory methods:

\`\`\`apex
public class AccountCleanupBatch implements Database.Batchable<SObject> {

    // 1. START — return the records to process
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name, Phone FROM Account WHERE Phone = null'
        );
    }

    // 2. EXECUTE — called once per chunk (default 200 records)
    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Account> accounts = (List<Account>) scope;
        for (Account acc : accounts) {
            acc.Phone = 'TBD';
        }
        update accounts;
        System.debug('Processed chunk of: ' + scope.size());
    }

    // 3. FINISH — runs once after all chunks complete
    public void finish(Database.BatchableContext bc) {
        System.debug('Batch complete!');
        // Send email notification, kick off next batch, etc.
    }
}

// Execute:
AccountCleanupBatch b = new AccountCleanupBatch();
Database.executeBatch(b, 200); // 200 = chunk size
\`\`\`

### Database.Stateful — Preserve State

\`\`\`apex
public class TallyBatch implements Database.Batchable<SObject>, Database.Stateful {
    public Integer processed = 0; // survives across execute() calls

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM Contact');
    }
    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        processed += scope.size();
    }
    public void finish(Database.BatchableContext bc) {
        System.debug('Total processed: ' + processed);
    }
}
\`\`\`

### Key Limits
- Max **5 concurrent batch jobs** per org
- Batch size: 1–2,000 (default 200)
- \`Database.getQueryLocator\` handles up to **50 million** records`,
      codeExample: `public class DataMigrationBatch implements Database.Batchable<SObject>, Database.Stateful {
    public Integer success = 0, errors = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, OldCategory__c, NewCategory__c FROM Product2 WHERE NewCategory__c = null'
        );
    }

    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Product2> products = (List<Product2>) scope;
        for (Product2 p : products) {
            p.NewCategory__c = p.OldCategory__c;
        }
        try {
            update products;
            success += products.size();
        } catch (DmlException e) {
            errors += scope.size();
        }
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('✅ ' + success + ' migrated');
        System.debug('❌ ' + errors + ' failed');
    }
}`,
      exercise: {
        title: 'Batch Interface Methods',
        instructions: "Debug the three methods required by the Batch Apex interface:\n```\nstart\nexecute\nfinish\n```",
        starterCode: `// Debug the three required Batch Apex method names\n`,
        expectedOutput: ['start', 'execute', 'finish'],
        hint: "Three System.debug calls",
        solution: `System.debug('start');\nSystem.debug('execute');\nSystem.debug('finish');`,
      },
    },
    {
      id: 'scheduled-apex', title: 'Scheduled Apex', xp: 35,
      theory: `## Scheduled Apex

Run Apex on a time-based schedule — like a cron job in the cloud.

### Interface: \`Schedulable\`

\`\`\`apex
public class DailyCleanupJob implements Schedulable {

    public void execute(SchedulableContext sc) {
        // Runs at the scheduled time
        System.debug('Daily cleanup running at: ' + System.now());

        // Usually kicks off a batch job
        Database.executeBatch(new AccountCleanupBatch(), 200);
    }
}
\`\`\`

### Scheduling the Job

\`\`\`apex
// CRON expression: Seconds Minutes Hours Day Month Weekday Year
// Run every day at 2:00 AM:
String cronExp = '0 0 2 * * ?';
String jobName = 'Daily Account Cleanup';

System.schedule(jobName, cronExp, new DailyCleanupJob());
\`\`\`

### CRON Expression Guide

\`\`\`
0 0 2 * * ?       Every day at 2:00 AM
0 0 12 ? * MON    Every Monday at noon
0 0 1 1 * ?       First day of every month at 1:00 AM
0 30 8 * * ? *    Every day at 8:30 AM
\`\`\`

### Check Scheduled Jobs

\`\`\`apex
// Programmatically abort a job
List<CronTrigger> jobs = [SELECT Id, CronJobDetail.Name FROM CronTrigger];
for (CronTrigger ct : jobs) {
    System.debug('Job: ' + ct.CronJobDetail.Name);
    System.abortJob(ct.Id); // cancel it
}
\`\`\`

### Limits
- Max **100 scheduled jobs** per org at once
- Min interval: every 1 hour (by best practice)`,
      codeExample: `public class WeeklyReportJob implements Schedulable {
    public void execute(SchedulableContext sc) {
        // Send weekly pipeline report every Monday at 8 AM
        List<Opportunity> pipeline = [
            SELECT Name, Amount, StageName, CloseDate
            FROM Opportunity
            WHERE IsClosed = false
            AND CloseDate = THIS_QUARTER
            ORDER BY Amount DESC
            LIMIT 100
        ];
        System.debug('Pipeline report: ' + pipeline.size() + ' open opps');
        // Send email, create a report record, etc.
    }
}

// Schedule it:
// String cron = '0 0 8 ? * MON';
// System.schedule('Weekly Pipeline Report', cron, new WeeklyReportJob());`,
      exercise: {
        title: 'Scheduling Syntax',
        instructions: "Debug the interface and method used to schedule Apex:\n1. `\"Schedulable\"`\n2. `\"System.schedule\"`\n\nExpected output:\n```\nSchedulable\nSystem.schedule\n```",
        starterCode: `// Debug the interface and scheduling method\n`,
        expectedOutput: ['Schedulable', 'System.schedule'],
        hint: "Two System.debug calls",
        solution: `System.debug('Schedulable');\nSystem.debug('System.schedule');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 11 — APEX TESTING
// ═══════════════════════════════════════════════════════════
{
  id: 'testing', title: 'Apex Testing', icon: '🧪', color: '#2ED573', xpTotal: 300,
  description: 'Write unit tests, achieve 75%+ coverage, use test data factories, and mock callouts.',
  quizQuestions: [
    { q: 'What is the minimum code coverage to deploy to production?', options: ['50%', '60%', '75%', '90%'], answer: 2 },
    { q: '@TestSetup methods are:', options: ['Run before each test method', 'Run once per class, shared data', 'Optional and rarely used', 'Run after all tests'], answer: 1 },
    { q: 'Test.startTest() / Test.stopTest() is used to:', options: ['Mark test start/end', 'Reset governor limits + run async code synchronously', 'Validate results', 'Create test data'], answer: 1 },
    { q: 'To test HTTP callouts you must:', options: ['Make real HTTP calls', 'Use Test.setMock() with HttpCalloutMock', 'Skip callout tests', 'Use @future(callout=true)'], answer: 1 },
    { q: 'System.assertEquals(expected, actual) throws if:', options: ['Both values are null', 'Values are not equal', 'Values are equal', 'Types differ'], answer: 1 },
  ],
  lessons: [
    {
      id: 'test-basics', title: 'Test Classes & Assertions', xp: 40,
      theory: `## Writing Test Classes

Test classes validate your Apex code. Salesforce requires **75% code coverage** to deploy.

### Test Class Structure

\`\`\`apex
@isTest // Required annotation
public class AccountServiceTest {

    @TestSetup
    static void makeData() {
        // Runs ONCE — creates data for all @isTest methods
        Account acc = new Account(Name = 'Test Account', Industry = 'Technology');
        insert acc;
    }

    @isTest
    static void testGetByIndustry_HappyPath() {
        // Arrange
        List<Account> techAccounts = [SELECT Id FROM Account WHERE Industry = 'Technology'];

        // Act
        Test.startTest();  // Resets governor limits
        List<Account> result = AccountService.getByIndustry('Technology');
        Test.stopTest();   // Runs any async operations

        // Assert
        System.assertEquals(1, result.size(), 'Should return 1 account');
        System.assertEquals('Test Account', result[0].Name);
    }

    @isTest
    static void testGetByIndustry_NoResults() {
        Test.startTest();
        List<Account> result = AccountService.getByIndustry('Nonexistent');
        Test.stopTest();

        System.assertNotEquals(null, result, 'Should never return null');
        System.assertEquals(0, result.size(), 'Should be empty');
    }

    @isTest
    static void testGetByIndustry_NullInput() {
        Test.startTest();
        try {
            AccountService.getByIndustry(null);
            System.assert(false, 'Should have thrown exception');
        } catch (IllegalArgumentException e) {
            System.assert(e.getMessage().contains('required'), 'Wrong error message');
        }
        Test.stopTest();
    }
}
\`\`\`

### Assertion Methods

\`\`\`apex
System.assertEquals(expected, actual, 'message');     // equal
System.assertNotEquals(expected, actual, 'message');  // not equal
System.assert(condition, 'message');                   // is true

// Modern (Apex 56.0+):
Assert.areEqual(expected, actual, 'message');
Assert.isTrue(condition, 'message');
Assert.isFalse(condition, 'message');
Assert.isNull(value, 'message');
Assert.isNotNull(value, 'message');
\`\`\``,
      codeExample: `@isTest
public class MathUtilTest {

    @isTest static void testAddPositive() {
        Test.startTest();
        Integer result = MathUtil.add(5, 3);
        Test.stopTest();
        System.assertEquals(8, result, '5+3 should be 8');
    }

    @isTest static void testAddNegative() {
        Test.startTest();
        Integer result = MathUtil.add(-5, -3);
        Test.stopTest();
        System.assertEquals(-8, result);
    }

    @isTest static void testAddZero() {
        Test.startTest();
        Integer result = MathUtil.add(10, 0);
        Test.stopTest();
        System.assertEquals(10, result, 'Adding 0 returns same value');
    }
}`,
      exercise: {
        title: 'Coverage Requirement',
        instructions: "Debug the minimum code coverage percentage required for production deployment.\n\nExpected output:\n```\n75\n```",
        starterCode: `// Debug the minimum coverage percentage\n`,
        expectedOutput: ['75'],
        hint: "System.debug(75);",
        solution: `System.debug(75);`,
      },
    },
    {
      id: 'test-data-factory', title: 'Test Data & Best Practices', xp: 35,
      theory: `## Test Data Factory Pattern

Don't repeat test data creation everywhere. Use a **factory class**.

\`\`\`apex
@isTest
public class TestDataFactory {

    public static Account createAccount(String name, String industry) {
        return new Account(
            Name = name,
            Industry = industry,
            AnnualRevenue = 1000000,
            Phone = '555-0100'
        );
    }

    public static Account insertAccount(String name) {
        Account acc = createAccount(name, 'Technology');
        insert acc;
        return acc;
    }

    public static List<Contact> createContacts(Id accountId, Integer count) {
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 1; i <= count; i++) {
            contacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact ' + i,
                AccountId = accountId,
                Email = 'test' + i + '@test.com'
            ));
        }
        insert contacts;
        return contacts;
    }
}
\`\`\`

### Bulk Testing (Test with 200 records!)

\`\`\`apex
@isTest
static void testTrigger_BulkInsert() {
    // Triggers fire in batches of 200 — test that!
    List<Account> accs = new List<Account>();
    for (Integer i = 0; i < 200; i++) {
        accs.add(new Account(Name = 'Bulk Test ' + i));
    }

    Test.startTest();
    insert accs;
    Test.stopTest();

    List<Account> inserted = [SELECT Id, Description FROM Account WHERE Name LIKE 'Bulk Test%'];
    System.assertEquals(200, inserted.size(), 'All 200 should be inserted');
}
\`\`\`

### Testing Best Practices

1. **Test the happy path** — normal input, expected result
2. **Test edge cases** — null input, empty lists, zero values
3. **Test error paths** — exceptions, validation errors
4. **Test bulk** — 200 records in a trigger test
5. **Never use @SeeAllData=true** — creates dependency on real data
6. **Meaningful assert messages** — helps debug when tests fail`,
      codeExample: `@isTest
public class OpportunityServiceTest {

    @TestSetup
    static void setup() {
        Account acc = TestDataFactory.insertAccount('Test Corp');
        // Shared across all test methods
    }

    @isTest
    static void testCalculateDiscount_VIP() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Opportunity opp = new Opportunity(
            Name = 'Big Deal',
            AccountId = acc.Id,
            Amount = 100000,
            StageName = 'Prospecting',
            CloseDate = Date.today().addDays(30)
        );
        insert opp;

        Test.startTest();
        Decimal discount = OpportunityService.calculateDiscount(opp.Id);
        Test.stopTest();

        System.assertEquals(20, discount, 'VIP discount should be 20%');
    }
}`,
      exercise: {
        title: 'Test Annotations',
        instructions: "Debug the three key test annotations in order:\n1. `\"@isTest\"`\n2. `\"@TestSetup\"`\n3. `\"Test.startTest\"`\n\nExpected output:\n```\n@isTest\n@TestSetup\nTest.startTest\n```",
        starterCode: `// Debug the three test annotations\n`,
        expectedOutput: ['@isTest', '@TestSetup', 'Test.startTest'],
        hint: "Three System.debug calls",
        solution: `System.debug('@isTest');\nSystem.debug('@TestSetup');\nSystem.debug('Test.startTest');`,
      },
    },
    {
      id: 'callout-mocks', title: 'Mocking HTTP Callouts', xp: 40,
      theory: `## Mocking HTTP Callouts in Tests

You can't make real HTTP callouts in test classes. You must **mock** them using the \`HttpCalloutMock\` interface.

### Create a Mock

\`\`\`apex
@isTest
public class WeatherServiceMock implements HttpCalloutMock {
    private Integer statusCode;
    private String body;

    public WeatherServiceMock(Integer statusCode, String body) {
        this.statusCode = statusCode;
        this.body = body;
    }

    // This method is called instead of a real HTTP request
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(statusCode);
        res.setHeader('Content-Type', 'application/json');
        res.setBody(body);
        return res;
    }
}
\`\`\`

### Use the Mock in a Test

\`\`\`apex
@isTest
public class WeatherServiceTest {

    @isTest
    static void testGetWeather_Success() {
        // Arrange — set up mock response
        String mockResponse = '{"temperature": 72, "condition": "Sunny"}';
        Test.setMock(HttpCalloutMock.class, new WeatherServiceMock(200, mockResponse));

        // Act
        Test.startTest();
        String result = WeatherService.getCondition('London');
        Test.stopTest();

        // Assert
        System.assertEquals('Sunny', result, 'Should return sunny');
    }

    @isTest
    static void testGetWeather_Error() {
        Test.setMock(HttpCalloutMock.class, new WeatherServiceMock(500, '{"error": "Server Error"}'));

        Test.startTest();
        String result = WeatherService.getCondition('London');
        Test.stopTest();

        System.assertNull(result, 'Should return null on error');
    }
}
\`\`\`

### Multi-Callout Mock

\`\`\`apex
@isTest
public class MultiCalloutMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        if (req.getEndpoint().contains('/users')) {
            return buildResponse(200, '{"users":[]}');
        } else if (req.getEndpoint().contains('/orders')) {
            return buildResponse(200, '{"orders":[]}');
        }
        return buildResponse(404, '{"error":"Not found"}');
    }
    private HttpResponse buildResponse(Integer code, String body) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(code);
        res.setBody(body);
        return res;
    }
}
\`\`\``,
      codeExample: `@isTest
public class SimpleCalloutMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"status":"ok","records":42}');
        return res;
    }
}

@isTest
static void testMyCallout() {
    Test.setMock(HttpCalloutMock.class, new SimpleCalloutMock());
    Test.startTest();
    // MyService.callExternalAPI(); // would use the mock
    Test.stopTest();
    System.debug('Mock test passed');
}`,
      exercise: {
        title: 'Callout Mock Interface',
        instructions: "Debug the interface name for callout mocks and how to activate it:\n1. `\"HttpCalloutMock\"`\n2. `\"Test.setMock\"`\n\nExpected output:\n```\nHttpCalloutMock\nTest.setMock\n```",
        starterCode: `// Debug the callout mock interface and method\n`,
        expectedOutput: ['HttpCalloutMock', 'Test.setMock'],
        hint: "Two System.debug calls",
        solution: `System.debug('HttpCalloutMock');\nSystem.debug('Test.setMock');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 12 — EXCEPTION HANDLING
// ═══════════════════════════════════════════════════════════
{
  id: 'exception-handling', title: 'Exception Handling', icon: '🚨', color: '#FF6B6B', xpTotal: 220,
  description: 'Handle errors gracefully with try/catch/finally, custom exceptions, and defensive coding.',
  quizQuestions: [
    { q: 'A "finally" block runs:', options: ['Only on success', 'Only on error', 'Always, regardless of success or failure', 'Never by default'], answer: 2 },
    { q: 'NullPointerException is thrown when:', options: ['A variable is zero', 'A method is called on a null variable', 'A list is empty', 'A SOQL returns no results'], answer: 1 },
    { q: 'Custom exceptions must extend:', options: ['RuntimeException', 'Exception', 'ApexException', 'Error'], answer: 1 },
    { q: 'DmlException.getDmlMessage(0) returns:', options: ['The full stack trace', 'The first DML error message', 'The status code', 'The record ID'], answer: 1 },
    { q: 'Which exception CANNOT be caught?', options: ['DmlException', 'NullPointerException', 'System.LimitException', 'QueryException'], answer: 2 },
  ],
  lessons: [
    {
      id: 'try-catch', title: 'Try / Catch / Finally', xp: 30,
      theory: `## Try / Catch / Finally

\`\`\`apex
try {
    // Risky code here
} catch (ExceptionType1 e1) {
    // Handle specific exception
} catch (Exception e) {
    // Catch-all for any other exception
} finally {
    // ALWAYS runs — use for cleanup (close connections, reset state)
}
\`\`\`

### Common Exception Types

\`\`\`apex
// NullPointerException
try {
    String s = null;
    Integer len = s.length(); // Boom!
} catch (NullPointerException e) {
    System.debug('Null: ' + e.getMessage());
}

// DmlException
try {
    Account acc = new Account(); // Missing Name!
    insert acc;
} catch (DmlException e) {
    System.debug('DML error: ' + e.getDmlMessage(0));
    System.debug('Status: ' + e.getDmlStatusCode(0));
    System.debug('Fields: ' + e.getDmlFieldNames(0));
}

// QueryException — too many/few rows
try {
    Account a = [SELECT Id FROM Account WHERE Name = 'Duplicate'];
} catch (QueryException e) {
    System.debug('Query: ' + e.getMessage());
}

// ListException — index out of bounds
try {
    List<String> lst = new List<String>();
    String s = lst[0];
} catch (ListException e) {
    System.debug('List: ' + e.getMessage());
}
\`\`\`

### Exception Properties

\`\`\`apex
} catch (Exception e) {
    e.getMessage()          // Human-readable message
    e.getTypeName()         // 'System.NullPointerException'
    e.getStackTraceString() // Full stack trace
    e.getCause()            // Wrapped exception (if any)
    e.getLineNumber()       // Line number
}
\`\`\`

### ⚠️ System.LimitException CANNOT be caught! Design to avoid it.`,
      codeExample: `public static Integer safeDivide(Integer a, Integer b) {
    try {
        if (b == 0) throw new MathException('Division by zero');
        return a / b;
    } catch (MathException e) {
        System.debug('Math error: ' + e.getMessage());
        return 0;
    } finally {
        System.debug('safeDivide completed'); // always runs
    }
}

System.debug(safeDivide(10, 2));  // 5
System.debug(safeDivide(10, 0));  // 0, logs error`,
      exercise: {
        title: 'Finally Always Runs',
        instructions: "Write a try block that throws, a catch that debugs `\"caught\"`, and a finally that debugs `\"finally\"`.\n\nExpected output:\n```\ncaught\nfinally\n```",
        starterCode: `try {\n    throw new IllegalArgumentException('test');\n} catch (Exception e) {\n    // Debug 'caught'\n} finally {\n    // Debug 'finally'\n}\n`,
        expectedOutput: ['caught', 'finally'],
        hint: "System.debug('caught'); in catch, System.debug('finally'); in finally",
        solution: `try {\n    throw new IllegalArgumentException('test');\n} catch (Exception e) {\n    System.debug('caught');\n} finally {\n    System.debug('finally');\n}`,
      },
    },
    {
      id: 'custom-exceptions', title: 'Custom Exceptions', xp: 30,
      theory: `## Custom Exceptions

Create your own exception types for meaningful, domain-specific errors.

\`\`\`apex
// Define — just extend Exception
public class InsufficientFundsException extends Exception {}
public class InvalidAccountException extends Exception {}
public class AccountNotFoundException extends Exception {}

public class BankService {
    public static Decimal withdraw(Id accountId, Decimal amount) {
        if (accountId == null) throw new InvalidAccountException('Account ID required');
        if (amount <= 0)       throw new IllegalArgumentException('Amount must be positive');

        Account acc = [SELECT Id, Balance__c FROM Account WHERE Id = :accountId];
        if (acc == null) throw new AccountNotFoundException('Account not found: ' + accountId);

        if (acc.Balance__c < amount) {
            throw new InsufficientFundsException(
                'Balance ' + acc.Balance__c + ' is less than withdrawal ' + amount
            );
        }

        acc.Balance__c -= amount;
        update acc;
        return acc.Balance__c;
    }
}

// Usage with specific handling:
try {
    Decimal newBalance = BankService.withdraw(accountId, 500);
    System.debug('New balance: $' + newBalance);
} catch (InsufficientFundsException e) {
    System.debug('Funds error: ' + e.getMessage());
    // Show user-friendly message
} catch (InvalidAccountException e) {
    System.debug('Account error: ' + e.getMessage());
} catch (Exception e) {
    System.debug('Unexpected: ' + e.getMessage());
    // Log to custom error object, alert admins, etc.
}
\`\`\`

### Custom Exception with Constructor

\`\`\`apex
public class ValidationException extends Exception {
    public String fieldName;
    public ValidationException(String field, String message) {
        this.fieldName = field;
        this.setMessage('Validation failed on ' + field + ': ' + message);
    }
}

throw new ValidationException('Email', 'must be a valid email address');
\`\`\``,
      codeExample: `public class AgeValidationException extends Exception {}

public class UserService {
    public static void createUser(String name, Integer age) {
        if (age < 0)  throw new AgeValidationException('Age cannot be negative');
        if (age > 150) throw new AgeValidationException('Age ' + age + ' is unrealistic');
        System.debug('User created: ' + name + ', age ' + age);
    }
}

try {
    UserService.createUser('Alice', -5);
} catch (AgeValidationException e) {
    System.debug('Validation: ' + e.getMessage());
}`,
      exercise: {
        title: 'Throw and Catch',
        instructions: "Create a custom exception `NegativeValueException`. Throw it if a number is negative, catch it and debug `\"negative detected\"`.\n\nTest value: `-10`\n\nExpected output:\n```\nnegative detected\n```",
        starterCode: `public class NegativeValueException extends Exception {}\n\nInteger value = -10;\ntry {\n    if (value < 0) throw new NegativeValueException('Negative!');\n    System.debug('Value: ' + value);\n} catch (NegativeValueException e) {\n    // Debug 'negative detected'\n}\n`,
        expectedOutput: ['negative detected'],
        hint: "System.debug('negative detected'); in the catch block",
        solution: `public class NegativeValueException extends Exception {}\nInteger value = -10;\ntry {\n    if (value < 0) throw new NegativeValueException('Negative!');\n    System.debug('Value: ' + value);\n} catch (NegativeValueException e) {\n    System.debug('negative detected');\n}`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 13 — HTTP CALLOUTS
// ═══════════════════════════════════════════════════════════
{
  id: 'callouts', title: 'HTTP Callouts', icon: '🌐', color: '#1E90FF', xpTotal: 260,
  description: 'Call external REST APIs from Apex, parse JSON responses, and handle errors properly.',
  quizQuestions: [
    { q: 'Callouts from triggers must be made via:', options: ['Inline in the trigger', '@future(callout=true) or Queueable', 'Batch Apex only', 'Any method'], answer: 1 },
    { q: 'What must be configured before calling an external URL?', options: ['CORS settings', 'Remote Site Settings or Named Credentials', 'User permissions', 'A certificate'], answer: 1 },
    { q: 'JSON.deserializeUntyped() returns:', options: ['A String', 'An Object', 'A Map<String, Object>', 'A List<Object>'], answer: 2 },
    { q: 'Named Credentials in Salesforce store:', options: ['Apex code', 'API endpoints and authentication securely', 'Remote Site URLs', 'SSL certificates'], answer: 1 },
    { q: 'Max timeout for a single callout is:', options: ['5 seconds', '10 seconds', '60 seconds', '120 seconds'], answer: 3 },
  ],
  lessons: [
    {
      id: 'rest-callouts', title: 'REST Callouts', xp: 40,
      theory: `## REST Callouts

Apex can call external APIs using \`HttpRequest\`, \`Http\`, and \`HttpResponse\`.

### Basic GET Request

\`\`\`apex
HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.example.com/users/123');
req.setMethod('GET');
req.setHeader('Authorization', 'Bearer my-token');
req.setHeader('Accept', 'application/json');
req.setTimeout(10000); // 10 seconds

Http http = new Http();
HttpResponse res = http.send(req);

System.debug('Status: ' + res.getStatusCode()); // 200
System.debug('Body: ' + res.getBody());
\`\`\`

### POST Request

\`\`\`apex
Map<String, Object> payload = new Map<String, Object>{
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'active' => true
};

HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.example.com/contacts');
req.setMethod('POST');
req.setHeader('Content-Type', 'application/json');
req.setBody(JSON.serialize(payload));

Http http = new Http();
HttpResponse res = http.send(req);

if (res.getStatusCode() == 201) {
    System.debug('Created! Body: ' + res.getBody());
} else {
    System.debug('Error ' + res.getStatusCode() + ': ' + res.getStatus());
}
\`\`\`

### Setup Requirements

1. **Remote Site Settings** (Setup → Security → Remote Site Settings) — whitelist the URL
2. **Or Named Credentials** — preferred, stores auth securely

\`\`\`apex
// With Named Credential (cleaner, more secure)
req.setEndpoint('callout:My_API/endpoint'); // 'callout:NamedCredName/path'
\`\`\``,
      codeExample: `public class RestService {
    public static Map<String, Object> getUser(String userId) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:UserAPI/users/' + userId);
        req.setMethod('GET');
        req.setHeader('Accept', 'application/json');
        req.setTimeout(5000);

        Http http = new Http();
        try {
            HttpResponse res = http.send(req);
            if (res.getStatusCode() == 200) {
                return (Map<String, Object>)
                    JSON.deserializeUntyped(res.getBody());
            }
            System.debug('HTTP ' + res.getStatusCode());
            return null;
        } catch (Exception e) {
            System.debug('Callout failed: ' + e.getMessage());
            return null;
        }
    }
}`,
      exercise: {
        title: 'HTTP Methods',
        instructions: "Debug the 4 main HTTP methods used in REST APIs:\n```\nGET\nPOST\nPUT\nDELETE\n```",
        starterCode: `// Debug the 4 HTTP methods\n`,
        expectedOutput: ['GET', 'POST', 'PUT', 'DELETE'],
        hint: "Four System.debug calls",
        solution: `System.debug('GET');\nSystem.debug('POST');\nSystem.debug('PUT');\nSystem.debug('DELETE');`,
      },
    },
    {
      id: 'json-parsing', title: 'JSON Serialization & Parsing', xp: 35,
      theory: `## JSON in Apex

### Serializing Apex → JSON

\`\`\`apex
Map<String, Object> data = new Map<String, Object>{
    'name' => 'Acme Corp',
    'employees' => 500,
    'active' => true,
    'tags' => new List<String>{'tech', 'saas'}
};

String json = JSON.serialize(data);
// {"name":"Acme Corp","employees":500,"active":true,"tags":["tech","saas"]}

String pretty = JSON.serializePretty(data); // Formatted with indentation
\`\`\`

### Parsing JSON → Apex

\`\`\`apex
String body = '{"id":42,"name":"Alice","score":98.5}';

// Option 1: Untyped — flexible but verbose
Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(body);
String name  = (String) result.get('name');   // 'Alice'
Integer id   = (Integer) result.get('id');    // 42
Decimal score = (Decimal) result.get('score'); // 98.5

// Option 2: Typed — use a class (cleaner!)
public class UserData {
    public Integer id;
    public String name;
    public Decimal score;
}
UserData user = (UserData) JSON.deserialize(body, UserData.class);
System.debug(user.name);  // Alice
System.debug(user.score); // 98.5

// Option 3: JSON.createParser() — for very large or complex JSON
JSONParser parser = JSON.createParser(body);
while (parser.nextToken() != null) {
    if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
        String field = parser.getText();
        parser.nextToken();
        System.debug(field + ': ' + parser.getText());
    }
}
\`\`\`

### Handling Nested JSON

\`\`\`apex
String json = '{"company":{"name":"Acme","address":{"city":"NY"}}}';
Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(json);
Map<String, Object> company = (Map<String, Object>) root.get('company');
Map<String, Object> address = (Map<String, Object>) company.get('address');
System.debug((String) address.get('city')); // NY
\`\`\``,
      codeExample: `// Simulate parsing a REST API response
String apiResponse = '{"status":"success","data":{"userId":101,"username":"sfdev","xp":1500}}';

Map<String, Object> parsed = (Map<String, Object>) JSON.deserializeUntyped(apiResponse);
String status = (String) parsed.get('status');
Map<String, Object> userData = (Map<String, Object>) parsed.get('data');

System.debug('Status: ' + status);
System.debug('User: ' + userData.get('username'));
System.debug('XP: ' + userData.get('xp'));`,
      exercise: {
        title: 'Parse JSON',
        instructions: "Parse `'{\"score\":95,\"grade\":\"A\"}'` and debug the grade value.\n\nExpected output:\n```\nA\n```",
        starterCode: `String json = '{\"score\":95,\"grade\":\"A\"}';\n// Parse and debug the grade\n`,
        expectedOutput: ['A'],
        hint: "Map<String, Object> m = (Map<String,Object>) JSON.deserializeUntyped(json); System.debug(m.get('grade'));",
        solution: `String json = '{"score":95,"grade":"A"}';\nMap<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(json);\nSystem.debug(m.get('grade'));`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 14 — ADVANCED APEX
// ═══════════════════════════════════════════════════════════
{
  id: 'advanced', title: 'Advanced Apex', icon: '🔬', color: '#A29BFE', xpTotal: 350,
  description: 'Enums, inner classes, design patterns, and advanced features that separate good devs from great ones.',
  quizQuestions: [
    { q: 'An Enum in Apex is used to:', options: ['Loop over numbers', 'Define a fixed set of named constants', 'Create anonymous classes', 'Define interfaces'], answer: 1 },
    { q: 'The Singleton pattern ensures:', options: ['Only one method exists', 'Only one instance of a class is created', 'A class cannot be extended', 'All methods are static'], answer: 1 },
    { q: 'Inner classes in Apex:', options: ['Cannot access outer class members', 'Are defined inside another class', 'Must be public', 'Cannot be instantiated'], answer: 1 },
    { q: 'The Strategy pattern is used to:', options: ['Control object creation', 'Switch algorithms at runtime', 'Ensure single instances', 'Handle events'], answer: 1 },
    { q: 'virtual methods in abstract classes:', options: ['Must be overridden', 'CAN be overridden but have a default body', 'Cannot exist in abstract classes', 'Are always static'], answer: 1 },
  ],
  lessons: [
    {
      id: 'enums', title: 'Enums', xp: 25,
      theory: `## Enums

An **enum** defines a fixed set of named constants. Use them instead of magic strings.

\`\`\`apex
public enum Status {
    OPEN, IN_PROGRESS, ON_HOLD, CLOSED, CANCELLED
}

public enum Priority {
    LOW, MEDIUM, HIGH, CRITICAL
}
\`\`\`

### Using Enums

\`\`\`apex
Status caseStatus = Status.IN_PROGRESS;
System.debug(caseStatus);               // IN_PROGRESS
System.debug(caseStatus.name());        // 'IN_PROGRESS'
System.debug(caseStatus.ordinal());     // 1 (0-indexed position)

if (caseStatus == Status.IN_PROGRESS) {
    System.debug('Case is being worked on');
}

// Switch on enum
switch on caseStatus {
    when OPEN        { System.debug('Assign to agent'); }
    when IN_PROGRESS { System.debug('Agent working'); }
    when CLOSED      { System.debug('Mark CSAT survey'); }
    when else        { System.debug('Check status'); }
}
\`\`\`

### Enum in a Class

\`\`\`apex
public class Ticket {
    public enum Severity { P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW }

    public String subject;
    public Severity severity;

    public Ticket(String subject, Severity severity) {
        this.subject = subject;
        this.severity = severity;
    }

    public Boolean isUrgent() {
        return severity == Severity.P1_CRITICAL || severity == Severity.P2_HIGH;
    }
}

Ticket t = new Ticket('Login broken', Ticket.Severity.P1_CRITICAL);
System.debug(t.isUrgent()); // true
\`\`\``,
      codeExample: `public enum Direction { NORTH, SOUTH, EAST, WEST }

Direction dir = Direction.NORTH;
System.debug(dir);           // NORTH
System.debug(dir.ordinal()); // 0
System.debug(Direction.values()); // all enum values`,
      exercise: {
        title: 'Enum Usage',
        instructions: "Create enum `Season` with `SPRING, SUMMER, FALL, WINTER`. Assign `SUMMER` to a variable and debug it.\n\nExpected output:\n```\nSUMMER\n```",
        starterCode: `public enum Season { SPRING, SUMMER, FALL, WINTER }\n\nSeason current = Season.SUMMER;\nSystem.debug(current);\n`,
        expectedOutput: ['SUMMER'],
        hint: "The code is mostly there — just run it!",
        solution: `public enum Season { SPRING, SUMMER, FALL, WINTER }\nSeason current = Season.SUMMER;\nSystem.debug(current);`,
      },
    },
    {
      id: 'inner-classes', title: 'Inner Classes', xp: 30,
      theory: `## Inner Classes

An **inner class** is defined inside another class. Perfect for grouping related types, creating request/response wrappers, or builder patterns.

\`\`\`apex
public class OrderService {

    // Inner class for a request
    public class OrderRequest {
        public String productId;
        public Integer quantity;
        public String customerId;

        public OrderRequest(String productId, Integer qty, String customerId) {
            this.productId = productId;
            this.quantity = qty;
            this.customerId = customerId;
        }
    }

    // Inner class for a response
    public class OrderResponse {
        public Boolean success;
        public String orderId;
        public String message;

        public OrderResponse(Boolean success, String orderId, String msg) {
            this.success = success;
            this.orderId = orderId;
            this.message = msg;
        }
    }

    // Method using inner classes
    public static OrderResponse placeOrder(OrderRequest req) {
        if (req.quantity <= 0) {
            return new OrderResponse(false, null, 'Invalid quantity');
        }
        // ... create order
        String newOrderId = 'ORD-' + System.currentTimeMillis();
        return new OrderResponse(true, newOrderId, 'Order placed!');
    }
}

// Usage:
OrderService.OrderRequest req = new OrderService.OrderRequest('P001', 3, 'C001');
OrderService.OrderResponse res = OrderService.placeOrder(req);
System.debug(res.success); // true
System.debug(res.message); // Order placed!
\`\`\`

### REST API Wrapper Pattern

\`\`\`apex
@RestResource(urlMapping='/api/accounts/*')
global class AccountAPI {

    public class AccountDTO {
        public String id, name, industry;
        public Decimal revenue;
    }

    @HttpGet
    global static AccountDTO getAccount() {
        // ...
    }
}
\`\`\``,
      codeExample: `public class Calculator {

    public class Result {
        public Decimal value;
        public String operation;
        public Result(String op, Decimal val) {
            operation = op; value = val;
        }
        public String display() {
            return operation + ' = ' + value;
        }
    }

    public static Result add(Decimal a, Decimal b) {
        return new Result(a + ' + ' + b, a + b);
    }
    public static Result multiply(Decimal a, Decimal b) {
        return new Result(a + ' × ' + b, a * b);
    }
}

Calculator.Result r1 = Calculator.add(10, 5);
Calculator.Result r2 = Calculator.multiply(4, 7);
System.debug(r1.display()); // 10 + 5 = 15
System.debug(r2.display()); // 4 × 7 = 28`,
      exercise: {
        title: 'Inner Class Wrapper',
        instructions: "Create class `API` with inner class `Response` having field `message` (String). Constructor sets message. Create `API.Response('Success')` and debug its message.\n\nExpected output:\n```\nSuccess\n```",
        starterCode: `public class API {\n    public class Response {\n        public String message;\n        public Response(String msg) { message = msg; }\n    }\n}\nAPI.Response r = new API.Response('Success');\nSystem.debug(r.message);\n`,
        expectedOutput: ['Success'],
        hint: "The code is all there — just run it!",
        solution: `public class API {\n    public class Response {\n        public String message;\n        public Response(String msg) { message = msg; }\n    }\n}\nAPI.Response r = new API.Response('Success');\nSystem.debug(r.message);`,
      },
    },
    {
      id: 'design-patterns', title: 'Design Patterns', xp: 45,
      theory: `## Design Patterns in Apex

### 1. Singleton — One Instance Only

\`\`\`apex
public class OrgSettings {
    private static OrgSettings instance;
    public String theme = 'dark';
    public Boolean betaFeatures = false;

    private OrgSettings() {} // Private — can't use 'new OrgSettings()'

    public static OrgSettings getInstance() {
        if (instance == null) {
            instance = new OrgSettings();
        }
        return instance; // always the same object
    }
}

OrgSettings s1 = OrgSettings.getInstance();
OrgSettings s2 = OrgSettings.getInstance();
System.debug(s1 === s2); // true — same object!
\`\`\`

### 2. Factory — Create Objects by Type

\`\`\`apex
public class NotificationFactory {
    public static Notification create(String type) {
        switch on type {
            when 'email' { return new EmailNotification(); }
            when 'sms'   { return new SMSNotification(); }
            when 'push'  { return new PushNotification(); }
            when else    { throw new IllegalArgumentException('Unknown: ' + type); }
        }
    }
}

Notification n = NotificationFactory.create('email');
n.send('Hello!');
\`\`\`

### 3. Strategy — Swap Algorithms

\`\`\`apex
public interface PricingStrategy {
    Decimal calculate(Decimal basePrice);
}

public class StandardPricing implements PricingStrategy {
    public Decimal calculate(Decimal base) { return base; }
}
public class DiscountPricing implements PricingStrategy {
    private Decimal pct;
    public DiscountPricing(Decimal pct) { this.pct = pct; }
    public Decimal calculate(Decimal base) { return base * (1 - pct/100); }
}

public class Order {
    private PricingStrategy strategy;
    public Order(PricingStrategy s) { strategy = s; }
    public Decimal getTotal(Decimal base) { return strategy.calculate(base); }
}

Order regular = new Order(new StandardPricing());
Order vip     = new Order(new DiscountPricing(20));
System.debug(regular.getTotal(100)); // 100
System.debug(vip.getTotal(100));     // 80
\`\`\`

### 4. Trigger Handler — Covered in Module 8!

This is itself a design pattern specific to Salesforce.`,
      codeExample: `// Strategy pattern — real business use
public interface TaxStrategy {
    Decimal calculateTax(Decimal amount);
}

public class USTax implements TaxStrategy {
    public Decimal calculateTax(Decimal amount) { return amount * 0.08; }
}
public class EUTax implements TaxStrategy {
    public Decimal calculateTax(Decimal amount) { return amount * 0.20; }
}

public class Invoice {
    private TaxStrategy tax;
    public Invoice(TaxStrategy t) { tax = t; }
    public Decimal total(Decimal subtotal) {
        return subtotal + tax.calculateTax(subtotal);
    }
}

Invoice usInvoice = new Invoice(new USTax());
Invoice euInvoice = new Invoice(new EUTax());
System.debug('US total: ' + usInvoice.total(100)); // 108.0
System.debug('EU total: ' + euInvoice.total(100)); // 120.0`,
      exercise: {
        title: 'Pattern Names',
        instructions: "Debug the three design pattern names:\n1. `\"Singleton\"`\n2. `\"Factory\"`\n3. `\"Strategy\"`\n\nExpected output:\n```\nSingleton\nFactory\nStrategy\n```",
        starterCode: `// Debug the three design pattern names\n`,
        expectedOutput: ['Singleton', 'Factory', 'Strategy'],
        hint: "Three System.debug calls",
        solution: `System.debug('Singleton');\nSystem.debug('Factory');\nSystem.debug('Strategy');`,
      },
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// MODULE 15 — SECURITY
// ═══════════════════════════════════════════════════════════
{
  id: 'security', title: 'Apex Security', icon: '🔐', color: '#6C5CE7', xpTotal: 200,
  description: 'Write secure Apex with sharing rules, CRUD/FLS enforcement, and injection prevention.',
  quizQuestions: [
    { q: 'with sharing enforces:', options: ['Field-level security only', 'Org-wide defaults and sharing rules', 'Profile permissions', 'All security settings'], answer: 1 },
    { q: 'Schema.sObjectType.Account.isAccessible() checks:', options: ['If the user can log in', 'If the running user can read Accounts', 'If the field exists', 'If the object is deployed'], answer: 1 },
    { q: 'SOQL injection is prevented by:', options: ['Using LIMIT', 'Using bind variables (:variable)', 'Using ORDER BY', 'Using with SECURITY_ENFORCED'], answer: 1 },
    { q: 'WITHOUT SHARING means:', options: ['Data is deleted', 'Sharing rules are ignored (runs as system)', 'Users get admin access', 'The class is global'], answer: 1 },
    { q: 'WITH SECURITY_ENFORCED in a SOQL query:', options: ['Runs faster', 'Enforces FLS — throws error if user lacks field access', 'Ignores FLS', 'Only works in async'], answer: 1 },
  ],
  lessons: [
    {
      id: 'sharing-rules', title: 'With/Without Sharing', xp: 30,
      theory: `## Sharing Rules in Apex

### with sharing

\`with sharing\` enforces the running user's sharing rules — they only see records they have access to.

\`\`\`apex
// Default for classes called from LWC/Aura/Visualforce
public with sharing class AccountService {
    public List<Account> getMyAccounts() {
        // Only returns accounts the user can see
        return [SELECT Id, Name FROM Account ORDER BY Name];
    }
}
\`\`\`

### without sharing

\`without sharing\` ignores sharing rules — runs as system (god mode). Use very carefully!

\`\`\`apex
// Admin utility — bypasses sharing
public without sharing class AdminService {
    public Integer countAllAccounts() {
        return [SELECT COUNT() FROM Account]; // counts ALL accounts
    }
}
\`\`\`

### inherited sharing (Recommended Default)

\`\`\`apex
// Inherits sharing from the caller — safest for reusable classes
public inherited sharing class RecordService {
    public List<Account> getAccounts() {
        return [SELECT Id FROM Account LIMIT 100];
    }
}
\`\`\`

### Best Practice

| Context | Use |
|---------|-----|
| User-facing logic | \`with sharing\` |
| Admin/system utility | \`without sharing\` |
| Reusable service | \`inherited sharing\` |
| Default (no keyword) | Inherited from parent (risky!)`,
      codeExample: `// Three variants side by side
public with sharing class UserService {
    public List<Account> getUserAccounts() {
        return [SELECT Id, Name FROM Account]; // user's records only
    }
}

public without sharing class SystemService {
    public Integer getTotalRecords() {
        return [SELECT COUNT() FROM Account]; // ALL records
    }
}

public inherited sharing class FlexibleService {
    public List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 50];
    }
}`,
      exercise: {
        title: 'Sharing Keywords',
        instructions: "Debug the three sharing keywords:\n1. `\"with sharing\"`\n2. `\"without sharing\"`\n3. `\"inherited sharing\"`\n\nExpected output:\n```\nwith sharing\nwithout sharing\ninherited sharing\n```",
        starterCode: `// Debug the three sharing keywords\n`,
        expectedOutput: ['with sharing', 'without sharing', 'inherited sharing'],
        hint: "Three System.debug calls",
        solution: `System.debug('with sharing');\nSystem.debug('without sharing');\nSystem.debug('inherited sharing');`,
      },
    },
    {
      id: 'crud-fls', title: 'CRUD / FLS Enforcement', xp: 35,
      theory: `## CRUD and Field-Level Security

### Checking Object Access (CRUD)

\`\`\`apex
// Before querying — check read access
if (!Schema.sObjectType.Account.isAccessible()) {
    throw new SecurityException('No access to Account');
}
List<Account> accounts = [SELECT Id, Name FROM Account];

// Before DML — check write access
if (!Schema.sObjectType.Account.isCreateable()) {
    throw new SecurityException('Cannot create Account');
}
insert new Account(Name = 'New Corp');

// Updateable, Deletable
Schema.sObjectType.Account.isUpdateable();
Schema.sObjectType.Account.isDeletable();
\`\`\`

### Field-Level Security (FLS)

\`\`\`apex
// Check if field is readable
Schema.SObjectField nameField = Schema.sObjectType.Account.fields.Name;
if (!nameField.isAccessible()) {
    throw new SecurityException('No access to Account.Name');
}

// Check if field is editable
if (!Schema.sObjectType.Account.fields.Phone.isUpdateable()) {
    System.debug('Cannot edit Phone field');
}
\`\`\`

### WITH SECURITY_ENFORCED (SOQL-level FLS)

\`\`\`apex
// Throws QueryException if user lacks access to any field in query
List<Account> accounts = [
    SELECT Id, Name, AnnualRevenue, Phone
    FROM Account
    WITH SECURITY_ENFORCED  // FLS enforced!
    LIMIT 100
];
\`\`\`

### stripInaccessible (Modern Approach)

\`\`\`apex
// Auto-remove fields the user can't access
SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE,
    [SELECT Id, Name, AnnualRevenue FROM Account]
);
List<Account> safe = (List<Account>) decision.getRecords();
\`\`\``,
      codeExample: `// Secure service class template
public with sharing class SecureAccountService {

    public static List<Account> getAccounts() {
        // Check CRUD
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new SecurityException('No read access to Account');
        }

        // Use WITH SECURITY_ENFORCED for FLS
        return [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 100
        ];
    }

    public static void createAccount(String name) {
        if (!Schema.sObjectType.Account.isCreateable()) {
            throw new SecurityException('Cannot create Account');
        }
        insert new Account(Name = name);
    }
}`,
      exercise: {
        title: 'Security Methods',
        instructions: "Debug the SOQL security clause and the modern FLS method:\n1. `\"WITH SECURITY_ENFORCED\"`\n2. `\"Security.stripInaccessible\"`\n\nExpected output:\n```\nWITH SECURITY_ENFORCED\nSecurity.stripInaccessible\n```",
        starterCode: `// Debug the two FLS enforcement approaches\n`,
        expectedOutput: ['WITH SECURITY_ENFORCED', 'Security.stripInaccessible'],
        hint: "Two System.debug calls",
        solution: `System.debug('WITH SECURITY_ENFORCED');\nSystem.debug('Security.stripInaccessible');`,
      },
    },
  ],
},

];

// ─────────────────────────────────────────────────────────────────────────────
// CHEAT SHEETS
// ─────────────────────────────────────────────────────────────────────────────

export const CHEAT_SHEETS = [
  {
    id: 'soql', title: 'SOQL Quick Reference', icon: '🗄️',
    sections: [
      { title: 'Basic Syntax', content: `SELECT field1, field2
FROM ObjectName
WHERE condition
ORDER BY field ASC|DESC
LIMIT n
OFFSET n` },
      { title: 'WHERE Operators', content: `=, !=, <, >, <=, >=
LIKE '%text%'       wildcard
IN (val1, val2)
NOT IN (val1, val2)
AND, OR, NOT
= null, != null` },
      { title: 'Date Literals', content: `TODAY
YESTERDAY
THIS_WEEK / LAST_WEEK
THIS_MONTH / LAST_MONTH
THIS_QUARTER / LAST_QUARTER
THIS_YEAR / LAST_YEAR
LAST_N_DAYS:n
NEXT_N_DAYS:n` },
      { title: 'Aggregate Functions', content: `COUNT()
COUNT(field)
SUM(field)
AVG(field)
MAX(field)
MIN(field)
GROUP BY field
HAVING condition` },
      { title: 'Relationship Queries', content: `// Child to Parent (dot notation)
SELECT Account.Name FROM Contact

// Parent to Child (subquery)
SELECT (SELECT Name FROM Contacts) FROM Account

// Custom objects use __r
SELECT Project__r.Name FROM Task__c` },
      { title: 'Bind Variables', content: `String name = 'Acme';
Set<Id> ids = new Set<Id>{...};

// Use : to inject
[SELECT Id FROM Account WHERE Name = :name]
[SELECT Id FROM Account WHERE Id IN :ids]` },
    ],
  },
  {
    id: 'collections', title: 'Collections Reference', icon: '📦',
    sections: [
      { title: 'List Methods', content: `list.add(element)
list.add(index, element)
list.get(index)
list.set(index, element)
list.remove(index)
list.size()
list.contains(element)
list.sort()
list.isEmpty()
list.clear()
list.clone()
list.addAll(otherList)` },
      { title: 'Set Methods', content: `set.add(element)
set.remove(element)
set.contains(element)
set.size()
set.isEmpty()
set.clear()
set.addAll(collection)
set.retainAll(collection)
set.removeAll(collection)
set.clone()` },
      { title: 'Map Methods', content: `map.put(key, value)
map.get(key)
map.remove(key)
map.containsKey(key)
map.keySet()  → Set
map.values()  → List
map.size()
map.isEmpty()
map.clear()
map.clone()
map.putAll(otherMap)` },
      { title: 'Quick Conversions', content: `// List → Set (deduplicate)
Set<String> s = new Set<String>(myList);

// Set → List (sortable)
List<String> l = new List<String>(mySet);

// Records → Map<Id, SObject>
Map<Id, Account> m = new Map<Id, Account>(accountList);

// List → JSON
String json = JSON.serialize(myList);` },
    ],
  },
  {
    id: 'governor-limits', title: 'Governor Limits', icon: '🛡️',
    sections: [
      { title: 'Per-Transaction Limits', content: `SOQL Queries:     100 (sync) / 200 (async)
DML Statements:   150
DML Rows:         10,000
CPU Time:         10s (sync) / 60s (async)
Heap Size:        6 MB (sync) / 12 MB (async)
Callouts:         100
Future Calls:     50
SOQL Rows:        50,000
Batch Concurrent: 5` },
      { title: 'Check Limits', content: `Limits.getQueries()
Limits.getLimitQueries()
Limits.getDmlStatements()
Limits.getLimitDmlStatements()
Limits.getDmlRows()
Limits.getCpuTime()
Limits.getHeapSize()
Limits.getCallouts()` },
      { title: 'Key Rules', content: `✅ SOQL outside loops
✅ DML outside loops
✅ Collect IDs → one query → Map
✅ Build list → one DML
✅ Use Set<Id> for deduplication
✅ Test with 200 records
❌ Never: SELECT in a for loop
❌ Never: insert/update in a for loop` },
    ],
  },
  {
    id: 'string-methods', title: 'String Methods', icon: '🔤',
    sections: [
      { title: 'Core Methods', content: `s.length()
s.toUpperCase()
s.toLowerCase()
s.trim()
s.contains('sub')
s.startsWith('pre')
s.endsWith('suf')
s.indexOf('sub')
s.lastIndexOf('sub')
s.substring(start, end)
s.replace('old', 'new')
s.replaceAll('regex', 'new')
s.split('delimiter')
s.charAt(index)` },
      { title: 'Comparison & Null', content: `s.equals('other')         // use this, not ==
s.equalsIgnoreCase('other')
String.isBlank(s)          // null or whitespace
String.isNotBlank(s)
String.isEmpty(s)          // null or empty
s.compareTo('other')       // for sorting` },
      { title: 'Formatting', content: `// Concatenation
'Hello' + ' ' + 'World'

// String.format
String.format('Hi {0}, you have {1} msgs',
    new List<Object>{'Alice', 5});
// Hi Alice, you have 5 msgs

// Abbreviate (truncate)
s.abbreviate(20);  // max 20 chars

// Padding
s.leftPad(10);
s.rightPad(10);` },
    ],
  },
  {
    id: 'async', title: 'Async Apex Summary', icon: '⏳',
    sections: [
      { title: '@future', content: `@future
public static void myMethod(List<Id> ids) {}

@future(callout=true)
public static void callOut(Set<Id> ids) {}

Rules:
• static void only
• primitive params only
• max 50/transaction
• cannot chain
• cannot call from batch` },
      { title: 'Queueable', content: `public class MyJob implements Queueable {
    public void execute(QueueableContext ctx) {
        // Your logic
        System.enqueueJob(new NextJob()); // chain
    }
}
System.enqueueJob(new MyJob());

Advantages over @future:
• Non-primitive params
• Chainable
• Job ID returned
• Called from batch` },
      { title: 'Batch Apex', content: `implements Database.Batchable<SObject>
implements Database.Stateful (optional)

start()   → QueryLocator or Iterable
execute() → processes each chunk
finish()  → cleanup/notification

Database.executeBatch(new MyBatch(), 200);

Limits:
• 5 concurrent jobs
• 1-2000 records/chunk
• 50M records via QueryLocator` },
      { title: 'Schedulable', content: `public class MyJob implements Schedulable {
    public void execute(SchedulableContext sc) {
        // Your logic or start a batch
    }
}

// Cron: Sec Min Hour Day Month Weekday Year
String cron = '0 0 2 * * ?'; // 2 AM daily
System.schedule('My Job', cron, new MyJob());

Limits:
• 100 scheduled jobs/org` },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────

export const BADGES = [
  { id: 'first-lesson',       icon: '🚀', title: 'First Steps',         description: 'Complete your first lesson' },
  { id: 'first-module',       icon: '🏗️', title: 'Foundation Builder',  description: 'Complete any module' },
  { id: 'streak-3',           icon: '🔥', title: '3-Day Streak',        description: 'Learn 3 days in a row' },
  { id: 'streak-7',           icon: '⚡', title: 'Week Warrior',         description: 'Learn 7 days in a row' },
  { id: 'streak-30',          icon: '🌟', title: 'Monthly Master',       description: 'Learn 30 days in a row' },
  { id: 'xp-100',             icon: '⭐', title: 'First 100 XP',         description: 'Earn 100 XP' },
  { id: 'xp-500',             icon: '💫', title: 'Power Learner',        description: 'Earn 500 XP' },
  { id: 'xp-1000',            icon: '✨', title: 'XP Collector',         description: 'Earn 1000 XP' },
  { id: 'xp-2500',            icon: '🌠', title: 'Dedication',           description: 'Earn 2500 XP' },
  { id: 'quiz-perfect',       icon: '🎯', title: 'Perfect Score',        description: 'Ace a Boss Quiz 5/5' },
  { id: 'daily-challenge',    icon: '📅', title: 'Daily Challenger',     description: 'Complete a daily challenge' },
  { id: 'collections-done',  icon: '📦', title: 'Data Wrangler',        description: 'Complete Collections' },
  { id: 'oop-done',           icon: '🏛️', title: 'OOP Architect',        description: 'Complete OOP' },
  { id: 'soql-done',          icon: '🗄️', title: 'SOQL Slinger',         description: 'Complete SOQL module' },
  { id: 'triggers-done',      icon: '⚡', title: 'Trigger Master',        description: 'Complete Triggers' },
  { id: 'async-done',         icon: '⏳', title: 'Async Ninja',           description: 'Complete Async Apex' },
  { id: 'testing-done',       icon: '🧪', title: 'Test Engineer',         description: 'Complete Testing' },
  { id: 'halfway',            icon: '🎯', title: 'Halfway Hero',          description: 'Complete 8 modules' },
  { id: 'champion',           icon: '🏆', title: 'Apex Champion',         description: 'Complete ALL 15 modules' },
  { id: 'speed-run',          icon: '💨', title: 'Speed Runner',          description: 'Complete 5 lessons in one day' },
];

// Daily challenges — rotate based on day
export const DAILY_CHALLENGES = [
  {
    id: 'dc-fizzbuzz',
    title: 'FizzBuzz Challenge',
    instructions: 'Print numbers 1 to 15. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", both print "FizzBuzz".',
    xpBonus: 50,
    expectedOutput: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'],
    starterCode: `for (Integer i = 1; i <= 15; i++) {\n    // Your logic here\n}\n`,
    solution: `for (Integer i = 1; i <= 15; i++) {\n    if (Math.mod(i,15)==0) System.debug('FizzBuzz');\n    else if (Math.mod(i,3)==0) System.debug('Fizz');\n    else if (Math.mod(i,5)==0) System.debug('Buzz');\n    else System.debug(i);\n}`,
  },
  {
    id: 'dc-palindrome',
    title: 'Palindrome Check',
    instructions: 'Check if "racecar" is a palindrome. Debug "true" if it is, "false" if not.',
    xpBonus: 40,
    expectedOutput: ['true'],
    starterCode: `String word = 'racecar';\n// Check if palindrome and debug true/false\n`,
    solution: `String word = 'racecar';\nString reversed = '';\nfor (Integer i = word.length()-1; i >= 0; i--) { reversed += word.charAt(i); }\nSystem.debug(word.equals(reversed));`,
  },
  {
    id: 'dc-fibonacci',
    title: 'Fibonacci Sequence',
    instructions: 'Print the first 8 Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21).',
    xpBonus: 60,
    expectedOutput: ['1','1','2','3','5','8','13','21'],
    starterCode: `Integer a = 1, b = 1;\n// Print first 8 Fibonacci numbers\n`,
    solution: `Integer a = 1, b = 1;\nSystem.debug(a); System.debug(b);\nfor (Integer i = 0; i < 6; i++) { Integer c = a + b; System.debug(c); a = b; b = c; }`,
  },
  {
    id: 'dc-primes',
    title: 'Prime Numbers',
    instructions: 'Print all prime numbers from 2 to 20.',
    xpBonus: 50,
    expectedOutput: ['2','3','5','7','11','13','17','19'],
    starterCode: `// Find and print all primes from 2 to 20\n`,
    solution: `for (Integer i = 2; i <= 20; i++) {\n    Boolean prime = true;\n    for (Integer j = 2; j < i; j++) {\n        if (Math.mod(i,j)==0) { prime = false; break; }\n    }\n    if (prime) System.debug(i);\n}`,
  },
  {
    id: 'dc-word-count',
    title: 'Word Frequency',
    instructions: 'Count how many times each word appears in "the cat sat on the mat the cat". Debug the count for "the" then "cat".',
    xpBonus: 70,
    expectedOutput: ['3','2'],
    starterCode: `String sentence = 'the cat sat on the mat the cat';\n// Count word frequency\n`,
    solution: `String sentence = 'the cat sat on the mat the cat';\nList<String> words = sentence.split(' ');\nMap<String,Integer> freq = new Map<String,Integer>();\nfor (String w : words) {\n    freq.put(w, (freq.containsKey(w) ? freq.get(w) : 0) + 1);\n}\nSystem.debug(freq.get('the'));\nSystem.debug(freq.get('cat'));`,
  },
  {
    id: 'dc-reverse-list',
    title: 'Reverse a List',
    instructions: 'Reverse the list {1, 2, 3, 4, 5} and debug each element.',
    xpBonus: 35,
    expectedOutput: ['5','4','3','2','1'],
    starterCode: `List<Integer> nums = new List<Integer>{1, 2, 3, 4, 5};\n// Reverse and debug each\n`,
    solution: `List<Integer> nums = new List<Integer>{1, 2, 3, 4, 5};\nfor (Integer i = nums.size()-1; i >= 0; i--) { System.debug(nums.get(i)); }`,
  },
  {
    id: 'dc-triangle',
    title: 'Triangle Pattern',
    instructions: 'Print a right triangle of * with 4 rows:\n```\n*\n**\n***\n****\n```',
    xpBonus: 45,
    expectedOutput: ['*','**','***','****'],
    starterCode: `// Print triangle of 4 rows\n`,
    solution: `String row = '';\nfor (Integer i = 1; i <= 4; i++) { row += '*'; System.debug(row); }`,
  },
];
