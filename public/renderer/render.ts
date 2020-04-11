import '../../__tests__/mocks/index'

import {
  InventoryTemplate
} from '../../src/templates'
import {
  TestItems
} from '../../src/items'
import fs from 'fs'
import path from 'path'
import { IIMInventoryMetadata } from '../../src/types'
import { IIM_INVENTORY_IDENTIFIER, IIM_ITEM_IDENTIFIER } from '../../src/constants'

const mockInventory: IIMInventoryMetadata = {
  id: IIM_INVENTORY_IDENTIFIER,
  characterId: '',
  handoutId: null,
  totalWealth: {
    copper: '123',
    silver: '50',
    gold: '60',
    electrum: '23',
    platinum: '1'
  },
  totalWeight: '200',
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

const testFilePath = path.resolve(__dirname, '../index.html')
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
</body>
</html>
`)