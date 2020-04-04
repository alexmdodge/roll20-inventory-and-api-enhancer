var sendChat = require('./../Functions/API_Chat/SendChat');
import { MOCK20object } from './Mock20_object'

export class MOCK20player extends MOCK20object {
  public MOCK20gm: boolean

  constructor(_id, input, MOCK20gm) {
    var data = {
      _id: '',
      _type: 'player',
      _d20userid: '',
      _displayname: '',
      _online: false,
      _lastpage: '',
      _macrobar: '',
      speakingas: '',
      color: '#13B9F0',
      showmacrobar: false
    };
    super(_id, input, data);
    this.MOCK20gm = MOCK20gm == true;
  }

  MOCK20chat(msg, options) {
    var who = this.get('speakingas');
    if (!who) {
      who = this.get('_displayname');
      if (this.MOCK20gm) who += ' (GM)';
    }

    var options = options || {};
    options.MOCK20playerid = this.id;
    sendChat(who, msg, null, options);
  }
}
