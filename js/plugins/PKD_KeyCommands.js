
//=============================================================================
// PKD_KeyCommands.js (ver.1.0)
//=============================================================================
// [Update History]
// v1.0 (12.08.2022) - release

/*:
 * @plugindesc v1.0 - Call common event on keyboard key
 * @author Pheonix KageDesu
 * @target MZ MV
 * @url http://kdworkshop.net/key-commands/
 * 
 * @help
 * [Description]
 * Plugin allows you bind common event to any keyboard key and call
 * common event in game by pressing binded key
 * 
 * -------------------------
 * [Usage]
 * 
 * You can set binding in Plugin Parameters
 * Or you can use Script call:
 * registerCEBind(KEY, ID, SWITCH_ID);
 * 
 * Where:
 * KEY - any keyboard key (in quotes)
 * ID - common event ID to call (0 - remove binding)
 * SWITCH_ID - call condition switch ID or 0 [OPTIONAL]
 * 
 * Examples:
 * registerCEBind("g", 100);
 * registerCEBind("s", 78, 22);
 * 
 * MZ version of plugin also have Plugin Commands
 * 
 * ------------------------
 * [Terms of Use]
 * See at plugin web page
 *
 * [Help]
 * https://kdworkshop.net/discord-server/
 *
 * [Support Author]
 * https://boosty.to/kagedesu
 * 
 * 
 * @command RegisterKeyCommand
 * @text Bind Key To CE
 * @desc Bind Key to start Commen Event

 * @arg key
 * @text Key
 * @type text
 * @desc Any keyboard key
 * @default

 * @arg event
 * @text Common Event
 * @type common_event
 * @desc Common Event to start or 0 to remove (clear) binding for Key
 * @default 0

 * @arg cSwitch
 * @text Condition switch
 * @type switch
 * @desc Only if switch == true, key will call CE. Set to 0 (empty) if you not need condition.
 * @default 0
 * 
 * 
@param keyCommands:structA
@text Key commands
@type struct<KeyCommand>[]
@default []
@desc Keys and Common Events configuration
*/


/*:ru
 * @plugindesc v1.0 - Вызов общего события по нажатию кнопки
 * @author Pheonix KageDesu
 * @target MZ MV
 * @url http://kdworkshop.net/key-commands/
 * 
 * @help
 * [Описание]
 * Плагин позволяет связать кнопку на клавиатуре и вызов общего события
 * 
 * -------------------------
 * [Использование]
 * 
 * Задайте привязку кнопка - событие в параметре плагина: Команды
 * 
 * Или используйте вызов скрипта в игре:
 * registerCEBind(KEY, ID, SWITCH_ID);
 * 
 * Где:
 * KEY - кнопка (в кавычках)
 * ID - номер общего события (0 - удалить привязку)
 * SWITCH_ID - номер переключателя условия (0 - нету) [ОПЦИОНАЛЬНО]
 * 
 * Примеры:
 * registerCEBind("g", 100);
 * registerCEBind("s", 78, 22);
 * 
 * MZ версия также имеет команды плагина
 * 
 * ------------------------
 * [Terms of Use]
 * See at plugin web page
 *
 * [Помощь]
 * https://kdworkshop.net/discord-server/
 *
 * [Поддержите автора]
 * https://boosty.to/kagedesu
 * 
 * 
 * @command RegisterKeyCommand
 * @text Создать привязку
 * @desc

 * @arg key
 * @text Кнопка
 * @type text
 * @desc
 * @default

 * @arg event
 * @text Общее событие
 * @type common_event
 * @desc Общее событие которое будет вызвано при нажатии на кнопку (0 - удалить привязку)
 * @default 0

 * @arg cSwitch
 * @text Условие
 * @type switch
 * @desc 0 - нет условия. Переключатель - условие, если ВКЛ (TRUE), то событие будет вызвано по нажатию на кнопку
 * @default 0
 * 
 * 
@param keyCommands:structA
@text Команды
@type struct<KeyCommand>[]
@default []
@desc
*/

/*~struct~KeyCommand:
    @param key
    @text Key
    @type text
    @desc Any keyboard key
    @default h

    @param event:int
    @text Common Event
    @type common_event
    @desc Common Event to start or 0 to remove (clear) binding for Key
    @default 0

    @param cSwitch:int
    @text Condition switch
    @type switch
    @desc Only if switch == true, key will call CE. Set to 0 (empty) if you not need condition.
    @default 0
*/
/*~struct~KeyCommand:ru
    @param key
    @text Кнопка
    @type text
    @desc Любая кнопка на клавиатуре
    @default h

    @param event:int
    @text Событие
    @type common_event
    @desc Общее событие которое будет вызвано при нажатии на кнопку
    @default 0

    @param cSwitch:int
    @text Условие
    @type switch
    @desc 0 - нет условия. Переключатель - условие, если ВКЛ (TRUE), то событие будет вызвано по нажатию на кнопку
    @default 0
*/

var Imported = Imported || {};

(function(){


if(Utils.RPGMAKER_NAME.contains("MZ")) {
    PluginManager.registerCommand("PKD_KeyCommands", 'RegisterKeyCommand', args => {
        try {
            window.registerCEBind(args.key, parseInt(args.event), parseInt(args.cSwitch));
        } catch (e) {
            console.warn(e);
        }
    });
}

(function(){
    
    //@[ALIAS]
    var _alias_DataManager_52 = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _alias_DataManager_52.call(this);
        try {


            if(Imported.KDCore == true) {
                let PP = new KDCore.ParamLoader("keyCommands:structA");
                for(let i of PP.getParam("keyCommands", [])) {
                    window.registerCEBind(i.key, i.event, i.cSwitch);
                }
            } else {

                let PP = PluginManager.parameters('PKD_KeyCommands');
                let outer = JsonEx.parse(PP['keyCommands:structA']);

                let keyCommands = [];

                outer.forEach(item => {
                    try {
                        keyCommands.push(JsonEx.parse(item));
                    } catch (e) {
                        console.warn(e);
                    }
                });

                keyCommands.forEach(i => {
                    try {
                        window.registerCEBind(
                            i.key,
                            parseInt(i['event:int']),
                            parseInt(i['cSwitch:int'])
                        );
                    } catch (e) {
                        console.warn(e);
                    }
                });
            }
        } catch (e) {
            console.warn(e);
        }
    };

})();
// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ SYSTEM KDCORE.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  var _input_onKeyDown, _input_onKeyUp, i, j, k, l;
  if (Imported.KDCore === true) {
    return;
  }
  Input.KeyMapperPKD = {};
//Numbers
  for (i = j = 48; j <= 57; i = ++j) {
    Input.KeyMapperPKD[i] = String.fromCharCode(i);
  }
//Letters Upper
  for (i = k = 65; k <= 90; i = ++k) {
    Input.KeyMapperPKD[i] = String.fromCharCode(i).toLowerCase();
  }
//Letters Lower (for key code events)
  for (i = l = 97; l <= 122; i = ++l) {
    Input.KeyMapperPKD[i] = String.fromCharCode(i).toLowerCase();
  }
  
  //@[ALIAS]
  _input_onKeyDown = Input._onKeyDown;
  Input._onKeyDown = function(event) {
    _input_onKeyDown.call(this, event);
    if (Input.keyMapper[event.keyCode]) {
      return;
    }
    Input._setStateWithMapperPKD(event.keyCode);
  };
  //@[ALIAS]
  _input_onKeyUp = Input._onKeyUp;
  Input._onKeyUp = function(event) {
    _input_onKeyUp.call(this, event);
    if (Input.keyMapper[event.keyCode]) {
      return;
    }
    Input._setStateWithMapperPKD(event.keyCode, false);
  };
  //?NEW
  Input._setStateWithMapperPKD = function(keyCode, state = true) {
    var symbol;
    symbol = Input.KeyMapperPKD[keyCode];
    if (symbol != null) {
      return this._currentState[symbol] = state;
    }
  };
})();

// ■ END SYSTEM KDCORE.coffee
//---------------------------------------------------------------------------
window.registerCEBind = function(key, ce, switchN) {
  var e;
  try {
    if (key == null) {
      return;
    }
    if (key === "") {
      return;
    }
    if (ce <= 0) {
      ce = null;
    }
    if (switchN <= 0) {
      switchN = null;
    }
    key = key.toLowerCase();
    $gamePlayer.mRegisterCEBind(key, ce, switchN);
  } catch (error) {
    e = error;
    console.warn(e);
  }
};

(function() {  //╒═════════════════════════════════════════════════════════════════════════╛
  // ■ Game_Player.coffee
  //╒═════════════════════════════════════════════════════════════════════════╛
  //---------------------------------------------------------------------------
  var _;
  //@[DEFINES]
  _ = Game_Player.prototype;
  _.mInitKCEDB = function() {
    if (this._mKCEDB == null) {
      return this._mKCEDB = {};
    }
  };
  _.mRegisterCEBind = function(key, ce, switchN) {
    this.mInitKCEDB();
    if ((ce != null) && ce > 0) {
      this._mKCEDB[key] = [ce, switchN];
    } else {
      if (this._mKCEDB[key] != null) {
        delete this._mKCEDB[key];
      }
    }
  };
  _.mCheckKeysToExecuteCE = function() {
    var ceData, e, key, ref;
    ref = this._mKCEDB;
    for (key in ref) {
      ceData = ref[key];
      if (Input.isTriggered(key)) {
        try {
          this.mExecuteCEbyKey(ceData);
        } catch (error) {
          e = error;
          console.warn(e);
        }
      }
    }
  };
  _.mExecuteCEbyKey = function(ceData) {
    if (ceData == null) {
      return;
    }
    if (ceData[0] == null) {
      return;
    }
    if (ceData[1] != null) {
      if ($gameSwitches.value(ceData[1]) === true) {
        $gameTemp.reserveCommonEvent(ceData[0]);
      }
    } else {
      $gameTemp.reserveCommonEvent(ceData[0]);
    }
  };
})();

(function() {  // ■ END Game_Player.coffee
  //---------------------------------------------------------------------------

  //╒═════════════════════════════════════════════════════════════════════════╛
  // ■ Scene_Map.coffee
  //╒═════════════════════════════════════════════════════════════════════════╛
  //---------------------------------------------------------------------------
  var ALIAS__onMapLoaded, ALIAS__update, _;
  //@[DEFINES]
  _ = Scene_Map.prototype;
  //@[ALIAS]
  ALIAS__onMapLoaded = _.onMapLoaded;
  _.onMapLoaded = function() {
    ALIAS__onMapLoaded.call(this);
    $gamePlayer.mInitKCEDB();
  };
  //@[ALIAS]
  ALIAS__update = _.update;
  _.update = function() {
    ALIAS__update.call(this);
    return this.mUpdateKeyCE();
  };
  _.mUpdateKeyCE = function() {
    var isBusy;
    if (!this.isActive()) {
      return;
    }
    isBusy = $gameMap.isEventRunning() || $gameMessage.isBusy();
    if (!isBusy) {
      return $gamePlayer.mCheckKeysToExecuteCE();
    }
  };
})();

// ■ END Scene_Map.coffee
//---------------------------------------------------------------------------

})();
