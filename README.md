# win-get-updates

Third party CLI frontend for [winget](https://en.wikipedia.org/wiki/Windows_Package_Manager) update runs. It lets you interactively choose which package to install.

## Requirements

Windows with [winget](https://en.wikipedia.org/wiki/Windows_Package_Manager) installed. Supposed to run on cmd.exe.

## Install

```
npm install -g win-get-updates
```

## Run

### Global

```
wgu
```

### Local development

```
node src\cli.js
```

## Update dependencies

- Run once:

```
npm install -g npm-check-updates
```

- Run every time:

```
ncu -c 3 --peer -ui
```
