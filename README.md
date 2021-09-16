# Candy Machine Checker

This project is a frontend to help speed up manual validation of images and metadata for Solana NFT collections deployed using [Metaplex's](https://docs.metaplex.com/nft-standard) Candy Machine.

It was created for internal use, but it seemed like it might be valuable to other people as well.

## Installation

Clone the repo, drop a copy of your Candy Machine JSON config from the .cache directory created after running `candy-machine upload` into `public/CANDY_MACHINE_CONFIG`, and run `yarn start` to start checking your work at localhost:3000.

```bash
$ git clone https://github.com/penneydude/candy-machine-checker.git
$ cd candy-machine-checker
$ yarn install
```

You'll need to adapt this next command for your specific directory structure and Candy Machine project name. This is just an example.

```bash
$ cp candy-machine/.cache/{GENERATED FILE} candy-machine-checker/public/CANDY_MACHINE_CONFIG/
```

Then finally:

```bash
$ yarn start
```

If you change your Candy Machine JSON config, you'll have to quit the process and run `yarn start` again. Hot reloading the config isn't supported.

## Usage

Run `yarn start` then open localhost:3000 in a browser to access the UI. The controls are as follows:

- `Right arrow key` - Next item
- `Left arrow key` - Previous item
- `Space` - Toggle light/dark mode

## General Comment

Since this is a cryptocurrency-related project, I feel that it's important to say that there's absolutely no code in this project that
has the capability to connect to any cryptocurrency wallet in any way shape or form.

It's just some React code that reads from the JSON file you provide and fetches images and metadata from Arweave, then renders them side-by-side to make it easier to make sure they match up. Enjoy!
