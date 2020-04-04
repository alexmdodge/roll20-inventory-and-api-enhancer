import {
  Roll20Object,
  Roll20ObjectType,
  IIMContext
} from '../types'
import { TestItems } from '../items'
import { whisperToPlayer, getHandoutsByName } from '../helpers'
import { ItemTemplate } from '../templates'

/**
 * DEPRECATED - Removing this functionality in favour of loading items
 * individually through coded data
 * @param player 
 * @param item 
 */
function createItemHandoutFor(player: Roll20Object, item: any) {
  // const activeHandouts = getHandoutsByName(item.name)

  // if (activeHandouts.length > 0) {
  //   activeHandouts.forEach(handout => {
  //     const handoutLink = `<a href="http://journal.roll20.net/handout/${handout.id}">${item.name}</a>`
  //     whisperToPlayer(player, `Handout already exists: ${handoutLink}`)
  //   })

  //   return
  // }

  // const handout = createObj(Roll20ObjectType.Handout, {
  //   name: item.name
  // })

  // const notes = ItemTemplate(item, handout)

  // handout.set('notes', notes)
  // handout.set('gmnotes', item.price)

  // const handoutLink = `<a href="http://journal.roll20.net/handout/${handout.id}">${item.name}</a>`
  // whisperToPlayer(player, `Created handout: ${handoutLink}`)
}

function loadAllItems(context: IIMContext) {
  TestItems.forEach(item => {
    createItemHandoutFor(context.player, item)
  })
}

export {
  loadAllItems
}