/*:
 * @plugindesc v1.1 Добавляет в меню кнопку переключения джойстика
 * @author Xelleras
 * @help
 * ============================================================================
 * Плагин добавляет в главное меню кнопку переключения джойстика:
 *   - "Отключить джойстик" → выключает джойстик и кнопки
 *   - "Включить джойстик" → включает джойстик и кнопки
 * ============================================================================
 * 
 * КАК РАБОТАЕТ:
 *   - В главном меню появляется команда для переключения джойстика
 *   - Состояние сохраняется в переменной игры (по умолчанию #1)
 *   - При нажатии выполняются команды плагина MC
 * 
 * НАСТРОЙКИ:
 *   - Переменная #1 (по умолчанию) хранит состояние (0=выкл, 1=вкл)
 *   - Можно изменить ID переменной в параметрах плагина
 * 
 * ТРЕБОВАНИЯ:
 *   - Плагин MC (Moghunter's Joystick) должен быть установлен
 * 
 * ============================================================================
 * @param stateVariable
 * @text Переменная состояния
 * @desc ID переменной, где хранится состояние джойстика (0=выкл, 1=вкл)
 * @type number
 * @min 1
 * @max 5000
 * @default 1
 * 
 * @param buttonOffText
 * @text Текст кнопки (Выкл)
 * @desc Текст кнопки когда джойстик включён
 * @default Отключить джойстик
 * 
 * @param buttonOnText
 * @text Текст кнопки (Вкл)
 * @desc Текст кнопки когда джойстик выключён
 * @default Включить джойстик
 */

(function() {

    // ==========================================================================
    // ЗАГРУЗКА ПАРАМЕТРОВ
    // ==========================================================================
    
    var parameters = PluginManager.parameters('RL_JoystickToggle');
    
    function getParam(name, defaultValue) {
        var value = parameters[name];
        return value !== undefined ? value : defaultValue;
    }
    
    var STATE_VAR = Number(getParam('stateVariable', 1));
    var BUTTON_OFF_TEXT = getParam('buttonOffText', 'Отключить джойстик');
    var BUTTON_ON_TEXT = getParam('buttonOnText', 'Включить джойстик');
    
    // ==========================================================================
    // 1. ДОБАВЛЯЕМ КОМАНДУ В ГЛАВНОЕ МЕНЮ С ДИНАМИЧЕСКИМ НАЗВАНИЕМ
    // ==========================================================================
    
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        var isEnabled = getJoystickState();
        var commandName = isEnabled ? BUTTON_OFF_TEXT : BUTTON_ON_TEXT;
        this.addCommand(commandName, "toggleJoystick", true);
    };
    
    // Переопределяем refresh, чтобы обновлять название кнопки
    var _Window_MenuCommand_refresh = Window_MenuCommand.prototype.refresh;
    Window_MenuCommand.prototype.refresh = function() {
        _Window_MenuCommand_refresh.call(this);
        // Обновляем текст команды
        var index = this.findSymbol('toggleJoystick');
        if (index >= 0) {
            var isEnabled = getJoystickState();
            var commandName = isEnabled ? BUTTON_OFF_TEXT : BUTTON_ON_TEXT;
            this._list[index].name = commandName;
            this.drawItem(index);
        }
    };
    
    // ==========================================================================
    // 2. ФУНКЦИИ РАБОТЫ С СОСТОЯНИЕМ
    // ==========================================================================
    
    function getJoystickState() {
        // По умолчанию джойстик включён (true)
        if ($gameVariables.value(STATE_VAR) === 0) {
            return false; // выключен
        }
        return true; // включён
    }
    
    function setJoystickState(state) {
        $gameVariables.setValue(STATE_VAR, state ? 1 : 0);
    }
    
    // ==========================================================================
    // 3. ФУНКЦИЯ ВЫПОЛНЕНИЯ КОМАНД
    // ==========================================================================
    
    function executeJoystickCommands(enable) {
        var interpreter = new Game_Interpreter();
        
        if (enable) {
            // ===== ВКЛЮЧЕНИЕ =====
            console.log('🔄 Включаем джойстик и кнопки...');
            
            // Джойстик
            try {
                interpreter.pluginCommand('MC', ['Joystick', 'show']);
                console.log('✅ MC Joystick show');
            } catch(e) {}
            
            // Кнопка 1
            try {
                interpreter.pluginCommand('MC', ['Button', '1', 'show']);
                console.log('✅ MC Button 1 show');
            } catch(e) {}
            
            // Кнопка 2
            try {
                interpreter.pluginCommand('MC', ['Button', '2', 'show']);
                console.log('✅ MC Button 2 show');
            } catch(e) {}
            
            // Прямой вызов как запасной вариант
            try {
                if (typeof MC !== 'undefined') {
                    if (MC.Joystick && typeof MC.Joystick.show === 'function') {
                        MC.Joystick.show();
                    }
                    if (MC.Button) {
                        if (typeof MC.Button.show === 'function') {
                            MC.Button.show(1);
                            MC.Button.show(2);
                        } else if (typeof MC.Button.setVisible === 'function') {
                            MC.Button.setVisible(1, true);
                            MC.Button.setVisible(2, true);
                        }
                    }
                }
            } catch(e) {}
            
            // Показываем кнопки в DOM
            try {
                document.querySelectorAll('.mc-button, .joystick-button, .joy-btn, [id*="joystick"], [id*="button"]')
                    .forEach(function(btn) {
                        if (btn.style) {
                            btn.style.display = '';
                            btn.style.visibility = '';
                        }
                    });
            } catch(e) {}
            
            setJoystickState(true);
            $gameMessage.add("\\c[6]Джойстик и кнопки включены\\c[0]");
            
        } else {
            // ===== ВЫКЛЮЧЕНИЕ =====
            console.log('🔄 Выключаем джойстик и кнопки...');
            
            // Джойстик
            try {
                interpreter.pluginCommand('MC', ['Joystick', 'hide']);
                console.log('✅ MC Joystick hide');
            } catch(e) {}
            
            // Кнопка 1 - пробуем разные варианты
            var buttonCommands = [
                ['MC', ['Button', '1', 'hide']],
                ['MC', ['Button', 'hide', '1']],
                ['MC', ['Button1', 'hide']],
                ['MC', ['Button', 'disable', '1']],
                ['MC', ['Button', '1', 'disable']]
            ];
            
            for (var i = 0; i < buttonCommands.length; i++) {
                try {
                    interpreter.pluginCommand(buttonCommands[i][0], buttonCommands[i][1]);
                    console.log('✅ Кнопка 1:', buttonCommands[i][0], buttonCommands[i][1]);
                    break;
                } catch(e) {}
            }
            
            // Кнопка 2
            var button2Commands = [
                ['MC', ['Button', '2', 'hide']],
                ['MC', ['Button', 'hide', '2']],
                ['MC', ['Button2', 'hide']],
                ['MC', ['Button', 'disable', '2']],
                ['MC', ['Button', '2', 'disable']]
            ];
            
            for (var j = 0; j < button2Commands.length; j++) {
                try {
                    interpreter.pluginCommand(button2Commands[j][0], button2Commands[j][1]);
                    console.log('✅ Кнопка 2:', button2Commands[j][0], button2Commands[j][1]);
                    break;
                } catch(e) {}
            }
            
            // Прямой вызов как запасной вариант
            try {
                if (typeof MC !== 'undefined') {
                    if (MC.Joystick && typeof MC.Joystick.hide === 'function') {
                        MC.Joystick.hide();
                    }
                    if (MC.Button) {
                        if (typeof MC.Button.hide === 'function') {
                            MC.Button.hide(1);
                            MC.Button.hide(2);
                        } else if (typeof MC.Button.disable === 'function') {
                            MC.Button.disable(1);
                            MC.Button.disable(2);
                        } else if (typeof MC.Button.setVisible === 'function') {
                            MC.Button.setVisible(1, false);
                            MC.Button.setVisible(2, false);
                        }
                    }
                }
            } catch(e) {}
            
            // Скрываем кнопки в DOM
            try {
                document.querySelectorAll('.mc-button, .joystick-button, .joy-btn, [id*="joystick"], [id*="button"]')
                    .forEach(function(btn) {
                        if (btn.style) {
                            btn.style.display = 'none';
                            btn.style.visibility = 'hidden';
                        }
                    });
            } catch(e) {}
            
            setJoystickState(false);
            $gameMessage.add("\\c[6]Джойстик и кнопки отключены\\c[0]");
        }
        
        // Обновляем меню (если открыто)
        try {
            if (SceneManager._scene instanceof Scene_Menu) {
                SceneManager._scene._commandWindow.refresh();
            }
        } catch(e) {}
    }
    
    // ==========================================================================
    // 4. ОБРАБОТЧИК КОМАНДЫ В МЕНЮ
    // ==========================================================================
    
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('toggleJoystick', this.commandToggleJoystick.bind(this));
    };
    
    Scene_Menu.prototype.commandToggleJoystick = function() {
        this._commandWindow.close();
        this.popScene();
        
        var currentState = getJoystickState();
        var newState = !currentState;
        
        setTimeout(function() {
            executeJoystickCommands(newState);
        }, 150);
    };
    
    // ==========================================================================
    // 5. ГЛОБАЛЬНЫЕ ФУНКЦИИ
    // ==========================================================================
    
    window.toggleJoystick = function() {
        var currentState = getJoystickState();
        executeJoystickCommands(!currentState);
    };
    
    window.enableJoystick = function() {
        executeJoystickCommands(true);
    };
    
    window.disableJoystick = function() {
        executeJoystickCommands(false);
    };
    
    // ==========================================================================
    // 6. КОМАНДА ПЛАГИНА ДЛЯ СОБЫТИЙ
    // ==========================================================================
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'ToggleJoystick') {
            var currentState = getJoystickState();
            executeJoystickCommands(!currentState);
        } else if (command === 'EnableJoystick') {
            executeJoystickCommands(true);
        } else if (command === 'DisableJoystick') {
            executeJoystickCommands(false);
        }
    };
    
    // ==========================================================================
    // 7. ДОПОЛНИТЕЛЬНО: ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ
    // ==========================================================================
    
    // При загрузке игры проверяем состояние
    var _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.call(this);
        // Если переменная не инициализирована, устанавливаем значение по умолчанию (включён)
        if ($gameVariables.value(STATE_VAR) === 0) {
            // Проверяем, не было ли сохранённого состояния
            var savedState = $gameVariables.value(STATE_VAR);
            if (savedState === undefined || savedState === 0) {
                // По умолчанию джойстик включён
                $gameVariables.setValue(STATE_VAR, 1);
            }
        }
    };
    
    // ==========================================================================
    // 8. ОТЛАДКА
    // ==========================================================================
    
    setTimeout(function() {
        console.log('🔍 RL_JoystickToggle загружен!');
        console.log('  Переменная состояния: #' + STATE_VAR);
        console.log('  Текущее состояние:', getJoystickState() ? 'ВКЛ' : 'ВЫКЛ');
        console.log('  Команды: ToggleJoystick, EnableJoystick, DisableJoystick');
        console.log('  Скрипты: toggleJoystick(), enableJoystick(), disableJoystick()');
    }, 1000);
    
})();