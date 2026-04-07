/*:
 * @plugindesc v1.0 Система ачивок с редактируемыми параметрами
 * @author YourName
 * @help
 * ============================================================================
 * Система ачивок для RPG Maker MV
 * ============================================================================
 * Управление:
 *   Стрелка вверх/вниз - выбор ачивки
 *   Enter - просмотр описания
 *   ESC - закрыть описание (если открыто) или вернуться в меню
 * ============================================================================
 * 
 * Как разблокировать ачивку в игре:
 *   unlockAchievement(0);  // Разблокировать первую ачивку
 *   isAchievementUnlocked(0); // Проверить
 * 
 * ============================================================================
 * @param achievementCount
 * @text Количество ачивок
 * @desc Сколько ачивок будет в игре (максимум 20)
 * @type number
 * @min 1
 * @max 20
 * @default 6
 * 
 * @param ---Achievements---
 * @default 
 * 
 * @param achievement0Name
 * @text Название ачивки #0
 * @desc Название первой ачивки
 * @default Первые шаги
 * 
 * @param achievement0Desc
 * @text Описание ачивки #0
 * @desc Описание первой ачивки
 * @default Начать игру
 * 
 * @param achievement0Reward
 * @text Награда ачивки #0
 * @desc Награда за выполнение
 * @default 100 золота
 * 
 * @param achievement0IconLocked
 * @text Иконка (не получена) #0
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement0IconUnlocked
 * @text Иконка (получена) #0
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param achievement1Name
 * @text Название ачивки #1
 * @desc Название второй ачивки
 * @default Искатель приключений
 * 
 * @param achievement1Desc
 * @text Описание ачивки #1
 * @desc Описание второй ачивки
 * @default Найти 5 секретов
 * 
 * @param achievement1Reward
 * @text Награда ачивки #1
 * @desc Награда за выполнение
 * @default 50 опыта
 * 
 * @param achievement1IconLocked
 * @text Иконка (не получена) #1
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement1IconUnlocked
 * @text Иконка (получена) #1
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param achievement2Name
 * @text Название ачивки #2
 * @desc Название третьей ачивки
 * @default Мастер меча
 * 
 * @param achievement2Desc
 * @text Описание ачивки #2
 * @desc Описание третьей ачивки
 * @default Победить 10 врагов
 * 
 * @param achievement2Reward
 * @text Награда ачивки #2
 * @desc Награда за выполнение
 * @default 200 золота
 * 
 * @param achievement2IconLocked
 * @text Иконка (не получена) #2
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement2IconUnlocked
 * @text Иконка (получена) #2
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param achievement3Name
 * @text Название ачивки #3
 * @desc Название четвертой ачивки
 * @default Бессмертный
 * 
 * @param achievement3Desc
 * @text Описание ачивки #3
 * @desc Описание четвертой ачивки
 * @default Пройти игру не умирая
 * 
 * @param achievement3Reward
 * @text Награда ачивки #3
 * @desc Награда за выполнение
 * @default 1000 золота
 * 
 * @param achievement3IconLocked
 * @text Иконка (не получена) #3
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement3IconUnlocked
 * @text Иконка (получена) #3
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param achievement4Name
 * @text Название ачивки #4
 * @desc Название пятой ачивки
 * @default Коллекционер
 * 
 * @param achievement4Desc
 * @text Описание ачивки #4
 * @desc Описание пятой ачивки
 * @default Собрать 1000 монет
 * 
 * @param achievement4Reward
 * @text Награда ачивки #4
 * @desc Награда за выполнение
 * @default 500 золота
 * 
 * @param achievement4IconLocked
 * @text Иконка (не получена) #4
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement4IconUnlocked
 * @text Иконка (получена) #4
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param achievement5Name
 * @text Название ачивки #5
 * @desc Название шестой ачивки
 * @default Скоростной бегун
 * 
 * @param achievement5Desc
 * @text Описание ачивки #5
 * @desc Описание шестой ачивки
 * @default Пройти игру за 2 часа
 * 
 * @param achievement5Reward
 * @text Награда ачивки #5
 * @desc Награда за выполнение
 * @default 300 золота
 * 
 * @param achievement5IconLocked
 * @text Иконка (не получена) #5
 * @desc Номер иконки для неполученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 160
 * 
 * @param achievement5IconUnlocked
 * @text Иконка (получена) #5
 * @desc Номер иконки для полученной ачивки
 * @type number
 * @min 0
 * @max 500
 * @default 152
 * 
 * @param ---UI_Settings---
 * @default 
 * 
 * @param menuCommandName
 * @text Название пункта меню
 * @desc Как будет называться пункт в меню
 * @default Ачивки
 * 
 * @param showRewards
 * @text Показывать награды
 * @desc Показывать ли награды в окне ачивок
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 * 
 * @param useLargeIcons
 * @text Крупные иконки
 * @desc Использовать увеличенные иконки в списке
 * @type boolean
 * @on Да
 * @off Нет
 * @default false
 */

(function() {

    // ==========================================================================
    // ЗАГРУЗКА ПАРАМЕТРОВ ПЛАГИНА
    // ==========================================================================
    
    var parameters = PluginManager.parameters('Achievements');
    
    function getParam(name, defaultValue) {
        var value = parameters[name];
        return value !== undefined ? value : defaultValue;
    }
    
    var menuCommandName = getParam('menuCommandName', 'Ачивки');
    var showRewards = getParam('showRewards', 'true') === 'true';
    var useLargeIcons = getParam('useLargeIcons', 'false') === 'true';
    var achievementCount = Number(getParam('achievementCount', 6));
    
    achievementCount = Math.max(1, Math.min(20, achievementCount));
    
    // Функция для переноса текста
    function drawWrappedText(bitmap, text, x, y, maxWidth, lineHeight) {
        var words = text.split('');
        var lines = [];
        var currentLine = '';
        
        for (var i = 0; i < words.length; i++) {
            var testLine = currentLine + words[i];
            var testWidth = bitmap.measureTextWidth(testLine);
            
            if (testWidth > maxWidth && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        for (var i = 0; i < lines.length; i++) {
            bitmap.drawText(lines[i], x, y + (i * lineHeight), maxWidth, lineHeight, 'left');
        }
        
        return lines.length * lineHeight;
    }
    
    // Собираем данные ачивок
    function buildAchievementsData() {
        var achievements = [];
        
        for (var i = 0; i < achievementCount; i++) {
            var name = getParam('achievement' + i + 'Name', 'Ачивка ' + i);
            var desc = getParam('achievement' + i + 'Desc', 'Описание ачивки ' + i);
            var reward = getParam('achievement' + i + 'Reward', '???');
            var iconLocked = Number(getParam('achievement' + i + 'IconLocked', 160));
            var iconUnlocked = Number(getParam('achievement' + i + 'IconUnlocked', 152));
            
            achievements.push({
                id: i,
                name: name,
                description: desc,
                reward: reward,
                unlocked: false,
                iconLocked: iconLocked,
                iconUnlocked: iconUnlocked
            });
        }
        
        return achievements;
    }
    
    // ==========================================================================
    // 1. Добавляем команду в главное меню
    // ==========================================================================
    
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand(menuCommandName, "achievements", true);
    };
    
    // ==========================================================================
    // 2. Создаем сцену для ачивок (КАК В СТАНДАРТНОМ МЕНЮ)
    // ==========================================================================
    
    function Scene_Achievements() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_Achievements.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Achievements.prototype.constructor = Scene_Achievements;
    
    Scene_Achievements.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._detailsWindow = null; // Добавляем переменную для окна деталей
    };
    
    Scene_Achievements.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createAchievementWindow();
    };
    
    Scene_Achievements.prototype.createAchievementWindow = function() {
        this._achievementWindow = new Window_AchievementList(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._achievementWindow.setHandler('ok', this.onAchievementOk.bind(this));
        this._achievementWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._achievementWindow);
        this._achievementWindow.activate();
        this._achievementWindow.select(0);
    };
    
    Scene_Achievements.prototype.onAchievementOk = function() {
        var index = this._achievementWindow.index();
        var achievement = this._achievementWindow.achievementData[index];
        if (achievement) {
            this.showAchievementDetails(achievement);
        }
    };
    
    Scene_Achievements.prototype.showAchievementDetails = function(achievement) {
        this._achievementWindow.deactivate();
        
        // Создаем окно деталей
        this._detailsWindow = new Window_AchievementDetails(achievement);
        this._detailsWindow.x = (Graphics.boxWidth - this._detailsWindow.width) / 2;
        this._detailsWindow.y = (Graphics.boxHeight - this._detailsWindow.height) / 2;
        this.addWindow(this._detailsWindow);
        this._detailsWindow.activate();
        
        // Устанавливаем обработчик закрытия
        this._detailsWindow.setHandler('cancel', this.closeDetails.bind(this));
    };
    
    Scene_Achievements.prototype.closeDetails = function() {
        if (this._detailsWindow) {
            // Сначала удаляем окно из сцены
            this.removeWindow(this._detailsWindow);
            // Очищаем ссылку
            this._detailsWindow = null;
            // Активируем главное окно и обновляем его
            this._achievementWindow.activate();
            this._achievementWindow.refresh();
        }
    };
    
    // ==========================================================================
    // 3. Создаем окно со списком ачивок (Window_Selectable)
    // ==========================================================================
    
    function Window_AchievementList(x, y, width, height) {
        this.initialize.apply(this, arguments);
    }
    
    Window_AchievementList.prototype = Object.create(Window_Selectable.prototype);
    Window_AchievementList.prototype.constructor = Window_AchievementList;
    
    Window_AchievementList.prototype.achievementData = buildAchievementsData();
    
    Window_AchievementList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.select(0);
        this.activate();
    };
    
    Window_AchievementList.prototype.maxItems = function() {
        return this.achievementData.length;
    };
    
    Window_AchievementList.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var data = this.achievementData[index];
        if (!data) return;
        
        var iconIndex = data.unlocked ? data.iconUnlocked : data.iconLocked;
        this.drawIcon(iconIndex, rect.x, rect.y);
        
        this.changePaintOpacity(data.unlocked);
        this.drawText(data.name, rect.x + 40, rect.y, rect.width - 150, 36, 'left');
        this.changePaintOpacity(true);
        
        var statusText = data.unlocked ? "✓ Получено" : "✗ Не получено";
        var statusColor = data.unlocked ? "#6f6" : "#f66";
        this.contents.fontSize = 16;
        this.contents.textColor = statusColor;
        this.drawText(statusText, rect.x + rect.width - 110, rect.y, 100, 36, 'right');
        this.contents.textColor = '#ffffff';
        this.contents.fontSize = 20;
    };
    
    // ==========================================================================
    // 4. Окно с подробным описанием (Window_Base с поддержкой handler)
    // ==========================================================================
    
    function Window_AchievementDetails(achievement) {
        this._achievement = achievement;
        this._handlers = {};
        this.initialize(achievement);
    }
    
    Window_AchievementDetails.prototype = Object.create(Window_Base.prototype);
    Window_AchievementDetails.prototype.constructor = Window_AchievementDetails;
    
    Window_AchievementDetails.prototype.initialize = function(achievement) {
        var width = 480;
        var height = 280;
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.drawContent();
        this.activate();
    };
    
    // Добавляем поддержку setHandler (как в Window_Selectable)
    Window_AchievementDetails.prototype.setHandler = function(symbol, method) {
        this._handlers[symbol] = method;
    };
    
    Window_AchievementDetails.prototype.callHandler = function(symbol) {
        if (this._handlers[symbol]) {
            this._handlers[symbol]();
        }
    };
    
    Window_AchievementDetails.prototype.drawContent = function() {
        this.contents.clear();
        
        // Заголовок
        this.contents.fontSize = 24;
        this.drawText(this._achievement.name, 0, 0, this.width - 32, 'center');
        
        // Разделительная линия
        this.contents.fillRect(0, 32, this.contents.width, 2, '#ffffff');
        
        // Рисуем иконку и рамку
        var iconX = 20;
        var iconY = 50;
        var iconSize = 96;
        
        this.contents.fillRect(iconX, iconY, iconSize, iconSize, '#2a2a2a');
        this.contents.fillRect(iconX, iconY, iconSize, 2, '#ffffff');
        this.contents.fillRect(iconX, iconY + iconSize - 2, iconSize, 2, '#ffffff');
        this.contents.fillRect(iconX, iconY, 2, iconSize, '#ffffff');
        this.contents.fillRect(iconX + iconSize - 2, iconY, 2, iconSize, '#ffffff');
        
        var iconIndex = this._achievement.unlocked ? 
                       this._achievement.iconUnlocked : 
                       this._achievement.iconLocked;
        
        var iconDrawX = iconX + (iconSize - 32) / 2;
        var iconDrawY = iconY + (iconSize - 32) / 2;
        this.drawIcon(iconIndex, iconDrawX, iconDrawY);
        
        // Описание с переносом
        var descX = 140;
        var descY = 60;
        var descMaxWidth = 300;
        var lineHeight = 22;
        
        this.contents.fontSize = 18;
        this.drawText("Описание:", descX, descY, 300, 'left');
        
        this.contents.fontSize = 16;
        var descText = this._achievement.description;
        var wrappedHeight = drawWrappedText(this.contents, descText, descX, descY + 25, descMaxWidth, lineHeight);
        
        var statusY = descY + 30 + Math.min(wrappedHeight, 80);
        this.contents.fontSize = 18;
        var statusText = this._achievement.unlocked ? "СТАТУС: ПОЛУЧЕНО ★" : "СТАТУС: НЕ ПОЛУЧЕНО ☆";
        var statusColor = this._achievement.unlocked ? "#6f6" : "#f66";
        this.contents.textColor = statusColor;
        this.drawText(statusText, descX, statusY, 300, 'left');
        this.contents.textColor = '#ffffff';
        
        if (showRewards) {
            var rewardY = statusY + 35;
            this.contents.fontSize = 16;
            this.drawText("Награда:", descX, rewardY, 100, 'left');
            var reward = this._achievement.unlocked ? this._achievement.reward : "???";
            this.drawText(reward, descX + 100, rewardY, 200, 'left');
        }
    };
    
    // Обработка нажатий (исправленная версия)
    Window_AchievementDetails.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        if (this.active && this.visible) {
            if (Input.isTriggered('cancel') || Input.isTriggered('ok')) {
                this.callHandler('cancel');
            }
        }
    };
    
    // ==========================================================================
    // 5. Добавляем обработчик команды в меню
    // ==========================================================================
    
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('achievements', this.commandAchievements.bind(this));
    };
    
    Scene_Menu.prototype.commandAchievements = function() {
        SceneManager.push(Scene_Achievements);
    };
    
    // ==========================================================================
    // 6. Работа с сохранением/загрузкой
    // ==========================================================================
    
    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents.call(this);
        var achievementsStatus = [];
        var data = Window_AchievementList.prototype.achievementData;
        for (var i = 0; i < data.length; i++) {
            achievementsStatus.push(data[i].unlocked);
        }
        contents.achievementsStatus = achievementsStatus;
        return contents;
    };
    
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.achievementsStatus) {
            var data = Window_AchievementList.prototype.achievementData;
            for (var i = 0; i < contents.achievementsStatus.length && i < data.length; i++) {
                data[i].unlocked = contents.achievementsStatus[i];
            }
        }
    };
    
    // ==========================================================================
    // 7. Функции для разблокировки ачивок
    // ==========================================================================
    
    window.unlockAchievement = function(id) {
        var data = Window_AchievementList.prototype.achievementData;
        if (data[id] && !data[id].unlocked) {
            data[id].unlocked = true;
            var name = data[id].name;
            var reward = data[id].reward;
            
            $gameMessage.add("\\c[6]★ Достижение разблокировано! ★\\c[0]");
            $gameMessage.add("\\c[2]" + name + "\\c[0]");
            
            if (showRewards && reward !== "???") {
                $gameMessage.add("\\c[0]Награда: " + reward);
            }
        }
    };
    
    window.isAchievementUnlocked = function(id) {
        var data = Window_AchievementList.prototype.achievementData;
        return data[id] && data[id].unlocked;
    };
    
    window.getAchievementIcon = function(id, unlocked) {
        var data = Window_AchievementList.prototype.achievementData;
        if (data[id]) {
            return unlocked ? data[id].iconUnlocked : data[id].iconLocked;
        }
        return unlocked ? 152 : 160;
    };
    
})();