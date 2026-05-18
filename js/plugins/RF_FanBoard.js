/*:
 * @plugindesc Плагин для отображения галереи фан-артов v2.2.0
 * @author Xelleras
 * @help
 * ============================================================================
 * Галерея фан-артов с перелистыванием (мобильная версия)
 * ============================================================================
 * 
 * Использование:
 * В событии на карте используйте вызов плагина:
 * FanArtBoard show
 * 
 * Для добавления арта:
 * FanArtBoard add [filename] [url]
 * 
 * Для добавления арта с кастомным размером:
 * FanArtBoard addSized [filename] [url] [width] [height]
 * 
 * Где:
 * filename - имя файла изображения из папки img/pictures/
 * url - ссылка для перехода при клике
 * width - ширина арта в пикселях (опционально)
 * height - высота арта в пикселях (опционально)
 * 
 * Для очистки списка артов:
 * FanArtBoard clear
 * 
 * Управление:
 * Стрелки влево/вправо/свайп - листание артов
 * Enter/Пробел/Клик по арту - открыть ссылку
 * ESC/Кнопка закрытия - закрыть галерею
 * 
 * ============================================================================
 * 
 * @param DarknessOpacity
 * @desc Прозрачность затемнения (0-255)
 * @default 180
 * 
 * @param OpenWebsite
 * @desc Открывать ссылки в браузере (true/false)
 * @default true
 * 
 * @param ArrowSize
 * @desc Размер стрелок в пикселях
 * @default 60
 * 
 * @param ArtMaxWidth
 * @desc Максимальная ширина арта
 * @default 800
 * 
 * @param ArtMaxHeight
 * @desc Максимальная высота арта
 * @default 600
 * 
 * @param CloseButtonSize
 * @desc Размер кнопки закрытия
 * @default 50
 * 
 * @param CloseButtonText
 * @desc Текст подсказки для закрытия
 * @default ESC - закрыть | ← → - листать | Enter - открыть
 * 
 * @param CloseButtonY
 * @desc Позиция Y текста подсказки (от низа экрана)
 * @default 50
 * 
 * @param TextColor
 * @desc Цвет текста (CSS цвет)
 * @default #ffffff
 * 
 * @param TextSize
 * @desc Размер текста
 * @default 18
 * 
 * @param CounterColor
 * @desc Цвет счетчика артов
 * @default #ffffff
 * 
 * @param CounterSize
 * @desc Размер счетчика артов
 * @default 24
 * 
 * @param SwipeThreshold
 * @desc Чувствительность свайпа (пиксели)
 * @default 50
 */

(function() {
    'use strict';

    // Получаем параметры плагина
    var parameters = PluginManager.parameters('FanArtBoard');
    var darknessOpacity = Number(parameters['DarknessOpacity'] || 180);
    var openWebsite = parameters['OpenWebsite'] !== 'false';
    var arrowSize = Number(parameters['ArrowSize'] || 60);
    var artMaxWidth = Number(parameters['ArtMaxWidth'] || 800);
    var artMaxHeight = Number(parameters['ArtMaxHeight'] || 600);
    var closeButtonSize = Number(parameters['CloseButtonSize'] || 50);
    var closeButtonText = parameters['CloseButtonText'] || 'X - закрыть | ← → - листать | Z - открыть';
    var closeButtonY = Number(parameters['CloseButtonY'] || 50);
    var textColor = parameters['TextColor'] || '#ffffff';
    var textSize = Number(parameters['TextSize'] || 18);
    var counterColor = parameters['CounterColor'] || '#ffffff';
    var counterSize = Number(parameters['CounterSize'] || 24);
    var swipeThreshold = Number(parameters['SwipeThreshold'] || 50);

    // Хранилище
    var fanArts = [];
    var isBoardActive = false;
    var currentIndex = 0;
    var darkOverlay = null;
    var artSprite = null;
    var leftArrow = null;
    var rightArrow = null;
    var closeButton = null;
    var closeTextSprite = null;
    var counterSprite = null;
    var navigationSprites = [];
    
    // Флаги блокировки
    var playerMoveBlocked = false;
    var menuAccessBlocked = false;
    
    // Для свайпа
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwiping = false;

    // Команда плагина
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command === 'FanArtBoard') {
            switch (args[0]) {
                case 'show':
                    showFanArtGallery();
                    break;
                case 'add':
                    if (args.length >= 3) {
                        addFanArt(args[1], args.slice(2).join(' '));
                    }
                    break;
                case 'addSized':
                    if (args.length >= 5) {
                        addFanArtSized(args[1], args[2], Number(args[3]), Number(args[4]));
                    }
                    break;
                case 'clear':
                    clearFanArts();
                    break;
            }
        }
    };

    function addFanArt(filename, url) {
        fanArts.push({
            filename: filename,
            url: url,
            customWidth: null,
            customHeight: null
        });
    }

    function addFanArtSized(filename, url, width, height) {
        fanArts.push({
            filename: filename,
            url: url,
            customWidth: width,
            customHeight: height
        });
    }

    function clearFanArts() {
        fanArts = [];
    }

    // Блокировка управления игроком
    function blockPlayerControls() {
        if (!playerMoveBlocked) {
            menuAccessBlocked = true;
            playerMoveBlocked = true;
        }
    }

    // Разблокировка управления игроком
    function unblockPlayerControls() {
        if (playerMoveBlocked) {
            menuAccessBlocked = false;
            playerMoveBlocked = false;
        }
    }

    // Перехватываем открытие меню
    var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        if (menuAccessBlocked) {
            return;
        }
        _Scene_Map_callMenu.call(this);
    };

    // Перехватываем движение игрока
    var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (playerMoveBlocked) {
            return;
        }
        _Game_Player_moveByInput.call(this);
    };

    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (playerMoveBlocked) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    var _Game_Player_isDashButtonPressed = Game_Player.prototype.isDashButtonPressed;
    Game_Player.prototype.isDashButtonPressed = function() {
        if (playerMoveBlocked) {
            return false;
        }
        return _Game_Player_isDashButtonPressed.call(this);
    };

    var _Game_Character_isMoving = Game_Character.prototype.isMoving;
    Game_Character.prototype.isMoving = function() {
        if (playerMoveBlocked && this instanceof Game_Player) {
            return false;
        }
        return _Game_Character_isMoving.call(this);
    };

    function preloadAllImages(callback) {
        if (fanArts.length === 0) {
            callback();
            return;
        }
        
        var loadedCount = 0;
        var totalArts = fanArts.length;
        
        fanArts.forEach(function(art) {
            var img = new Image();
            img.onload = function() {
                loadedCount++;
                if (loadedCount >= totalArts) {
                    callback();
                }
            };
            img.onerror = function() {
                loadedCount++;
                console.warn('Failed to load image: ' + art.filename);
                if (loadedCount >= totalArts) {
                    callback();
                }
            };
            img.src = 'img/pictures/' + art.filename + '.png';
        });
    }

    function showFanArtGallery() {
        if (fanArts.length === 0) {
            console.warn('No fan arts configured!');
            return;
        }

        if (isBoardActive) return;
        isBoardActive = true;
        currentIndex = 0;

        // Блокируем управление игроком
        blockPlayerControls();

        // Затемняем экран
        createDarkOverlay();
        
        // Создаем элементы интерфейса
        createUI();
        
        // Предзагружаем все изображения и показываем первый арт
        preloadAllImages(function() {
            // Небольшая задержка для уверенности что все загрузилось
            setTimeout(function() {
                showArt(currentIndex);
            }, 100);
        });
    }

    function createDarkOverlay() {
        darkOverlay = new Sprite();
        darkOverlay.bitmap = new Bitmap(Graphics.width, Graphics.height);
        darkOverlay.bitmap.fillAll('rgba(0, 0, 0, ' + (darknessOpacity / 255) + ')');
        darkOverlay.opacity = 0;
        
        SceneManager._scene.addChild(darkOverlay);
        
        var fadeIn = function() {
            if (darkOverlay && darkOverlay.opacity < 255) {
                darkOverlay.opacity += 12;
                requestAnimationFrame(fadeIn);
            }
        };
        fadeIn();
    }

    function createUI() {
        createCloseButton();
        createNavigationArrows();
        createCloseButtonText();
        createCounter();
        
        // Добавляем обработчик тач-событий для свайпа
        addSwipeHandler();
    }

    function createCloseButton() {
        closeButton = new Sprite();
        closeButton.bitmap = new Bitmap(closeButtonSize, closeButtonSize);
        
        // Рисуем крестик
        var ctx = closeButton.bitmap._context;
        var padding = closeButtonSize * 0.3;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Рисуем X
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(closeButtonSize - padding, closeButtonSize - padding);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(closeButtonSize - padding, padding);
        ctx.lineTo(padding, closeButtonSize - padding);
        ctx.stroke();
        
        // Фон для кнопки
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(closeButtonSize / 2, closeButtonSize / 2, closeButtonSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        closeButton.x = Graphics.width - closeButtonSize - 15;
        closeButton.y = 15;
        closeButton.opacity = 0;
        closeButton.interactive = true;
        closeButton.buttonMode = true;
        closeButton.hitArea = new PIXI.Circle(closeButtonSize / 2, closeButtonSize / 2, closeButtonSize / 2);
        
        closeButton.on('pointerover', function() {
            this.opacity = 255;
            this.scale.set(1.1, 1.1);
        });
        
        closeButton.on('pointerout', function() {
            this.opacity = 200;
            this.scale.set(1.0, 1.0);
        });
        
        closeButton.on('pointerdown', function(event) {
            event.stopPropagation();
            SoundManager.playCancel();
            clearFanArtGallery();
        });
        
        SceneManager._scene.addChild(closeButton);
        navigationSprites.push(closeButton);
        
        animateFadeIn(closeButton, 200);
    }

    function createNavigationArrows() {
        // Левая стрелка
        leftArrow = new Sprite();
        leftArrow.bitmap = new Bitmap(arrowSize, arrowSize);
        drawArrow(leftArrow.bitmap, 'left');
        leftArrow.x = 20;
        leftArrow.y = (Graphics.height - arrowSize) / 2;
        leftArrow.opacity = 0;
        leftArrow.interactive = true;
        leftArrow.buttonMode = true;
        leftArrow.hitArea = new PIXI.Rectangle(0, 0, arrowSize, arrowSize);
        
        leftArrow.on('pointerover', function() {
            this.opacity = 255;
            this.scale.set(1.2, 1.2);
        });
        
        leftArrow.on('pointerout', function() {
            this.opacity = 200;
            this.scale.set(1.0, 1.0);
        });
        
        leftArrow.on('pointerdown', function(event) {
            event.stopPropagation();
            if (currentIndex > 0) {
                navigateArt(-1);
            }
        });
        
        // Правая стрелка
        rightArrow = new Sprite();
        rightArrow.bitmap = new Bitmap(arrowSize, arrowSize);
        drawArrow(rightArrow.bitmap, 'right');
        rightArrow.x = Graphics.width - arrowSize - 20;
        rightArrow.y = (Graphics.height - arrowSize) / 2;
        rightArrow.opacity = 0;
        rightArrow.interactive = true;
        rightArrow.buttonMode = true;
        rightArrow.hitArea = new PIXI.Rectangle(0, 0, arrowSize, arrowSize);
        
        rightArrow.on('pointerover', function() {
            this.opacity = 255;
            this.scale.set(1.2, 1.2);
        });
        
        rightArrow.on('pointerout', function() {
            this.opacity = 200;
            this.scale.set(1.0, 1.0);
        });
        
        rightArrow.on('pointerdown', function(event) {
            event.stopPropagation();
            if (currentIndex < fanArts.length - 1) {
                navigateArt(1);
            }
        });
        
        SceneManager._scene.addChild(leftArrow);
        SceneManager._scene.addChild(rightArrow);
        navigationSprites.push(leftArrow, rightArrow);
        
        animateFadeIn(leftArrow, 200);
        animateFadeIn(rightArrow, 200);
    }

    function drawArrow(bitmap, direction) {
        var ctx = bitmap._context;
        var size = arrowSize;
        var padding = size * 0.3;
        
        // Фон для стрелки
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Стрелка
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        if (direction === 'left') {
            ctx.moveTo(size - padding * 2, padding);
            ctx.lineTo(padding, size / 2);
            ctx.lineTo(size - padding * 2, size - padding);
        } else {
            ctx.moveTo(padding * 2, padding);
            ctx.lineTo(size - padding, size / 2);
            ctx.lineTo(padding * 2, size - padding);
        }
        ctx.stroke();
    }

    function createCloseButtonText() {
        closeTextSprite = new Sprite();
        closeTextSprite.bitmap = new Bitmap(Graphics.width, 30);
        closeTextSprite.bitmap.fontSize = textSize;
        closeTextSprite.bitmap.textColor = textColor;
        
        var textWidth = closeTextSprite.bitmap.measureTextWidth(closeButtonText);
        var textX = (Graphics.width - textWidth) / 2;
        
        closeTextSprite.bitmap.drawText(closeButtonText, textX, 0, textWidth + 20, 30, 'center');
        closeTextSprite.y = Graphics.height - closeButtonY;
        closeTextSprite.opacity = 0;
        
        SceneManager._scene.addChild(closeTextSprite);
        navigationSprites.push(closeTextSprite);
        
        animateFadeIn(closeTextSprite, 200);
    }

    function createCounter() {
        counterSprite = new Sprite();
        counterSprite.bitmap = new Bitmap(200, 40);
        counterSprite.bitmap.fontSize = counterSize;
        counterSprite.bitmap.textColor = counterColor;
        
        updateCounter();
        
        counterSprite.x = (Graphics.width - 200) / 2;
        counterSprite.y = 20;
        counterSprite.opacity = 0;
        
        SceneManager._scene.addChild(counterSprite);
        navigationSprites.push(counterSprite);
        
        animateFadeIn(counterSprite, 255);
    }

    function updateCounter() {
        if (counterSprite && counterSprite.bitmap) {
            counterSprite.bitmap.clear();
            counterSprite.bitmap.drawText(
                (currentIndex + 1) + ' / ' + fanArts.length,
                0, 0, 200, 40, 'center'
            );
        }
    }

    function showArt(index) {
        // Удаляем старый спрайт если есть
        if (artSprite) {
            SceneManager._scene.removeChild(artSprite);
            artSprite = null;
        }
        
        var art = fanArts[index];
        
        // Создаем спрайт
        artSprite = new Sprite();
        
        // Загружаем изображение
        var bitmap = ImageManager.loadPicture(art.filename);
        
        // Проверяем что изображение загружено
        if (!bitmap || !bitmap.width || !bitmap.height) {
            console.warn('Image not loaded properly: ' + art.filename);
            // Пробуем загрузить снова через мгновение
            setTimeout(function() {
                if (isBoardActive && currentIndex === index) {
                    showArt(index);
                }
            }, 50);
            return;
        }
        
        artSprite.bitmap = bitmap;
        
        // Определяем размеры
        var width = art.customWidth || artMaxWidth;
        var height = art.customHeight || artMaxHeight;
        
        // Вычисляем масштаб
        var scaleX = width / bitmap.width;
        var scaleY = height / bitmap.height;
        var scale = Math.min(scaleX, scaleY, 1);
        
        artSprite.scale.set(scale, scale);
        
        // Центрируем спрайт
        var actualWidth = bitmap.width * scale;
        var actualHeight = bitmap.height * scale;
        
        artSprite.x = (Graphics.width - actualWidth) / 2;
        artSprite.y = (Graphics.height - actualHeight) / 2;
        
        artSprite.opacity = 0;
        artSprite.interactive = true;
        artSprite.buttonMode = true;
        
        // Добавляем обработчики для арта
        artSprite.on('pointerdown', function(event) {
            event.stopPropagation();
            if (openWebsite && fanArts[currentIndex].url) {
                window.open(fanArts[currentIndex].url, '_blank');
            }
        });
        
        SceneManager._scene.addChild(artSprite);
        
        // Анимация появления
        var targetOpacity = 255;
        var fadeIn = function() {
            if (artSprite && artSprite.opacity < targetOpacity) {
                artSprite.opacity += 10;
                requestAnimationFrame(fadeIn);
            }
        };
        fadeIn();
        
        updateArrowsVisibility();
        updateCounter();
    }

    function navigateArt(direction) {
        var newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < fanArts.length) {
            currentIndex = newIndex;
            SoundManager.playCursor();
            
            // Анимируем переход
            animateArtTransition(direction, function() {
                showArt(currentIndex);
            });
        }
    }

    function animateArtTransition(direction, callback) {
        if (!artSprite) {
            callback();
            return;
        }
        
        var targetX = direction > 0 ? -artSprite.width : Graphics.width;
        var speed = 40;
        
        var animate = function() {
            if (direction > 0) {
                artSprite.x -= speed;
                if (artSprite.x <= targetX) {
                    callback();
                    return;
                }
            } else {
                artSprite.x += speed;
                if (artSprite.x >= targetX) {
                    callback();
                    return;
                }
            }
            artSprite.opacity -= 8;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    function updateArrowsVisibility() {
        if (leftArrow) {
            leftArrow.visible = currentIndex > 0;
            leftArrow.interactive = currentIndex > 0;
        }
        if (rightArrow) {
            rightArrow.visible = currentIndex < fanArts.length - 1;
            rightArrow.interactive = currentIndex < fanArts.length - 1;
        }
    }

    function animateFadeIn(sprite, targetOpacity) {
        if (!sprite) return;
        
        var fadeIn = function() {
            if (sprite && sprite.opacity < targetOpacity) {
                sprite.opacity += 10;
                requestAnimationFrame(fadeIn);
            }
        };
        fadeIn();
    }

    // Обработчик свайпов для мобильных устройств
    function addSwipeHandler() {
        var scene = SceneManager._scene;
        
        // Сохраняем старые обработчики
        var oldTouchStart = scene.onTouchStart;
        var oldTouchMove = scene.onTouchMove;
        var oldTouchEnd = scene.onTouchEnd;
        
        scene.onTouchStart = function(event) {
            if (isBoardActive) {
                touchStartX = event.data.global.x;
                touchStartY = event.data.global.y;
                isSwiping = false;
            }
            if (oldTouchStart) oldTouchStart.call(scene, event);
        };
        
        scene.onTouchMove = function(event) {
            if (isBoardActive && touchStartX !== 0) {
                var currentX = event.data.global.x;
                var currentY = event.data.global.y;
                var diffX = currentX - touchStartX;
                var diffY = currentY - touchStartY;
                
                // Если горизонтальное движение больше вертикального - это свайп
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                    isSwiping = true;
                    event.stopPropagation();
                }
            }
            if (oldTouchMove) oldTouchMove.call(scene, event);
        };
        
        scene.onTouchEnd = function(event) {
            if (isBoardActive && isSwiping) {
                var currentX = event.data.global.x;
                var diffX = currentX - touchStartX;
                
                if (Math.abs(diffX) > swipeThreshold) {
                    if (diffX > 0 && currentIndex > 0) {
                        // Свайп вправо - предыдущий арт
                        navigateArt(-1);
                    } else if (diffX < 0 && currentIndex < fanArts.length - 1) {
                        // Свайп влево - следующий арт
                        navigateArt(1);
                    }
                }
                
                touchStartX = 0;
                touchStartY = 0;
                isSwiping = false;
            }
            if (oldTouchEnd) oldTouchEnd.call(scene, event);
        };
    }

    function clearFanArtGallery() {
        if (!isBoardActive) return;
        isBoardActive = false;
        
        // Разблокируем управление игроком
        unblockPlayerControls();
        
        // Удаляем все спрайты
        if (darkOverlay) {
            SceneManager._scene.removeChild(darkOverlay);
            darkOverlay = null;
        }
        
        if (artSprite) {
            SceneManager._scene.removeChild(artSprite);
            artSprite = null;
        }
        
        navigationSprites.forEach(function(sprite) {
            if (sprite) {
                SceneManager._scene.removeChild(sprite);
            }
        });
        navigationSprites = [];
        
        leftArrow = null;
        rightArrow = null;
        closeButton = null;
        closeTextSprite = null;
        counterSprite = null;
        
        // Сбрасываем тач-координаты
        touchStartX = 0;
        touchStartY = 0;
        isSwiping = false;
    }

    // Обработка клавиатуры
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if (isBoardActive) {
            if (Input.isTriggered('cancel')) {
                SoundManager.playCancel();
                clearFanArtGallery();
                return;
            }
            
            if (Input.isTriggered('ok')) {
                if (openWebsite && fanArts[currentIndex].url) {
                    SoundManager.playOk();
                    window.open(fanArts[currentIndex].url, '_blank');
                }
                return;
            }
            
            if (Input.isTriggered('left')) {
                if (currentIndex > 0) {
                    navigateArt(-1);
                }
                return;
            }
            
            if (Input.isTriggered('right')) {
                if (currentIndex < fanArts.length - 1) {
                    navigateArt(1);
                }
                return;
            }
        }
    };

    // Очистка при смене сцены
    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        clearFanArtGallery();
        _Scene_Map_terminate.call(this);
    };

})();