# Changelog

### [1.0.0-beta.5] - 2021-06-04

* Improve auto-matching logic to ignore hyphens `-` too

### [1.0.0-beta.4] - 2021-05-21

* fix issue with outdated docupilot token types
    * As schema can change, token types may differ between Document generations
    * this calls for using token type dynamically

* Consider "generic" token types as "string" and send data accordingly

### [1.0.0-beta.3] - 2021-05-20

* fix deadlock issue. ref commit: 7d24a7b594ab663b2fcc7c7e1b59ea9b29082732 for more details
    * by cleaning up the mapping with missing schema tokens
    * issue arises when the token is removed from DP 
      template, and the *mapped* field is deleted
      from AT table

### [1.0.0-beta.2] - 2021-05-14

* Put frequently used templates on top [#3](https://github.com/flackonInc/docupilot-airtable-block/issues/3)
* Getting all geared up for official release [#5](https://github.com/flackonInc/docupilot-airtable-block/issues/5)

### [1.0.0-beta.1] - 2021-05-14

Initial release with following features:

* Authtoken based authentication
* V1 APIs
* Automapping
* Sticky mapping
* n-level nesting
* Upload generated document to Attachment field
* Download generated document to computer if Upload settings are enabled
