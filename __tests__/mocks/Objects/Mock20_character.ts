import { MOCK20object } from './Mock20_object'
var Campaign = require('./../Functions/API_Objects/Campaign');

export class MOCK20character extends MOCK20object {
  constructor(_id, input, data) {
    data = data || {
      _id: '',
      _type: 'character',
      avatar: '',
      name: '',
      bio: '',
      gmnotes: '',
      archived: false,
      inplayerjournals: '',
      controlledby: '',
      _defaulttoken: ''
    };
    super(_id, input, data);
  }

  get(property, cb?) {
    if (property == 'bio' || property == 'gmnotes' || property == 'notes') {
      var notes = this.MOCK20data[property];
      setTimeout(function () {
        cb(notes);
      }, 100);
    } else {
      return super.get(property);
    }
  }

  MOCK20addToJournal() {
    return Campaign().addObjToJournal(this);
  }
}
