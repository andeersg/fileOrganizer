# Always optimize!

* A script that is running all the time.
* Watches a specific folder for changes.
* When something changes it triggers something.
* Everything is logged to file/db

## Tests

We should have tests for all the individual modules used. For example:

* Regex matcher should recognize correct files and folders.
* Renamer should generate correct file and path.
* API integration should determine something.

## Solution 1:

A webserver with the following features:

* Every N minute/hour it triggers a function that scans the folder.
* This approach is easily extendable since we can trigger the script for multiple folders.

## Solution 2:

A FS.Watch process running and monitoring folder for changes.

## Solution 3:

A script that is triggered N times a day. That scans folder and moves stuff.


## Flow

1. Web server is running.
2. Every 60 minutes it scans the folder.
3. If it finds a match, it starts a process for the file.
4. This is repeated for each file.
5. We either send in the IO object, or we use EventEmitter to emit stuff.
6. If clients are connected we emit to them, else we just log.