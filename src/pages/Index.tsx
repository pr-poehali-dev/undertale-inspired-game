import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';
import PixelButton from '@/components/PixelButton';
import Icon from '@/components/ui/icon';

type GameState = 'menu' | 'dialogue' | 'battle' | 'inventory';
type PlayerAlignment = 'pacifist' | 'neutral' | 'genocide';

interface GameData {
  playerName: string;
  hp: number;
  maxHp: number;
  level: number;
  gold: number;
  alignment: PlayerAlignment;
  inventory: string[];
  choices: string[];
  currentScene: number;
}

interface DialogueScene {
  id: number;
  speaker: string;
  text: string;
  choices: {
    text: string;
    nextScene: number;
    alignment: PlayerAlignment;
  }[];
}

const dialogueScenes: DialogueScene[] = [
  {
    id: 0,
    speaker: 'Загадочная фигура',
    text: 'Добро пожаловать в подземелье... Как ты собираешься пройти свой путь?',
    choices: [
      { text: 'С добротой и милосердием', nextScene: 1, alignment: 'pacifist' },
      { text: 'Буду защищаться при необходимости', nextScene: 2, alignment: 'neutral' },
      { text: 'Силой проложу себе дорогу', nextScene: 3, alignment: 'genocide' },
    ],
  },
  {
    id: 1,
    speaker: 'Загадочная фигура',
    text: 'Путь милосердия труден, но благороден. Ты готов(-а) пощадить всех врагов?',
    choices: [
      { text: 'Да, я выбираю мир', nextScene: 4, alignment: 'pacifist' },
      { text: 'Передумал(-а)', nextScene: 2, alignment: 'neutral' },
    ],
  },
  {
    id: 2,
    speaker: 'Загадочная фигура',
    text: 'Нейтральность - это баланс. Ты будешь сражаться, но не без причины.',
    choices: [
      { text: 'Продолжить приключение', nextScene: 5, alignment: 'neutral' },
    ],
  },
  {
    id: 3,
    speaker: 'Загадочная фигура',
    text: 'Путь силы... Ты уверен(-а)? Это изменит всё.',
    choices: [
      { text: 'Да, я готов(-а)', nextScene: 6, alignment: 'genocide' },
      { text: 'Нет, выбираю другой путь', nextScene: 2, alignment: 'neutral' },
    ],
  },
  {
    id: 4,
    speaker: 'Монстр',
    text: 'Ты... ты меня не атакуешь? Может, ты друг?',
    choices: [
      { text: 'Давай дружить!', nextScene: 7, alignment: 'pacifist' },
      { text: 'Начать бой', nextScene: 8, alignment: 'neutral' },
    ],
  },
  {
    id: 5,
    speaker: 'Система',
    text: 'Ты вступил(-а) в бой с монстром!',
    choices: [
      { text: 'Атаковать', nextScene: 8, alignment: 'neutral' },
      { text: 'Пощадить', nextScene: 7, alignment: 'pacifist' },
    ],
  },
  {
    id: 6,
    speaker: 'Система',
    text: 'Путь геноцида начат. Монстры боятся тебя.',
    choices: [
      { text: 'Продолжить', nextScene: 8, alignment: 'genocide' },
    ],
  },
  {
    id: 7,
    speaker: 'Монстр',
    text: 'Спасибо за милосердие! Вот тебе немного золота!',
    choices: [
      { text: 'Открыть меню', nextScene: -1, alignment: 'pacifist' },
    ],
  },
  {
    id: 8,
    speaker: 'Система',
    text: 'Битва началась! Приготовься к сражению!',
    choices: [
      { text: 'Начать бой', nextScene: -1, alignment: 'neutral' },
    ],
  },
];

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameData, setGameData] = useState<GameData>({
    playerName: 'Герой',
    hp: 20,
    maxHp: 20,
    level: 1,
    gold: 0,
    alignment: 'neutral',
    inventory: ['Палка', 'Бинт'],
    choices: [],
    currentScene: 0,
  });
  const [currentScene, setCurrentScene] = useState<DialogueScene>(dialogueScenes[0]);
  const [enemyHp, setEnemyHp] = useState(30);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('rpg-save');
    if (saved) {
      setGameData(JSON.parse(saved));
    }
  }, []);

  const saveGame = () => {
    localStorage.setItem('rpg-save', JSON.stringify(gameData));
    alert('Игра сохранена!');
  };

  const loadGame = () => {
    const saved = localStorage.getItem('rpg-save');
    if (saved) {
      setGameData(JSON.parse(saved));
      alert('Игра загружена!');
    } else {
      alert('Сохранения не найдены!');
    }
  };

  const handleChoice = (choice: typeof currentScene.choices[0]) => {
    const newChoices = [...gameData.choices, choice.text];
    setGameData({ ...gameData, choices: newChoices, alignment: choice.alignment });
    
    if (choice.nextScene === -1) {
      if (choice.alignment === 'pacifist') {
        setGameData(prev => ({ ...prev, gold: prev.gold + 10 }));
      }
      if (choice.text === 'Начать бой') {
        setGameState('battle');
        setEnemyHp(30);
        setBattleLog(['Монстр появился!']);
        setPlayerTurn(true);
      } else {
        setGameState('menu');
      }
    } else {
      const nextScene = dialogueScenes.find(s => s.id === choice.nextScene);
      if (nextScene) {
        setCurrentScene(nextScene);
      }
    }
  };

  const attack = () => {
    if (!playerTurn) return;
    
    const damage = Math.floor(Math.random() * 5) + 5;
    const newEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newEnemyHp);
    setBattleLog(prev => [...prev, `Вы нанесли ${damage} урона!`]);
    setPlayerTurn(false);
    
    if (newEnemyHp <= 0) {
      setBattleLog(prev => [...prev, 'Победа! Враг повержен!']);
      setGameData(prev => ({ ...prev, gold: prev.gold + 15, level: prev.level + 1 }));
      setTimeout(() => setGameState('menu'), 2000);
      return;
    }
    
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 4) + 3;
      const newHp = Math.max(0, gameData.hp - enemyDamage);
      setGameData(prev => ({ ...prev, hp: newHp }));
      setBattleLog(prev => [...prev, `Враг нанёс ${enemyDamage} урона!`]);
      
      if (newHp <= 0) {
        setBattleLog(prev => [...prev, 'Поражение... Игра окончена.']);
        setTimeout(() => setGameState('menu'), 2000);
      } else {
        setPlayerTurn(true);
      }
    }, 1000);
  };

  const heal = () => {
    if (!playerTurn || !gameData.inventory.includes('Бинт')) return;
    
    const healAmount = 10;
    setGameData(prev => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + healAmount),
      inventory: prev.inventory.filter(item => item !== 'Бинт')
    }));
    setBattleLog(prev => [...prev, `Вы восстановили ${healAmount} HP!`]);
    setPlayerTurn(false);
    
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 4) + 3;
      const newHp = Math.max(0, gameData.hp - enemyDamage);
      setGameData(prev => ({ ...prev, hp: newHp }));
      setBattleLog(prev => [...prev, `Враг нанёс ${enemyDamage} урона!`]);
      setPlayerTurn(true);
    }, 1000);
  };

  const renderMenu = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-[#FFD700] text-3xl md:text-5xl text-pixelated animate-pulse">
            RPG ADVENTURE
          </h1>
          <p className="text-[#FFD700] text-xs md:text-sm text-pixelated">
            # Discover Your Legend
          </p>
        </div>
        
        <GameCard variant="purple" className="animate-scale-in">
          <div className="space-y-4">
            <PixelButton 
              variant="primary" 
              className="w-full"
              onClick={() => {
                setGameState('dialogue');
                setCurrentScene(dialogueScenes[0]);
              }}
            >
              НОВАЯ ИГРА
            </PixelButton>
            
            <PixelButton 
              variant="primary" 
              className="w-full"
              onClick={loadGame}
            >
              ЗАГРУЗИТЬ
            </PixelButton>
            
            <PixelButton 
              variant="secondary" 
              className="w-full"
              onClick={() => setGameState('inventory')}
            >
              ИНВЕНТАРЬ
            </PixelButton>
          </div>
        </GameCard>
        
        <div className="text-center text-[#8B4513] text-xs text-pixelated">
          Уровень: {gameData.level} | Золото: {gameData.gold}
        </div>
      </div>
    </div>
  );

  const renderDialogue = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Icon name="Heart" className="text-[#FF6B6B]" size={20} />
            <span className="text-[#FFD700] text-sm text-pixelated">
              {gameData.hp}/{gameData.maxHp}
            </span>
          </div>
          <PixelButton 
            variant="secondary" 
            className="text-xs"
            onClick={() => setGameState('menu')}
          >
            МЕНЮ
          </PixelButton>
        </div>
        
        <GameCard variant="brown">
          <div className="space-y-4">
            <div className="text-[#FFD700] text-sm text-pixelated border-b-2 border-[#8B4513] pb-2">
              {currentScene.speaker}
            </div>
            <p className="text-black text-xs leading-relaxed min-h-[80px]">
              {currentScene.text}
            </p>
          </div>
        </GameCard>
        
        <div className="space-y-3">
          {currentScene.choices.map((choice, index) => (
            <PixelButton
              key={index}
              variant="primary"
              className="w-full"
              onClick={() => handleChoice(choice)}
            >
              {choice.text}
            </PixelButton>
          ))}
        </div>
        
        <div className="text-center text-[#8B4513] text-xs text-pixelated">
          Мировоззрение: {gameData.alignment === 'pacifist' ? 'Пацифист' : gameData.alignment === 'genocide' ? 'Геноцид' : 'Нейтрал'}
        </div>
      </div>
    </div>
  );

  const renderBattle = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Icon name="Heart" className="text-[#FF6B6B]" size={20} />
            <span className="text-[#FFD700] text-sm text-pixelated">
              {gameData.hp}/{gameData.maxHp}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF6B6B] text-sm text-pixelated">
              Враг: {enemyHp}/30
            </span>
          </div>
        </div>
        
        <GameCard variant="brown">
          <div className="space-y-2 min-h-[150px]">
            {battleLog.slice(-5).map((log, index) => (
              <p key={index} className="text-black text-xs">
                {log}
              </p>
            ))}
          </div>
        </GameCard>
        
        <div className="grid grid-cols-2 gap-3">
          <PixelButton
            variant="primary"
            className="w-full"
            onClick={attack}
            disabled={!playerTurn || enemyHp <= 0 || gameData.hp <= 0}
          >
            АТАКА
          </PixelButton>
          
          <PixelButton
            variant="secondary"
            className="w-full"
            onClick={heal}
            disabled={!playerTurn || !gameData.inventory.includes('Бинт')}
          >
            ЛЕЧИТЬ
          </PixelButton>
          
          <PixelButton
            variant="secondary"
            className="w-full col-span-2"
            onClick={() => setGameState('menu')}
          >
            СБЕЖАТЬ
          </PixelButton>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-[#FFD700] text-2xl text-pixelated">
            ИНВЕНТАРЬ
          </h2>
        </div>
        
        <GameCard variant="brown">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-black text-xs">
              <div>Уровень: {gameData.level}</div>
              <div>Золото: {gameData.gold}</div>
              <div>HP: {gameData.hp}/{gameData.maxHp}</div>
              <div>Путь: {gameData.alignment === 'pacifist' ? 'Пацифист' : gameData.alignment === 'genocide' ? 'Геноцид' : 'Нейтрал'}</div>
            </div>
            
            <div className="border-t-2 border-[#8B4513] pt-3">
              <p className="text-[#FFD700] text-xs mb-2">Предметы:</p>
              <div className="space-y-1">
                {gameData.inventory.length === 0 ? (
                  <p className="text-black text-xs">Инвентарь пуст</p>
                ) : (
                  gameData.inventory.map((item, index) => (
                    <div key={index} className="text-black text-xs flex items-center gap-2">
                      <Icon name="Package" size={12} />
                      {item}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </GameCard>
        
        <div className="grid grid-cols-2 gap-3">
          <PixelButton
            variant="primary"
            onClick={saveGame}
          >
            СОХРАНИТЬ
          </PixelButton>
          <PixelButton
            variant="secondary"
            onClick={() => setGameState('menu')}
          >
            НАЗАД
          </PixelButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'dialogue' && renderDialogue()}
      {gameState === 'battle' && renderBattle()}
      {gameState === 'inventory' && renderInventory()}
    </>
  );
}
