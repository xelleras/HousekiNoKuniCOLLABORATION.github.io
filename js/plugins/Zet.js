/*:
 * @plugindesc v1.0 Interaction Hint - показывает подсказку при взаимодействии
 * @author YourName
 * @help
 * ============================================================================
 * Плагин показывает подсказку "Нажмите Z" или свою картинку, когда игрок
 * может взаимодействовать с объектом (событием).
 * ============================================================================
 * 
 * Как использовать:
 *   1. Настройте плагин через параметры
 *   2. Подсказка будет автоматически появляться, когда игрок стоит рядом с
 *      событием, у которого есть команда в списке или комментарий 'interact'
 * 
 * Маркеры для событий:
 *   - Добавьте в событие комментарий: <interact>
 *   - Или просто наличие любой команды в содержимом события
 * 
 * ============================================================================
 * @param --- Основные настройки ---
 * @default
 * 
 * @param hintType
 * @text Тип подсказки
 * @desc image - картинка, text - текст, both - и то и другое
 * @type combo
 * @option image
 * @option text
 * @option both
 * @default text
 * 
 * @param hintText
 * @text Текст подсказки
 * @desc Текст, который будет отображаться (для типа text или both)
 * @default Нажмите Z
 * 
 * @param textSize
 * @text Размер текста
 * @type number
 * @min 10
 * @max 60
 * @default 24
 * 
 * @param textColor
 * @text Цвет текста
 * @desc Используйте стандартные цвета RPG Maker или hex (например, #ffcc00)
 * @default #ffffff
 * 
 * @param textOutline
 * @text Обводка текста
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 * 
 * @param textOutlineColor
 * @text Цвет обводки
 * @default #000000
 * 
 * @param --- Настройки картинки ---
 * @default
 * 
 * @param hintImage
 * @text Изображение подсказки
 * @desc Имя файла в папке /img/pictures/
 * @default pressZ.png
 * 
 * @param imageWidth
 * @text Ширина изображения
 * @desc 0 = использовать оригинальную ширину
 * @type number
 * @min 0
 * @max 500
 * @default 0
 * 
 * @param imageHeight
 * @text Высота изображения
 * @desc 0 = использовать оригинальную высоту
 * @type number
 * @min 0
 * @max 500
 * @default 0
 * 
 * @param --- Настройки позиции ---
 * @default
 * 
 * @param anchorX
 * @text Позиция X (%)
 * @desc 0 = левый край, 50 = центр, 100 = правый край
 * @type number
 * @min 0
 * @max 100
 * @default 50
 * 
 * @param anchorY
 * @text Позиция Y (%)
 * @desc 0 = верх, 50 = центр, 100 = низ
 * @type number
 * @min 0
 * @max 100
 * @default 85
 * 
 * @param offsetX
 * @text Смещение X (пиксели)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param offsetY
 * @text Смещение Y (пиксели)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param --- Анимация ---
 * @default
 * 
 * @param enableAnimation
 * @text Анимация появления
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 * 
 * @param animationSpeed
 * @text Скорость анимации
 * @type number
 * @min 1
 * @max 30
 * @default 5
 * 
 * @param --- Дополнительно ---
 * @default
 * 
 * @param showOnlyOnEmpty
 * @text Показывать только на пустых событиях
 * @desc true = показывать только если у события нет команд
 * @type boolean
 * @on Да
 * @off Нет
 * @default false
 * 
 * @param checkDistance
 * @text Дистанция проверки (клетки)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 */

(function() {

    // ==========================================================================
    // ЗАГРУЗКА ПАРАМЕТРОВ
    // ==========================================================================
    
    var parameters = PluginManager.parameters('RL_InteractionHint');
    
    function getParam(name, defaultValue) {
        var value = parameters[name];
        return value !== undefined ? value : defaultValue;
    }
    
    // Основные настройки
    var hintType = getParam('hintType', 'text');
    var hintText = getParam('hintText', 'Нажмите Z');
    var textSize = Number(getParam('textSize', 24));
    var textColor = getParam('textColor', '#ffffff');
    var textOutline = getParam('textOutline', 'true') === 'true';
    var textOutlineColor = getParam('textOutlineColor', '#000000');
    
    // Настройки картинки
    var hintImage = getParam('hintImage', 'pressZ.png');
    var imageWidth = Number(getParam('imageWidth', 0));
    var imageHeight = Number(getParam('imageHeight', 0));
    
    // Позиция
    var anchorX = Number(getParam('anchorX', 50));
    var anchorY = Number(getParam('anchorY', 85));
    var offsetX = Number(getParam('offsetX', 0));
    var offsetY = Number(getParam('offsetY', 0));
    
    // Анимация
    var enableAnimation = getParam('enableAnimation', 'true') === 'true';
    var animationSpeed = Number(getParam('animationSpeed', 5));
    
    // Дополнительно
    var showOnlyOnEmpty = getParam('showOnlyOnEmpty', 'false') === 'true';
    var checkDistance = Number(getParam('checkDistance', 1));
    
    // ==========================================================================
    // ЗАГРУЗКА ИЗОБРАЖЕНИЙ
    // ==========================================================================
    
    ImageManager.loadHintImage = function(filename) {
        return this.loadBitmap('img/pictures/', filename, 0, true);
    };
    
    // ==========================================================================
    // ОКОННЫЙ СПРАЙТ ДЛЯ ПОДСКАЗКИ
    // ==========================================================================
    
    function Sprite_InteractionHint() {
        this.initialize.apply(this, arguments);
    }
    
    Sprite_InteractionHint.prototype = Object.create(Sprite.prototype);
    Sprite_InteractionHint.prototype.constructor = Sprite_InteractionHint;
    
    Sprite_InteractionHint.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._visibleTimer = 0;
        this._animationFrame = 0;
        this._animationDir = 1;
        this._currentOpacity = 0;
        this.createBitmap();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.opacity = 0;
        this.visible = false;
        
        // Обновляем позицию
        this.updatePosition();
    };
    
    Sprite_InteractionHint.prototype.createBitmap = function() {
        if (hintType === 'image' || hintType === 'both') {
            this._imageBitmap = ImageManager.loadHintImage(hintImage);
            if (imageWidth > 0 && imageHeight > 0) {
                this.bitmap = new Bitmap(imageWidth, imageHeight);
                // Масштабируем изображение
                var scaleX = imageWidth / this._imageBitmap.width;
                var scaleY = imageHeight / this._imageBitmap.height;
                this.bitmap.blt(this._imageBitmap, 0, 0, this._imageBitmap.width, this._imageBitmap.height, 0, 0, imageWidth, imageHeight);
            } else {
                this.bitmap = this._imageBitmap;
            }
        }
        
        if (hintType === 'text' || hintType === 'both') {
            this._textBitmap = new Bitmap(Graphics.boxWidth, textSize + 20);
            this._textBitmap.fontSize = textSize;
            this._textBitmap.textColor = textColor;
            if (textOutline) {
                this._textBitmap.outlineColor = textOutlineColor;
                this._textBitmap.outlineWidth = 3;
            }
            this._textBitmap.drawText(hintText, 0, 0, Graphics.boxWidth, textSize + 20, 'center');
            
            if (hintType === 'both') {
                // Комбинируем изображение и текст
                var combinedWidth = Math.max(this.bitmap ? this.bitmap.width : 0, this._textBitmap.width);
                var combinedHeight = (this.bitmap ? this.bitmap.height : 0) + (this._textBitmap.height) + 10;
                var combinedBitmap = new Bitmap(combinedWidth, combinedHeight);
                
                if (this.bitmap) {
                    combinedBitmap.blt(this.bitmap, 0, 0, this.bitmap.width, this.bitmap.height, 
                                       (combinedWidth - this.bitmap.width) / 2, 0);
                }
                combinedBitmap.blt(this._textBitmap, 0, 0, this._textBitmap.width, this._textBitmap.height,
                                   (combinedWidth - this._textBitmap.width) / 2, this.bitmap ? this.bitmap.height + 10 : 0);
                
                this.bitmap = combinedBitmap;
                this._textBitmap = null;
            } else {
                this.bitmap = this._textBitmap;
            }
        }
    };
    
    Sprite_InteractionHint.prototype.updatePosition = function() {
        var x = Graphics.boxWidth * anchorX / 100 + offsetX;
        var y = Graphics.boxHeight * anchorY / 100 + offsetY;
        this.x = x;
        this.y = y;
    };
    
    Sprite_InteractionHint.prototype.show = function() {
        if (this.visible) return;
        this.visible = true;
        this._visibleTimer = 0;
        if (enableAnimation) {
            this._currentOpacity = 0;
            this.opacity = 0;
        } else {
            this.opacity = 255;
        }
    };
    
    Sprite_InteractionHint.prototype.hide = function() {
        if (!this.visible) return;
        this.visible = false;
        if (enableAnimation) {
            this._currentOpacity = 0;
            this.opacity = 0;
        }
    };
    
    Sprite_InteractionHint.prototype.update = function() {
        Sprite.prototype.update.call(this);
        
        if (!this.visible) return;
        
        if (enableAnimation) {
            // Анимация появления
            if (this._currentOpacity < 255) {
                this._currentOpacity = Math.min(this._currentOpacity + animationSpeed * 3, 255);
                this.opacity = this._currentOpacity;
            }
            
            // Анимация покачивания
            this._animationFrame += 0.1 * this._animationDir;
            if (this._animationFrame >= 1) {
                this._animationFrame = 1;
                this._animationDir = -1;
            } else if (this._animationFrame <= -1) {
                this._animationFrame = -1;
                this._animationDir = 1;
            }
            this.y = (Graphics.boxHeight * anchorY / 100 + offsetY) + Math.sin(this._animationFrame) * 5;
        }
    };
    
    // ==========================================================================
    // ОСНОВНАЯ СЦЕНА (добавляем спрайт)
    // ==========================================================================
    
    var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        this._hintSprite = new Sprite_InteractionHint();
        this.addChild(this._hintSprite);
    };
    
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateInteractionHint();
    };
    
    Scene_Map.prototype.updateInteractionHint = function() {
        if (!this._hintSprite) return;
        
        var canInteract = this.checkPlayerInteraction();
        
        if (canInteract) {
            this._hintSprite.show();
        } else {
            this._hintSprite.hide();
        }
        this._hintSprite.update();
    };
    
    // Проверка, может ли игрок взаимодействовать с объектом
    Scene_Map.prototype.checkPlayerInteraction = function() {
        var player = $gamePlayer;
        var x = player.x;
        var y = player.y;
        
        // Проверяем все направления
        var directions = [[0, 0]]; // текущая позиция
        
        // Добавляем соседние клетки в зависимости от дистанции
        for (var dx = -checkDistance; dx <= checkDistance; dx++) {
            for (var dy = -checkDistance; dy <= checkDistance; dy++) {
                if (Math.abs(dx) + Math.abs(dy) <= checkDistance) {
                    directions.push([dx, dy]);
                }
            }
        }
        
        for (var i = 0; i < directions.length; i++) {
            var checkX = x + directions[i][0];
            var checkY = y + directions[i][1];
            var event = $gameMap.eventIdXy(checkX, checkY);
            
            if (event > 0) {
                var eventObj = $gameMap.event(event);
                if (this.eventHasInteraction(eventObj)) {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    // Проверка, есть ли у события взаимодействие
    Scene_Map.prototype.eventHasInteraction = function(event) {
        if (!event || !event._erased) {
            var page = event.page();
            if (page && page.list && page.list.length > 0) {
                // Проверяем наличие команд в событии
                var hasCommands = false;
                for (var i = 0; i < page.list.length; i++) {
                    var code = page.list[i].code;
                    // Команды, которые требуют взаимодействия
                    if (code === 101 || // Показать текст
                        code === 102 || // Показать выбор
                        code === 103 || // Ввод числа
                        code === 104 || // Выбор предмета
                        code === 105 || // Ввод текста
                        code === 111 || // Условная ветка (может быть пустой)
                        code === 123 || // Цикл
                        code === 125 || // Изменить золото
                        code === 126 || // Изменить предмет
                        code === 128 || // Изменить оружие
                        code === 129 || // Изменить броню
                        code === 201 || // Телепорт
                        code === 205 || // Перемещение
                        code === 230 || // Ожидание
                        code === 231 || // Показать картинку
                        code === 235 || // Сменить спрайт
                        code === 241 || // Воспроизвести BGM
                        code === 250 || // Воспроизвести SE
                        code === 301 || // Сражение
                        code === 302 || // Обработка поражения
                        code === 311 || // Изменить HP
                        code === 312 || // Изменить MP
                        code === 313 || // Изменить состояние
                        code === 314 || // Удалить состояние
                        code === 315 || // Изменить уровень
                        code === 316 || // Изменить опыт
                        code === 317 || // Изменить параметры
                        code === 318 || // Изменить навыки
                        code === 319 || // Изменить экипировку
                        code === 320 || // Изменить имя
                        code === 321 || // Изменить класс
                        code === 322 || // Изменить актёра
                        code === 331 || // Изменить изображение врага
                        code === 332 || // Показать анимацию
                        code === 337) { // Начать диалог
                        hasCommands = true;
                        break;
                    }
                }
                
                if (showOnlyOnEmpty) {
                    // Показываем только на событиях без команд
                    return !hasCommands;
                } else {
                    // Показываем если есть команды ИЛИ есть комментарий <interact>
                    if (hasCommands) return true;
                    
                    // Проверяем комментарий <interact>
                    if (page.list) {
                        for (var j = 0; j < page.list.length; j++) {
                            if (page.list[j].code === 108 || page.list[j].code === 408) {
                                var comment = page.list[j].parameters[0];
                                if (comment && comment.contains('<interact>')) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    
    // Вспомогательный метод для получения ID события по координатам
    Game_Map.prototype.eventIdXy = function(x, y) {
        var events = this.events();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (event && event.pos(x, y) && !event.isTransparent() && !event._erased) {
                return event.eventId();
            }
        }
        return 0;
    };
    
    console.log('RL_InteractionHint плагин загружен!');
    
})();