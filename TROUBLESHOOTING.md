# IMPORTANT

You can get more information on what's happening by setting the **NODE_ENV** variable to `"dev"`.

#### PowerShell

    $env:NODE_ENV="dev"

#### Command Prompt

    SET NODE_ENV=dev

#### Bash

    export NODE_ENV=dev

---


### The channel overrides/ignored users lists aren't working.

Make sure the IDs are surrounded by quotes.

### YAMLException

SeeBorg4 uses the YAML file format for its configuration. Please take a look at an introduction to the YAML Syntax. A good resource might be: https://learnxinyminutes.com/docs/yaml/

### The command prompt automatically closes itself

Programs in Windows will close as soon as they are done. Therefore it is recommended that you run the command from the command prompt or, if you are running it from a batch script, you can add `pause` to your script to make it not close automatically.