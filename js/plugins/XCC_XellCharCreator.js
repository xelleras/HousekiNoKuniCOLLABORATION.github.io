/*:
 * @plugindesc v1.04 Character Creator EX с поддержкой 6 кадров анимации
 * @author SumRndmDde (модифицировано)
 *
 * @param --- Основные настройки ---
 * @default
 *
 * @param Use Six Frames
 * @text Использовать 6 кадров
 * @desc Включить поддержку 6 кадров анимации вместо 3
 * @type boolean
 * @on Да
 * @off Нет
 * @default false
 *
 * @param Character Width
 * @text Ширина персонажа
 * @desc Ширина одного кадра спрайта персонажа в пикселях
 * @type number
 * @min 32
 * @max 512
 * @default 48
 *
 * @param Character Height
 * @text Высота персонажа
 * @desc Высота одного кадра спрайта персонажа в пикселях
 * @type number
 * @min 32
 * @max 512
 * @default 48
 *
 * @param SV Char Width
 * @text Ширина SV персонажа
 * @desc Ширина одного кадра бокового бойца в пикселях
 * @type number
 * @min 32
 * @max 512
 * @default 64
 *
 * @param SV Char Height
 * @text Высота SV персонажа
 * @desc Высота одного кадра бокового бойца в пикселях
 * @type number
 * @min 32
 * @max 512
 * @default 64
 *
 * @param Face Width
 * @text Ширина лица
 * @desc Ширина изображения лица в пикселях
 * @type number
 * @min 32
 * @max 256
 * @default 144
 *
 * @param Face Height
 * @text Высота лица
 * @desc Высота изображения лица в пикселях
 * @type number
 * @min 32
 * @max 256
 * @default 144
 *
 * @param --- Настройки интерфейса ---
 * @default
 *
 * @param Layers
 * @text Слои (Layers)
 * @desc Порядок отрисовки слоев персонажа через запятую
 * @type text
 * @default Body,Rear Hair,Tail,Wing,Clothing,Front Hair,Eyebrows,Nose,Mouth,Eyes,Accessory A,Accessory B,Glasses,Beast Ears
 *
 * @param Order
 * @text Порядок в меню
 * @desc Порядок отображения элементов в меню редактора через запятую
 * @type text
 * @default Body,Clothing,Rear Hair,Front Hair,Tail,Wing,Eyebrows,Nose,Mouth,Eyes,Accessory A,Accessory B,Glasses,Beast Ears
 *
 * @param Mandatory
 * @text Обязательные слои
 * @desc Слои которые должны быть выбраны перед выходом через запятую
 * @type text
 * @default Body
 *
 * @param Mandatory Color
 * @text Цвет обязательных
 * @desc Цвет для выделения обязательных слотов (CSS цвет)
 * @type text
 * @default #ff4444
 *
 * @param Small Piece Cols
 * @text Колонок маленьких
 * @desc Количество колонок для маленьких элементов
 * @type number
 * @min 1
 * @max 12
 * @default 6
 *
 * @param Big Piece Cols
 * @text Колонок больших
 * @desc Количество колонок для больших элементов
 * @type number
 * @min 1
 * @max 12
 * @default 3
 *
 * @param --- Настройки сцены ---
 * @default
 *
 * @param Use Fade Transition
 * @text Использовать затемнение
 * @desc Использовать плавное затемнение при переходе
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 *
 * @param Use Piece Background
 * @text Фон элементов
 * @desc Показывать фон для элементов в списке
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 *
 * @param Use Scene Background
 * @text Фон сцены
 * @desc Использовать фоновое изображение сцены
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 *
 * @param Background X Scroll
 * @text Скорость фона X
 * @desc Скорость прокрутки фона по горизонтали
 * @type number
 * @min -10
 * @max 10
 * @default 0
 *
 * @param Background Y Scroll
 * @text Скорость фона Y
 * @desc Скорость прокрутки фона по вертикали
 * @type number
 * @min -10
 * @max 10
 * @default 0
 *
 * @param --- Текстовые настройки ---
 * @default
 *
 * @param Yes Text
 * @text Текст "Да"
 * @desc Текст на кнопке подтверждения
 * @type text
 * @default Yes
 *
 * @param No Text
 * @text Текст "Нет"
 * @desc Текст на кнопке отмены
 * @type text
 * @default No
 *
 * @param Leave Dialogue
 * @text Диалог выхода
 * @desc Текст при попытке выхода из редактора (\\n для переноса строки)
 * @type multiline_text
 * @default Are you sure you want to leave?
 *
 * @param Mandatory Dialogue
 * @text Диалог обязательных
 * @desc Текст при попытке выхода без выбора обязательных слотов
 * @type multiline_text
 * @default You must select an option for all the highlighted categories before leaving!
 *
 * @param --- Дополнительные настройки ---
 * @default
 *
 * @param Color Mouse/Touch Input
 * @text Цветной ввод
 * @desc Использовать мышь/касание для выбора цвета
 * @type boolean
 * @on Да
 * @off Нет
 * @default true
 *
 * @param Print to Console
 * @text Вывод в консоль
 * @desc Выводить данные кастомизации в консоль при сохранении
 * @type boolean
 * @on Да
 * @off Нет
 * @default false
 *
 * @param Custom Character Folder
 * @text Папка с ресурсами
 * @desc Путь к папке с ресурсами относительно img/
 * @type text
 * @default SumRndmDde/character-creator-ex/
 *
 * @param Animation Speed
 * @text Скорость анимации
 * @desc Задержка между кадрами анимации (меньше = быстрее)
 * @type number
 * @min 5
 * @max 30
 * @default 10
 *
 * @help
 * ============================================================================
 * Character Creator EX с поддержкой 6 кадров
 * ============================================================================
 * 
 * Этот плагин позволяет создавать кастомизируемых персонажей.
 * 
 * ОСОБЕННОСТИ:
 * - Поддержка 3 или 6 кадров анимации
 * - Высокое разрешение спрайтов
 * - Выбор цветов для элементов
 * - Сохранение кастомизации
 * 
 * СТРУКТУРА ФАЙЛОВ:
 * Папка: img/SumRndmDde/character-creator-ex/
 * ├── Body/
 * │   ├── walk/
 * │   │   ├── body1.png (спрайт-лист)
 * │   │   └── body2.png
 * │   ├── dead/
 * │   ├── face/
 * │   └── sv/
 * ├── Hair/
 * │   └── ...
 * └── ...
 * 
 * ФОРМАТ СПРАЙТ-ЛИСТА:
 * - 3 кадра: ширина = Character Width × 3, высота = Character Height × 4
 * - 6 кадров: ширина = Character Width × 6, высота = Character Height × 4
 * 
 * КОМАНДЫ ПЛАГИНА:
 * OpenCharacterCreator ActorId - открыть редактор
 * DisableCharacterCreatorImages ActorId - отключить кастомный спрайт
 * EnableCharacterCreatorImages ActorId - включить кастомный спрайт
 * 
 * В ЗАМЕТКАХ СОБЫТИЙ:
 * <CustomCharacter: ActorId> - показать кастомного персонажа
 */

var SRD = SRD || {};
SRD.CharacterCreatorEX = SRD.CharacterCreatorEX || {};

var Imported = Imported || {};
Imported["SumRndmDde Character Creator EX"] = 1.04;

var $gameCharacterCreations = null;

function Scene_CharacterCreator() {
    this.initialize.apply(this, arguments);
}

function Window_CharacterCreator_FileList() {
    this.initialize.apply(this, arguments);
}

function Window_CharacterCreator_FolderList() {
    this.initialize.apply(this, arguments);
}

function Window_CharacterCreator_Preview() {
    this.initialize.apply(this, arguments);
}

function Game_CharacterCreations() {
    this.initialize.apply(this, arguments);
}

function Sprite_DisplayCharacter() {
    this.initialize.apply(this, arguments);
}

function Sprite_DisplayDeadCharacter() {
    this.initialize.apply(this, arguments);
}

function Sprite_DisplayBlankCharacter() {
    this.initialize.apply(this, arguments);
}

function Sprite_DisplaySvCharacter() {
    this.initialize.apply(this, arguments);
}

function Window_HueSelector() {
    this.initialize.apply(this, arguments);
}

function Window_CharacterCreatorConfirmation() {
    this.initialize.apply(this, arguments);
}

(function(_) {

"use strict";

_.alertNeedSuperToolsEngine = function() {
    alert("Требуется плагин 'SRD_SuperToolsEngine' для работы 'SRD_CharacterCreatorEX'.");
    if(confirm("Открыть страницу загрузки 'SRD_SuperToolsEngine'?")) {
        window.open('http://sumrndm.site/super-tools-engine/');
    }
};

if(!Imported["SumRndmDde Super Tools Engine"]) {
    _.alertNeedSuperToolsEngine();
    return;
}

_.alertGetRidOfCharacterCreator = function() {
    alert("Удалите плагин 'SRD_CharacterCreator' для использования 'SRD_CharacterCreatorEX'!");
};

if(Imported["SumRndmDde Character Creator"]) {
    _.alertGetRidOfCharacterCreator();
    return;
}

//-----------------------------------------------------------------------------
// ЗАГРУЗКА ПАРАМЕТРОВ
//-----------------------------------------------------------------------------

const params = PluginManager.parameters('SRD_CharacterCreatorEX');

// Функция для безопасного получения параметров
function getParam(name, defaultValue) {
    var value = params[name];
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }
    return value;
}

function getParamBool(name, defaultValue) {
    var value = getParam(name, defaultValue ? 'true' : 'false');
    return value.trim().toLowerCase() === 'true';
}

function getParamInt(name, defaultValue) {
    return parseInt(getParam(name, defaultValue));
}

function getParamStr(name, defaultValue) {
    return String(getParam(name, defaultValue));
}

// Основные настройки
_.useSixFrames = getParamBool('Use Six Frames', false);
_.framesCount = _.useSixFrames ? 6 : 3;
_.width = getParamInt('Character Width', 48);
_.height = getParamInt('Character Height', 48);
_.fileWidth = _.width * _.framesCount;
_.fileHeight = _.height * 4;

_.svWidth = getParamInt('SV Char Width', 64);
_.svHeight = getParamInt('SV Char Height', 64);
_.svFileWidth = _.svWidth * (_.useSixFrames ? 18 : 9);
_.svFileHeight = _.svHeight * 6;

_.faceFileWidth = getParamInt('Face Width', 144);
_.faceFileHeight = getParamInt('Face Height', 144);

// Настройки интерфейса
_.priorities = getParamStr('Layers', 'Body,Rear Hair,Tail,Wing,Clothing,Front Hair,Eyebrows,Nose,Mouth,Eyes,Accessory A,Accessory B,Glasses,Beast Ears').split(/\s*,\s*/);
_.order = getParamStr('Order', 'Body,Clothing,Rear Hair,Front Hair,Tail,Wing,Eyebrows,Nose,Mouth,Eyes,Accessory A,Accessory B,Glasses,Beast Ears').split(/\s*,\s*/);
_.mandatory = getParamStr('Mandatory', 'Body').split(/\s*,\s*/);
_.mandatoryColor = getParamStr('Mandatory Color', '#ff4444');
_.smallCols = getParamInt('Small Piece Cols', 6);
_.bigCols = getParamInt('Big Piece Cols', 3);

// Настройки сцены
_.fade = getParamBool('Use Fade Transition', true);
_.pieceBackground = getParamBool('Use Piece Background', true);
_.background = getParamBool('Use Scene Background', true);
_.xScroll = getParamInt('Background X Scroll', 0);
_.yScroll = getParamInt('Background Y Scroll', 0);

// Текстовые настройки
_.yesText = getParamStr('Yes Text', 'Yes');
_.noText = getParamStr('No Text', 'No');
_.leaveDialogue = getParamStr('Leave Dialogue', 'Are you sure you want to leave?').replace(/\\n/g, '\n');
_.mandatoryDialogue = getParamStr('Mandatory Dialogue', 'You must select an option for all the highlighted categories before leaving!').replace(/\\n/g, '\n');

// Дополнительные настройки
_.touchInput = getParamBool('Color Mouse/Touch Input', true);
_.console = getParamBool('Print to Console', false);
_.path = getParamStr('Custom Character Folder', 'SumRndmDde/character-creator-ex/');
_.animationSpeed = getParamInt('Animation Speed', 10);

// Добавляем img/ к пути если нужно
if (!_.path.startsWith('img/')) {
    _.path = 'img/' + _.path;
}
if (!_.path.endsWith('/')) {
    _.path += '/';
}

_.isNodeJs = Utils.isNwjs();
_.fileInfoStuff = {};

_.xOffset = 40;

console.log('========================================');
console.log('Character Creator EX v1.04 загружен');
console.log('========================================');
console.log('Разрешение спрайтов: ' + _.width + 'x' + _.height);
console.log('Кадров анимации: ' + _.framesCount);
console.log('Размер спрайт-листа: ' + _.fileWidth + 'x' + _.fileHeight);
console.log('SV разрешение: ' + _.svWidth + 'x' + _.svHeight);
console.log('Папка ресурсов: ' + _.path);
console.log('Обязательные слои: ' + _.mandatory.join(', '));
console.log('Цвета включены: ' + _.touchInput);
console.log('========================================');

//-----------------------------------------------------------------------------
// ФУНКЦИИ РАБОТЫ С ФАЙЛАМИ
//-----------------------------------------------------------------------------

_.getRealFilePath = function(p) {
    const path = require('path');
    const base = path.dirname(process.mainModule.filename);
    return path.join(base, p);
};

_.getFilePathData = function() {
    var path = require('path');
    var base = path.dirname(process.mainModule.filename);
    return path.join(base, 'data/');
};

_.getFolderListNodeJs = function() {
    const result = [];
    const fs = require('fs');
    const location = this.getRealFilePath(this.path);
    
    console.log('Сканирование папки: ' + location);
    
    if (!fs.existsSync(location)) {
        console.warn('Папка не найдена: ' + location);
        return result;
    }
    
    const files = fs.readdirSync(location);
    for(let i = 0; i < files.length; i++) {
        const file = location + files[i];
        const stat = fs.statSync(file);
        if(stat && stat.isDirectory()) {
            result.push(files[i]);
        }
    }
    
    console.log('Найдено папок: ' + result.length);
    return result;
};

_.getFileListNodeJs = function(folder) {
    const result = [];
    const fs = require('fs');
    const location = this.getRealFilePath(this.path) + folder + 'walk/';
    
    if (!fs.existsSync(location)) {
        console.warn('Папка walk не найдена: ' + location);
        return result;
    }
    
    const files = fs.readdirSync(location);
    for(let i = 0; i < files.length; i++) {
        const file = location + files[i];
        const stat = fs.statSync(file);
        if(!stat) continue;
        if(!stat.isDirectory() && _.isImageFile(files[i])) {
            const f = files[i].replace('.png', '');
            result.push(f);
        }
    }
    return result;
};

_.saveFileInfoStuff = function() {
    const folds = this.getFolderListNodeJs();
    this.fileInfoStuff.folders = folds;
    for(let i = 0; i < folds.length; i++) {
        const fold = folds[i] + '/';
        this.fileInfoStuff[fold] = this.getFileListNodeJs(fold);
    }
    const data = LZString.compressToBase64(JSON.stringify(this.fileInfoStuff));
    const fs = require('fs');
    const dirPath = this.getFilePathData();
    const filePath = dirPath + 'cc-info.sumrndmdde';
    fs.writeFileSync(filePath, data);
    console.log('Информация о файлах сохранена');
};

_.loadSaveInfoFile = function() {
    var xhr = new XMLHttpRequest();
    var url = 'data/cc-info.sumrndmdde';
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status < 400) {
            this.fileInfoStuff = JSON.parse(LZString.decompressFromBase64(xhr.responseText));
            console.log('Информация о файлах загружена');
        }
    };
    xhr.onerror = function() {
        console.warn('Не удалось загрузить информацию о файлах');
    };
    xhr.send();
};

_.getFolderList = function() {
    return this.fileInfoStuff.folders || [];
};

_.getFileList = function(folder) {
    return this.fileInfoStuff[folder] || [];
};

_.isImageFile = function(filename) {
    return !!(filename.match(/\.png/i));
};

_.cache = new CacheMap(_);

_.loadImage = function(filename, hue) {
    const key = filename;
    let bitmap = this.cache.getItem(key);
    if(!bitmap) {
        bitmap = ImageManager.loadBitmap(this.path, filename, hue, true);
        this.cache.setItem(key, bitmap);
    }
    return bitmap;
};

_.loadImageWPath = function(path, filename, hue) {
    const key = filename + path;
    let bitmap = this.cache.getItem(key);
    if(!bitmap) {
        bitmap = ImageManager.loadBitmap(path, filename, hue, true);
        this.cache.setItem(key, bitmap);
    }
    return bitmap;
};

_.preloadCharacterPieces = function() {
    const folders = this.getFolderList();
    _._ccex_loads = 0;
    _._ccex_files = -1;
    let tempFiles = 0;
    const increaseLoads = function() {
        _._ccex_loads++;
    }
    for(let i = 0; i < folders.length; i++) {
        const files = this.getFileList(folders[i] + '/');
        for(let j = 0; j < files.length; j++) {
            this.loadImageWPath(this.path + folders[i] + '/walk/', files[j]).addLoadListener(increaseLoads.bind(this));
            this.loadImageWPath(this.path + folders[i] + '/dead/', files[j]).addLoadListener(increaseLoads.bind(this));
            this.loadImageWPath(this.path + folders[i] + '/face/', files[j]).addLoadListener(increaseLoads.bind(this));
            this.loadImageWPath(this.path + folders[i] + '/sv/', files[j]).addLoadListener(increaseLoads.bind(this));
            tempFiles += 4;
        }
    }
    _._ccex_files = tempFiles;
    this.loadImage('CustomCharacter');
    this.loadImage('CustomFace');
    this.loadImage('Background');
    this.loadImage('Walk-Background');
    this.loadImage('Dead-Background');
    this.loadImage('SV-Background');
    this.loadImage('Face-Background');
};

if(_.isNodeJs) {
    _.saveFileInfoStuff();
} else {
    _.loadSaveInfoFile();
}

// ... (остальной код плагина остается как в предыдущей версии)

})(SRD.CharacterCreatorEX);