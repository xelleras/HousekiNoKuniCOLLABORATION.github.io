/*:
 * @plugindesc v1.1 Расширение AnimaX - Тонирование слоёв
 * @author Assistant
 * @help
 * ============================================================================
 * Расширение для PKD_AnimaX, позволяющее изменять цвет слоёв анимации
 * ============================================================================
 * 
 * Как использовать:
 * 
 * 1. Установите этот плагин НИЖЕ PKD_AnimaX в Plugin Manager
 * 
 * 2. Команды скрипта:
 *    TintAnimaLayer(charId, layerName, color, duration)
 *       charId: 0 - игрок, -1 - текущее событие, >0 - ID события
 *       layerName: имя слоя (например "Hat", "Armor")
 *       color: строка цвета в HEX ("#ff0000") или RGB "rgb(255,0,0)"
 *       duration: длительность анимации перехода в кадрах (по умолчанию 0 - мгновенно)
 *    
 *    ResetAnimaLayerTint(charId, layerName, duration)
 *       Сбрасывает цвет слоя к исходному
 *    
 *    TintAllAnimaLayers(charId, color, duration)
 *       Тонирует ВСЕ слои персонажа
 *    
 *    ResetAllAnimaLayersTint(charId, duration)
 *       Сбрасывает цвет всех слоёв
 * 
 * 3. В Call Script (Вызов скрипта):
 *    TintAnimaLayer(0, "Hat", "#ff0000", 30);
 *    ResetAnimaLayerTint(-1, "Armor", 15);
 *    TintAllAnimaLayers(0, "#3366cc", 0);
 * 
 * ============================================================================
 * Требования:
 * - PKD_AnimaX (должен быть установлен и настроен)
 * - Изображения слоёв рекомендуется делать белыми/серыми для лучшего тонирования
 * ============================================================================
 *
 * @param defaultTransitionFrames
 * @text Длительность перехода по умолчанию
 * @type number
 * @min 0
 * @max 120
 * @default 0
 * @desc Количество кадров для плавного перехода цвета
 */

(function() {
    
    var parameters = PluginManager.parameters('PKD_AnimaX_Tint');
    var defaultTransitionFrames = Number(parameters['defaultTransitionFrames'] || 0);
    
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function rgbStringToRgb(rgbString) {
        var result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(rgbString);
        return result ? {
            r: parseInt(result[1]),
            g: parseInt(result[2]),
            b: parseInt(result[3])
        } : null;
    }
    
    function parseColor(colorString) {
        if (!colorString) return null;
        if (colorString.indexOf('#') === 0) {
            return hexToRgb(colorString);
        } else if (colorString.indexOf('rgb') === 0) {
            return rgbStringToRgb(colorString);
        }
        return null;
    }
    
    function blendColors(startRgb, targetRgb, progress) {
        if (!startRgb) startRgb = { r: 0, g: 0, b: 0 };
        if (!targetRgb) targetRgb = { r: 0, g: 0, b: 0 };
        return {
            r: Math.round(startRgb.r + (targetRgb.r - startRgb.r) * progress),
            g: Math.round(startRgb.g + (targetRgb.g - startRgb.g) * progress),
            b: Math.round(startRgb.b + (targetRgb.b - startRgb.b) * progress)
        };
    }
    
    function SpriteTintController(sprite) {
        this.sprite = sprite;
        this._originalTint = null;
        this._targetTint = null;
        this._currentTint = null;
        this._transitionDuration = 0;
        this._transitionProgress = 0;
        this._isActive = false;
    }
    
    SpriteTintController.prototype.setTint = function(color, duration) {
        var rgb = parseColor(color);
        if (!rgb) {
            this.resetTint(duration);
            return;
        }
        var rt = Math.round((rgb.r - 255) / 2);
        var gt = Math.round((rgb.g - 255) / 2);
        var bt = Math.round((rgb.b - 255) / 2.5);
        this._targetTint = [rt, gt, bt, 0];
        if (!this._isActive) {
            if (this.sprite.getColorTone) {
                this._originalTint = this.sprite.getColorTone();
            }
            if (!this._originalTint) {
                this._originalTint = [0, 0, 0, 0];
            }
            this._currentTint = this._originalTint.slice();
        }
        this._transitionDuration = duration || 0;
        this._transitionProgress = 0;
        this._isActive = true;
        if (this._transitionDuration === 0) {
            this._applyTint(this._targetTint);
        }
    };
    
    SpriteTintController.prototype.resetTint = function(duration) {
        if (!this._isActive || !this._originalTint) {
            if (this._originalTint) {
                this.sprite.setColorTone(this._originalTint);
            }
            this._isActive = false;
            return;
        }
        this._targetTint = this._originalTint.slice();
        this._transitionDuration = duration || 0;
        this._transitionProgress = 0;
        if (this._transitionDuration === 0) {
            this._applyTint(this._targetTint);
            this._isActive = false;
        }
    };
    
    SpriteTintController.prototype.update = function() {
        if (!this._isActive || this._transitionDuration === 0) return;
        this._transitionProgress++;
        var progress = Math.min(this._transitionProgress / this._transitionDuration, 1);
        var currentColor = {
            r: this._currentTint[0],
            g: this._currentTint[1],
            b: this._currentTint[2]
        };
        var targetColor = {
            r: this._targetTint[0],
            g: this._targetTint[1],
            b: this._targetTint[2]
        };
        var blended = blendColors(currentColor, targetColor, progress);
        var newTint = [blended.r, blended.g, blended.b, this._targetTint[3] || 0];
        this._applyTint(newTint);
        if (progress >= 1) {
            if (this._targetTint === this._originalTint) {
                this._isActive = false;
            }
            this._currentTint = this._targetTint.slice();
        }
    };
    
    SpriteTintController.prototype._applyTint = function(tint) {
        if (this.sprite && this.sprite.setColorTone) {
            this.sprite.setColorTone(tint);
        }
    };
    
    if (typeof Sprite_AnimaXPart !== 'undefined') {
        var _Sprite_AnimaXPart_initialize = Sprite_AnimaXPart.prototype.initialize;
        Sprite_AnimaXPart.prototype.initialize = function(animPart, rootAnimation) {
            _Sprite_AnimaXPart_initialize.call(this, animPart, rootAnimation);
            this._tintController = new SpriteTintController(this);
            if (animPart && animPart.filename) {
                var parts = animPart.filename.split('/');
                this._layerName = parts[parts.length - 1] || '';
            } else {
                this._layerName = '';
            }
        };
        
        var _Sprite_AnimaXPart_update = Sprite_AnimaXPart.prototype.update;
        Sprite_AnimaXPart.prototype.update = function() {
            if (_Sprite_AnimaXPart_update) {
                _Sprite_AnimaXPart_update.call(this);
            }
            if (this._tintController) {
                this._tintController.update();
            }
        };
        
        Sprite_AnimaXPart.prototype.setLayerTint = function(color, duration) {
            if (this._tintController) {
                this._tintController.setTint(color, duration);
            }
        };
        
        Sprite_AnimaXPart.prototype.resetLayerTint = function(duration) {
            if (this._tintController) {
                this._tintController.resetTint(duration);
            }
        };
        
        Sprite_AnimaXPart.prototype.getLayerName = function() {
            return this._layerName || '';
        };
    }
    
    var _Sprite_Character_createAnimaXParts = Sprite_Character.prototype._createAnimaXParts;
    Sprite_Character.prototype._createAnimaXParts = function() {
        if (_Sprite_Character_createAnimaXParts) {
            _Sprite_Character_createAnimaXParts.call(this);
        }
        this._animaXLayerTints = this._animaXLayerTints || {};
    };
    
    Sprite_Character.prototype.tintAnimaLayer = function(layerName, color, duration) {
        if (!this.__tAnimxParts) return false;
        duration = duration !== undefined ? duration : defaultTransitionFrames;
        var found = false;
        for (var i = 0; i < this.__tAnimxParts.length; i++) {
            var part = this.__tAnimxParts[i];
            if (!part) continue;
            var partName = part.getLayerName ? part.getLayerName() : '';
            if (partName.indexOf(layerName) !== -1 || 
                (part.animPart && part.animPart.filename && part.animPart.filename.indexOf(layerName) !== -1)) {
                if (part.setLayerTint) {
                    part.setLayerTint(color, duration);
                    found = true;
                }
            }
        }
        if (found) {
            this._animaXLayerTints[layerName] = color;
        }
        return found;
    };
    
    Sprite_Character.prototype.resetAnimaLayerTint = function(layerName, duration) {
        if (!this.__tAnimxParts) return false;
        duration = duration !== undefined ? duration : defaultTransitionFrames;
        var found = false;
        for (var i = 0; i < this.__tAnimxParts.length; i++) {
            var part = this.__tAnimxParts[i];
            if (!part) continue;
            var partName = part.getLayerName ? part.getLayerName() : '';
            if (partName.indexOf(layerName) !== -1 || 
                (part.animPart && part.animPart.filename && part.animPart.filename.indexOf(layerName) !== -1)) {
                if (part.resetLayerTint) {
                    part.resetLayerTint(duration);
                    found = true;
                }
            }
        }
        if (found) {
            delete this._animaXLayerTints[layerName];
        }
        return found;
    };
    
    Sprite_Character.prototype.tintAllAnimaLayers = function(color, duration) {
        if (!this.__tAnimxParts) return;
        duration = duration !== undefined ? duration : defaultTransitionFrames;
        for (var i = 0; i < this.__tAnimxParts.length; i++) {
            var part = this.__tAnimxParts[i];
            if (part && part.setLayerTint) {
                part.setLayerTint(color, duration);
                var partName = part.getLayerName ? part.getLayerName() : '';
                if (partName) {
                    this._animaXLayerTints[partName] = color;
                }
            }
        }
    };
    
    Sprite_Character.prototype.resetAllAnimaLayersTint = function(duration) {
        if (!this.__tAnimxParts) return;
        duration = duration !== undefined ? duration : defaultTransitionFrames;
        for (var i = 0; i < this.__tAnimxParts.length; i++) {
            var part = this.__tAnimxParts[i];
            if (part && part.resetLayerTint) {
                part.resetLayerTint(duration);
            }
        }
        this._animaXLayerTints = {};
    };
    
    Sprite_Character.prototype.reapplyStoredTints = function() {
        if (!this._animaXLayerTints) return;
        for (var layerName in this._animaXLayerTints) {
            if (this._animaXLayerTints.hasOwnProperty(layerName)) {
                this.tintAnimaLayer(layerName, this._animaXLayerTints[layerName], 0);
            }
        }
    };
    
    function getCharacterSprite(charId) {
        var character;
        if (typeof PKD_ANIMAX !== 'undefined' && PKD_ANIMAX.GetProperCharacter) {
            character = PKD_ANIMAX.GetProperCharacter(charId);
        } else {
            if (charId === 0 || charId === undefined) {
                character = $gamePlayer;
            } else if (charId < 0) {
                var interpreter = $gameMap._interpreter;
                var eventId = interpreter.eventId();
                character = $gameMap.event(eventId);
            } else {
                character = $gameMap.event(charId);
            }
        }
        if (!character) return null;
        var scene = SceneManager._scene;
        if (!scene || !scene._spriteset) return null;
        var sprite = null;
        if (charId === 0 || charId === undefined) {
            sprite = scene._spriteset._playerSprite;
        } else {
            var searchId;
            if (charId < 0) {
                var interpreter = $gameMap._interpreter;
                searchId = interpreter.eventId();
            } else {
                searchId = charId;
            }
            if (scene._spriteset._characterSprites) {
                for (var i = 0; i < scene._spriteset._characterSprites.length; i++) {
                    var s = scene._spriteset._characterSprites[i];
                    if (s._character && s._character.eventId && s._character.eventId() === searchId) {
                        sprite = s;
                        break;
                    }
                }
            }
        }
        return sprite;
    }
    
    window.TintAnimaLayer = function(charId, layerName, color, duration) {
        if (!layerName) return false;
        var sprite = getCharacterSprite(charId);
        if (sprite && sprite.tintAnimaLayer) {
            return sprite.tintAnimaLayer(layerName, color, duration);
        }
        return false;
    };
    
    window.ResetAnimaLayerTint = function(charId, layerName, duration) {
        if (!layerName) return false;
        var sprite = getCharacterSprite(charId);
        if (sprite && sprite.resetAnimaLayerTint) {
            return sprite.resetAnimaLayerTint(layerName, duration);
        }
        return false;
    };
    
    window.TintAllAnimaLayers = function(charId, color, duration) {
        var sprite = getCharacterSprite(charId);
        if (sprite && sprite.tintAllAnimaLayers) {
            sprite.tintAllAnimaLayers(color, duration);
            return true;
        }
        return false;
    };
    
    window.ResetAllAnimaLayersTint = function(charId, duration) {
        var sprite = getCharacterSprite(charId);
        if (sprite && sprite.resetAllAnimaLayersTint) {
            sprite.resetAllAnimaLayersTint(duration);
            return true;
        }
        return false;
    };
    
    var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        if (_Scene_Map_createSpriteset) {
            _Scene_Map_createSpriteset.call(this);
        }
        setTimeout(function() {
            var sprite = getCharacterSprite(0);
            if (sprite && sprite.reapplyStoredTints) {
                sprite.reapplyStoredTints();
            }
        }, 100);
    };
    
    window.HexToRgb = hexToRgb;
    
    window.RgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    window.RandomHexColor = function() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };
    
    window.HsvToRgb = function(h, s, v) {
        var r, g, b;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };
    
})();