# GitHub Environment Audit

A quick and dirty way to enumerate all of the environments defined within a repo. This is only helpful if you have LOTS of dead environments and want to clean them up!

## Usage

``` bash
## Install project dependencies
npm install

## Run an audit
npm run audit

## Run and audit and remove the results
npm run audit clean
```

## Configuration

The project uses dotenv for configuration. You can see the expected schema in config.ts or use [this example](.env.example) to create your `.env` file.
