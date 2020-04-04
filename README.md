# Roll20 Inventory and API Enhancer

An API script for Roll20 which focuses on enhancing the overall experience for D&D 5E with respect to items, inventory management, and general API commands.

## Installation

If you would like to try any development versions out within your own game:

```sh
npm install
npm run build
```

The build command will copy and output script to your clipboard, which can then be pasted into a custom script tab within the Roll20 API script interface.

## Local Development

If you would like to contribute to the project please refer to the contributor documentation. In general please submit all bugs and features requests to the `issues` section. If you would like to submit code please ensure it follows the branching structure as outlined in the documentation.

## Roadmap

- [ ] All inventories to be updated so template changes in future versions can be applied
- [ ] Ensure that items are removed by name and inventory ID, otherwise repeats can sometimes be inserted by the same ID
- [ ] Generate a master API command page where updates, items, and inventories can be made
- [ ] Provide filter of inventories by weight, price, and name
- [ ] Calculate approximate inventory value, and add tests which validate the final amount
- [ ] Calculate approximate inventory weight, and add tests which validate the final amount
- [ ] Change item handout rendering to better separate item copying / creation functionality and data update
- [ ] Add simple import mechanic for either pasting in JSON, or converting to Base64 to allow for tables to be imported more quickly
