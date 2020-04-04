import { MOCK20character } from './Mock20_character'

export class MOCK20handout extends MOCK20character{
  constructor(_id, input) {
    var data = {
      _id: '',
      _type: 'handout',
      avatar: '',
      name: '',
      notes: '',
      gmnotes: '',
      inplayerjournals: '',
      archived: false,
      controlledby: ''
    };
    super(_id, input, data);
  }
}
