import {
  InventoryTemplate,
  ItemTemplate
} from '../../src/templates'
import {
  TestItems
} from '../../src/items'
import fs from 'fs'
import path from 'path'
import { Roll20Object, IIMInventoryMetadata } from '../../src/types'
import { IIM_INVENTORY_IDENTIFIER, IIM_ITEM_IDENTIFIER } from '../../src/constants'

const mockHandout: Roll20Object = {
  id: 'mock-handout-id',
  get() {
    return 'mock-get-value'
  },
  set() {
    //
  },
  remove() {
    //
  }
}

const mockInventory: IIMInventoryMetadata = {
  id: IIM_INVENTORY_IDENTIFIER,
  handoutId: null,
  inventory: [
    {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: null,
      amount: '3',
      item: TestItems[0]
    },
    {
      id: IIM_ITEM_IDENTIFIER,
      handoutId: null,
      amount: '2',
      item: TestItems[1]
    }
  ]
}

const testFilePath = path.resolve(__dirname, '../public/index.html')
fs.writeFileSync(testFilePath, `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css?family=Arimo&display=swap" rel="stylesheet">

  <title>IIM Test Page</title>

  <style>
    * {
      font-family: 'Arimo', sans-serif;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 40px;
    }
  </style>
</head>
<body class="container">
  ${InventoryTemplate(mockInventory)}
  ${TestItems.map(item => ItemTemplate(item, mockHandout)).join('')}
</body>
</html>
`)