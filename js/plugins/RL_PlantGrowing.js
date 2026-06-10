/*:
 * @plugindesc Плагин выращивания растений в реальном времени v1.3.0
 * @author YourName
 * @help
 * ============================================================================
 * Plant Growing System - Система выращивания растений
 * ============================================================================
 * 
 * Команды плагина:
 * Plant add [plantType] - Посадить растение на позиции игрока
 * Plant harvest - Собрать урожай с растения на позиции игрока
 * Plant clear - Очистить все растения на карте (для отладки)
 * 
 * ============================================================================
 * 
 * @param DefaultPlants
 * @desc JSON с типами растений
 * @default [{"name":"Морковь","stages":4,"growthTime":60,"harvestItem":1,"harvestAmount":1,"spritePrefix":"carrot"}]
 * 
 * @param ShowTimer
 * @desc Показывать таймер (true/false)
 * @default true
 * 
 * @param TimerSize
 * @desc Размер шрифта таймера
 * @default 16
 * 
 * @param TimerColor
 * @desc Цвет таймера
 * @default #ffffff
 */

(function() {
    'use strict';

    var parameters = PluginManager.parameters('PlantGrowing');
    var defaultPlants = JSON.parse(parameters['DefaultPlants'] || '[{"name":"Морковь","stages":4,"growthTime":60,"harvestItem":1,"harvestAmount":1,"spritePrefix":"carrot"}]');
    var showTimer = parameters['ShowTimer'] !== 'false';
    var timerSize = Number(parameters['TimerSize'] || 16);
    var timerColor = parameters['TimerColor'] || '#ffffff';

    // Хранилище растений
    var plants = {};
    var plantSprites = [];

    // Инициализация
    function initStorage() {
        try {
            var saved = localStorage.getItem('plantGrowingData');
            if (saved) {
                plants = JSON.parse(saved);
                console.log('Loaded plants:', Object.keys(plants).length);
            }
        } catch(e) {
            console.error('Load error:', e);
            plants = {};
        }
    }

    function saveData() {
        try {
            localStorage.setItem('plantGrowingData', JSON.stringify(plants));
        } catch(e) {
            console.error('Save error:', e);
        }
    }

    function getPlantType(name) {
        for (var i = 0; i < defaultPlants.length; i++) {
            if (defaultPlants[i].name.toLowerCase() === name.toLowerCase()) {
                return defaultPlants[i];
            }
        }
        return null;
    }

    function getKey(mapId, x, y) {
        return mapId + '_' + x + '_' + y;
    }

    function getGrowthStage(plant) {
        var elapsed = Date.now() - plant.plantTime;
        var progress = Math.min(elapsed / plant.growthTime, 1.0);
        var type = getPlantType(plant.type);
        if (!type) return 0;
        return Math.min(Math.floor(progress * type.stages), type.stages - 1);
    }

    function getRemainingTime(plant) {
        return Math.max(0, Math.ceil((plant.growthTime - (Date.now() - plant.plantTime)) / 1000));
    }

    function formatTime(seconds) {
        if (seconds <= 0) return '✓';
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = seconds % 60;
        if (h > 0) return h + 'ч ' + m + 'м';
        if (m > 0) return m + 'м ' + s + 'с';
        return s + 'с';
    }

    // Очистка всех спрайтов
    function clearAllSprites() {
        for (var i = plantSprites.length - 1; i >= 0; i--) {
            var sprite = plantSprites[i];
            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
        }
        plantSprites = [];
    }

    // Создание спрайта растения
    function createPlantSprite(plant, key) {
        var type = getPlantType(plant.type);
        if (!type) return null;
        
        var stage = getGrowthStage(plant);
        var prefix = type.spritePrefix || type.name.toLowerCase();
        var filename = prefix + '_stage' + stage;
        
        var bitmap = ImageManager.loadPicture(filename);
        var sprite = new Sprite(bitmap);
        
        // Позиция в пикселях (1 тайл = 48 пикселей)
        sprite.x = plant.x * 48 + 24;
        sprite.y = plant.y * 48 + 24;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite._plantKey = key;
        
        return sprite;
    }

    // Создание таймера
    function createTimerSprite(plant, key) {
        var remaining = getRemainingTime(plant);
        var text = formatTime(remaining);
        
        var bitmap = new Bitmap(80, 24);
        bitmap.fontSize = timerSize;
        bitmap.textColor = timerColor;
        bitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';
        bitmap.outlineWidth = 2;
        bitmap.drawText(text, 0, 0, 80, 24, 'center');
        
        var sprite = new Sprite(bitmap);
        sprite.x = plant.x * 48 + 24 - 40;
        sprite.y = plant.y * 48 - 20;
        sprite._plantKey = key;
        sprite._isTimer = true;
        
        return sprite;
    }

    // Обновление всех спрайтов на карте
    function refreshMapSprites() {
        clearAllSprites();
        
        var mapId = $gameMap.mapId();
        var scene = SceneManager._scene;
        if (!scene) return;
        
        // Ищем или создаем контейнер для растений
        var container = scene.getChildByName('plantContainer');
        if (!container) {
            container = new Sprite();
            container.name = 'plantContainer';
            scene.addChild(container);
        }
        
        var count = 0;
        for (var key in plants) {
            var plant = plants[key];
            if (plant.mapId === mapId) {
                var plantSprite = createPlantSprite(plant, key);
                if (plantSprite) {
                    container.addChild(plantSprite);
                    plantSprites.push(plantSprite);
                    
                    if (showTimer) {
                        var timerSprite = createTimerSprite(plant, key);
                        container.addChild(timerSprite);
                        plantSprites.push(timerSprite);
                    }
                    count++;
                }
            }
        }
        
        console.log('Showed ' + count + ' plants on map ' + mapId);
    }

    // Обновление таймеров
    function updateTimers() {
        var mapId = $gameMap.mapId();
        
        for (var i = 0; i < plantSprites.length; i++) {
            var sprite = plantSprites[i];
            if (sprite._isTimer) {
                var plant = plants[sprite._plantKey];
                if (plant && plant.mapId === mapId) {
                    var remaining = getRemainingTime(plant);
                    var text = formatTime(remaining);
                    
                    var bitmap = new Bitmap(80, 24);
                    bitmap.fontSize = timerSize;
                    bitmap.textColor = timerColor;
                    bitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';
                    bitmap.outlineWidth = 2;
                    bitmap.drawText(text, 0, 0, 80, 24, 'center');
                    
                    sprite.bitmap = bitmap;
                }
            }
        }
        
        // Проверяем смену стадий
        checkStageChanges();
    }

    // Проверка смены стадий
    function checkStageChanges() {
        var mapId = $gameMap.mapId();
        var changed = false;
        
        for (var key in plants) {
            var plant = plants[key];
            if (plant.mapId === mapId) {
                var newStage = getGrowthStage(plant);
                if (plant.stage !== newStage) {
                    plant.stage = newStage;
                    changed = true;
                }
            }
        }
        
        if (changed) {
            saveData();
            refreshMapSprites();
        }
    }

    // Добавление растения
    function addPlant(typeName, mapId, x, y) {
        var key = getKey(mapId, x, y);
        
        if (plants[key]) {
            console.warn('Plant already exists at', x, y);
            return false;
        }
        
        var type = getPlantType(typeName);
        if (!type) {
            console.error('Unknown plant:', typeName);
            return false;
        }
        
        plants[key] = {
            type: typeName,
            mapId: mapId,
            x: x,
            y: y,
            plantTime: Date.now(),
            growthTime: type.growthTime * 1000,
            stage: 0
        };
        
        console.log('Plant added at', x, y, 'on map', mapId);
        saveData();
        refreshMapSprites();
        
        return true;
    }

    // Сбор урожая
    function harvestPlant(mapId, x, y) {
        var key = getKey(mapId, x, y);
        var plant = plants[key];
        
        if (!plant) {
            console.log('No plant at', x, y);
            return false;
        }
        
        var type = getPlantType(plant.type);
        if (!type) return false;
        
        var stage = getGrowthStage(plant);
        
        if (stage >= type.stages - 1) {
            var item = $dataItems[type.harvestItem];
            if (item) {
                $gameParty.gainItem(item, type.harvestAmount);
                console.log('Harvested:', item.name, 'x' + type.harvestAmount);
            }
            
            delete plants[key];
            saveData();
            refreshMapSprites();
            
            return true;
        } else {
            console.log('Not ready. Stage:', stage + 1, '/', type.stages);
            return false;
        }
    }

    // Инициализация
    initStorage();

    // Команды плагина
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'Plant') {
            var action = args[0];
            var plantType = args[1];
            var x = $gamePlayer.x;
            var y = $gamePlayer.y;
            var mapId = $gameMap.mapId();
            
            switch (action) {
                case 'add':
                    if (plantType) addPlant(plantType, mapId, x, y);
                    break;
                case 'harvest':
                    harvestPlant(mapId, x, y);
                    break;
                case 'clear':
                    // Очистка всех растений на карте (для отладки)
                    for (var key in plants) {
                        if (plants[key].mapId === mapId) {
                            delete plants[key];
                        }
                    }
                    saveData();
                    refreshMapSprites();
                    console.log('All plants cleared from map', mapId);
                    break;
            }
        }
    };

    // Загрузка карты
    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        setTimeout(refreshMapSprites, 200);
    };

    // Обновление
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (Graphics.frameCount % 60 === 0) {
            updateTimers();
        }
    };

    // Очистка при смене карты
    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        clearAllSprites();
        
        // Удаляем контейнер
        var scene = SceneManager._scene;
        if (scene) {
            var container = scene.getChildByName('plantContainer');
            if (container) {
                scene.removeChild(container);
            }
        }
        
        _Scene_Map_terminate.call(this);
    };

})();