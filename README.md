## Inputs

We've provided you two three different inputs into your solution. These are located within the `/data` path. You will need to use all of them:

* `accounts.json` - A list of our user accounts. You should ignore any data which doesn't map to an existing user account.
* `airtel.json` - airtel provides us a list of Offers in JSON format.
* `jio.json` - jio also provides us a list of Offers in the same JSON format.

The format and rules surrounding the Provider files are described below under **Offers**.

## Output

Your program will need to load these inputs, process them according to the rules under **Offers** below, and output a single file as `./output/result.json`, which contains the output from the analysis results.

The output should be focussed around each account. For each account, we want to know the number of whole days (rounded down) the user has had free subscription from each provider.

The format of the JSON output file should match this structure:

```
{
  "subscriptions": {
    "Gagan": {
      "airtel": 34,
      "jio": 62
    },
    "Ranga": {
      "airtel": 34
    }
  }
}
```

## Implementation

You should write your code as if it's going straight to Production, so it needs to be production ready, and maintainable for other developers. To that end, heres what we care about when we write code, and we want you to care about these things too, so we expect the following to be demonstrated in your code base:

* **Domain Modeling** - Your solution should model the domain it's working within for clarity.
* **Design Patterns** - Don't reinvent the wheel. If you know a pattern which suits, use it.
* **Automated Tests** - Your code should be fully tested.
* **Logging** - Your code should include logs, logging to `STDOUT`. Logging is essential in debugging a system running in production. Logs at the `INFO` level should include decisions your program is making, while the `DEBUG` level can be anything that adds more context to the decision.
* **Performant** - You don't need to optimise to the millisecond level, but don't do things which will obviously cause performance issues in production.
* **Failure Handling** - You should expect things to go wrong, and assumptions to be wrong. Your code should handle these situations.


## Offer Rules

There are two inputs into the Offer algorithm:

* `GRANT` Offers, which give a user an Offer.
* `REVOKE` Offers, which removes the Offer.

Our Providers aren't aware of user accounts in our system, so instead they send MSISDNs for each user.

**GRANT Offers**

Format:

Each `GRANT` contains:

* The users phone number
* The date (ISO8601 format) at which the GRANT starts
* The period of free tripeur for that user, in months.

Rules:

* The first Provider to give a GRANT "owns" that user. Other Providers cannot add to that users Offer.
* Expiring GRANTs from the same Provider stack on top of each other if still active.
* Offer months are by calendar months, not in 30 day blocks.
* GRANT offers without a period defined should be ignored entirely.

**REVOKE Offers**

Each `REVOKE` contains:

* The users phone number
* The date (ISO8601 format) at which the REVOKE is effective from

Rules:

* A Provider can only revoke an Offer if they "own" the user.
* REVOKE of an expired Offer is possible, the user should be "released" from the Provider.
* REVOKEs should be processed before GRANTs.

**Examples**

```
Provider A issues a GRANT to Mohan for 3 months.
Provider B issues a GRANT to Mohan 4 months later.

Mohan is still owned by Provider A, so Provider B's Offer is ignored
```

```
Provider A issues a GRANT to Mohan for 3 months.
Provider A issues a REVOKE to Mohan 2 months later.
Provider B issues a GRANT to Mohan for 2 months at the exact same time as the REVOKE was issued.

Mohan gets 2 months from Provider A and 2 months from Provider B.
```

```
Provider A issues a GRANT to Mohan for 3 months.
Provider A issues a REVOKE to Mohan 2 months later.
Provider B issues a GRANT to Mohan for 2 months, but 1 day before the REVOKE was issued.

Mohan gets 2 months from Provider A, and Provider B is ignored.
```

```
Provider A issues a GRANT to Mohan for 4 months.
Provider A issues a GRANT to Mohan for 6 months, 3 months later.

Mohan has 10 months free tripeur from Provider A.
```

## Submission


The code you write for the solution should be in the `lib` folder, and your tests should be in the `test` folder (or similar if your framework uses something different). Unit, integration and system tests should be in separate folders within there.

Your solution should update the `bin/run` script to install all dependencies and execute your application. It should provide the result JSON file into the `output` folder of the project.

Similarly, your solution should update the `bin/test` script to install all dependencies and run your automated tests.

Take some time to describe your submission's approach, and any platform requirements which cannot be automatically installed via the `bin/` scripts. Put this into a `SUBMISSION.md` file in the root of your project.

When you're ready, please zip the entire project folder and submit it via email to `vinay@tripeur.com`. 