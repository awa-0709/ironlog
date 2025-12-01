import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Save,
  Activity,
  History,
  Layers,
  Scale
} from 'lucide-react';

// --- 資料結構與預設資料 ---

// 定義大肌群與小肌群的結構
const MUSCLE_STRUCTURE = {
  major: {
    label: '大肌群',
    subgroups: [
      { id: 'chest', name: '胸部', color: 'bg-red-500 text-white' },
      { id: 'shoulders', name: '肩部', color: 'bg-yellow-500 text-white' },
      { id: 'back', name: '背部', color: 'bg-blue-500 text-white' },
      { id: 'legs', name: '腿部', color: 'bg-green-500 text-white' },
      { id: 'core', name: '腹部', color: 'bg-orange-500 text-white' },
    ]
  },
  minor: {
    label: '小肌群',
    subgroups: [
      { id: 'biceps', name: '二頭', color: 'bg-purple-500 text-white' },
      { id: 'triceps', name: '三頭', color: 'bg-indigo-500 text-white' },
    ]
  }
};

// 扁平化的肌群 Map 用於快速查找顏色與名稱 (用於歷史紀錄顯示)
const ALL_MUSCLE_GROUPS = [
  ...MUSCLE_STRUCTURE.major.subgroups,
  ...MUSCLE_STRUCTURE.minor.subgroups
];

const INITIAL_EXERCISES = [
  // --- 大肌群: 胸部 ---
  { 
    id: 1, 
    name: '槓鈴臥推', 
    muscle: 'chest', 
    target: '胸大肌、前三角肌、三頭肌', 
    image: '/槓推.png' 
  },
  { 
    id: 11, 
    name: '啞鈴臥推', 
    muscle: 'chest', 
    target: '胸大肌、三頭肌', 
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 12, 
    name: '上斜臥推', 
    muscle: 'chest', 
    target: '胸大肌上束、前三角肌', 
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 13, 
    name: '下斜臥推', 
    muscle: 'chest', 
    target: '胸大肌下束', 
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 14, 
    name: '器械夾胸', 
    muscle: 'chest', 
    target: '胸大肌中縫、內側', 
    image: 'https://images.unsplash.com/photo-1517963879466-e925ac69aa18?auto=format&fit=crop&w=800&q=80' 
  },
  // --- 大肌群: 背部 ---
  { 
    id: 3, 
    name: '引體向上', 
    muscle: 'back', 
    target: '背闊肌、二頭肌', 
    image: 'https://images.unsplash.com/photo-1598971639058-211a74a96ded?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 31, 
    name: '滑輪下拉', 
    muscle: 'back', 
    target: '背闊肌寬度', 
    image: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?auto=format&fit=crop&w=800&q=80',
    variants: ['寬握', '窄握']
  },
  { 
    id: 4, 
    name: '槓鈴划船', 
    muscle: 'back', 
    target: '背闊肌厚度、斜方肌', 
    image: 'https://images.unsplash.com/photo-1603287681836-e57461196278?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 41, 
    name: '坐姿划船', 
    muscle: 'back', 
    target: '中背部、菱形肌', 
    image: 'https://images.unsplash.com/photo-1598575441657-61782255476a?auto=format&fit=crop&w=800&q=80',
    variants: ['寬握', '窄握']
  },
  { 
    id: 42, 
    name: '直臂下壓', 
    muscle: 'back', 
    target: '背闊肌下部 (孤立動作)', 
    image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=800&q=80' 
  },
  // --- 大肌群: 腿部 ---
  { 
    id: 5, 
    name: '深蹲', 
    muscle: 'legs', 
    target: '股四頭肌、臀大肌', 
    image: 'https://images.unsplash.com/photo-1574680096141-1cddd32e24d7?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 6, 
    name: '硬舉', 
    muscle: 'legs', 
    target: '腿後側、下背、臀部', 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' 
  },
  // --- 大肌群: 肩部 ---
  { 
    id: 7, 
    name: '坐姿推肩', 
    muscle: 'shoulders', 
    target: '三角肌前束、中束', 
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    variants: ['啞鈴', '器械']
  },
  { 
    id: 8, 
    name: '側平舉', 
    muscle: 'shoulders', 
    target: '中三角肌', 
    image: 'https://images.unsplash.com/photo-1532029837066-805e45161d4b?auto=format&fit=crop&w=800&q=80',
    variants: ['啞鈴', '繩索']
  },
  { 
    id: 81, 
    name: '面拉', 
    muscle: 'shoulders', 
    target: '後三角肌、旋轉肌袖', 
    image: 'https://images.unsplash.com/photo-1598971639058-211a74a96ded?auto=format&fit=crop&w=800&q=80' // Reusing gym/pull image
  },
  { 
    id: 82, 
    name: '反向蝴蝶機', 
    muscle: 'shoulders', 
    target: '後三角肌', 
    image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=800&q=80' // Reusing machine image
  },
  // --- 大肌群: 腹部 (Core -> Abs) ---
  { 
    id: 10, 
    name: '棒式', 
    muscle: 'core', 
    target: '腹直肌、核心肌群', 
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' 
  },
  // --- 小肌群: 二頭 ---
  { 
    id: 901, 
    name: '牧羊凳彎舉', 
    muscle: 'biceps', 
    target: '肱二頭肌短頭 (孤立)', 
    image: 'https://images.unsplash.com/photo-1598971639058-211a74a96ded?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 902, 
    name: '坐姿啞鈴彎舉', 
    muscle: 'biceps', 
    target: '肱二頭肌長頭', 
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 903, 
    name: '繩索彎舉', 
    muscle: 'biceps', 
    target: '肱二頭肌整體 (持續張力)', 
    image: 'https://images.unsplash.com/photo-1517963879466-e925ac69aa18?auto=format&fit=crop&w=800&q=80' 
  },
  // --- 小肌群: 三頭 (新增) ---
  { 
    id: 91, 
    name: '繩索三頭下壓', 
    muscle: 'triceps', 
    target: '肱三頭肌', 
    image: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 92, 
    name: '啞鈴頸後臂屈伸', 
    muscle: 'triceps', 
    target: '肱三頭肌長頭', 
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    variants: ['雙手', '單手']
  },
];

// --- 主要 App 組件 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('workout'); // workout, history, stats
  const [exercises] = useState(INITIAL_EXERCISES);
  const [logs, setLogs] = useState([]);
  const [bodyWeights, setBodyWeights] = useState({}); // { 'YYYY-MM-DD': 70.5 }
  
  // 雙層篩選 State
  const [mainCategory, setMainCategory] = useState('major'); // 'major' or 'minor'
  const [subCategory, setSubCategory] = useState('all'); // 'all' or specific muscle id
  
  const [selectedExercise, setSelectedExercise] = useState(null);

  // 行事曆相關 State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);

  // 初始化讀取 LocalStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('ironlog_data');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    const savedBodyWeights = localStorage.getItem('ironlog_bodyweights');
    if (savedBodyWeights) {
      setBodyWeights(JSON.parse(savedBodyWeights));
    }
  }, []);

  // 儲存到 LocalStorage
  useEffect(() => {
    localStorage.setItem('ironlog_data', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ironlog_bodyweights', JSON.stringify(bodyWeights));
  }, [bodyWeights]);

  // 切換大分類時，重置子分類
  const handleMainCategoryChange = (category) => {
    setMainCategory(category);
    setSubCategory('all');
  };

  // 新增一組記錄
  const addSet = (weight, reps, variant) => {
    if (!selectedExercise) return;
    
    const newLog = {
      id: Date.now(),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      muscle: selectedExercise.muscle,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      variant: variant || null,
      date: new Date().toISOString(),
    };
    
    setLogs([newLog, ...logs]);
  };

  const deleteLog = (logId) => {
    setLogs(logs.filter(log => log.id !== logId));
  };

  const handleSaveBodyWeight = (date, weight) => {
    setBodyWeights(prev => ({
      ...prev,
      [date]: weight
    }));
  };

  // --- Helper Functions for Calendar ---
  
  const getDateKey = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  // --- 子頁面渲染 ---

  // 1. 訓練頁面 (動作列表)
  const renderWorkoutTab = () => {
    if (selectedExercise) {
      return (
        <ExerciseLogger 
          exercise={selectedExercise} 
          onBack={() => setSelectedExercise(null)}
          onSave={addSet}
          history={logs.filter(l => l.exerciseId === selectedExercise.id)}
        />
      );
    }

    // 篩選邏輯
    const currentStructure = MUSCLE_STRUCTURE[mainCategory];
    const visibleExercises = exercises.filter(ex => {
      const belongsToMainCategory = currentStructure.subgroups.some(g => g.id === ex.muscle);
      if (!belongsToMainCategory) return false;
      if (subCategory === 'all') return true;
      return ex.muscle === subCategory;
    });

    return (
      <div className="pb-24 animate-fade-in flex flex-col h-full">
        {/* 第一層：大分類切換 Tabs */}
        <div className="grid grid-cols-2 p-2 gap-2 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
          <button
            onClick={() => handleMainCategoryChange('major')}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mainCategory === 'major'
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            大肌群
          </button>
          <button
            onClick={() => handleMainCategoryChange('minor')}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mainCategory === 'minor'
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            小肌群
          </button>
        </div>

        {/* 第二層：子分類篩選 Chips */}
        <div className="flex overflow-x-auto gap-2 px-4 py-3 no-scrollbar bg-gray-50 border-b border-gray-200/50 items-center">
          <button
            onClick={() => setSubCategory('all')}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${
              subCategory === 'all' 
                ? 'bg-white border-gray-300 text-gray-800 shadow-sm' 
                : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            全部
          </button>
          {currentStructure.subgroups.map(group => (
            <button
              key={group.id}
              onClick={() => setSubCategory(group.id)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${
                subCategory === group.id 
                  ? 'bg-white border-gray-300 text-gray-800 shadow-sm ring-1 ring-gray-100' 
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* 動作列表 */}
        <div className="p-4 grid gap-4 flex-1 overflow-y-auto">
          {visibleExercises.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">此分類尚無動作</div>
          ) : (
            visibleExercises.map(exercise => {
              const muscleGroup = ALL_MUSCLE_GROUPS.find(m => m.id === exercise.muscle);
              return (
                <div 
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="group bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-4 hover:shadow-md"
                >
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                     <img 
                      src={exercise.image} 
                      alt={exercise.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Gym'; 
                      }}
                     />
                     {exercise.variants && (
                       <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 backdrop-blur-sm">
                         {exercise.variants.length} 種變體
                       </div>
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{exercise.name}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold ${muscleGroup?.color || 'bg-gray-200'}`}>
                        {muscleGroup?.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate flex-1">
                        {exercise.target}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="text-gray-300 w-5 h-5 flex-shrink-0 mr-1" />
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // 2. 歷史記錄頁面 (行事曆視圖)
  const renderHistoryTab = () => {
    // 整理 Logs：以日期字串 (YYYY-MM-DD) 為 Key
    const logsByDate = logs.reduce((acc, log) => {
      const d = new Date(log.date);
      const key = getDateKey(d);
      if (!acc[key]) acc[key] = [];
      acc[key].push(log);
      return acc;
    }, {});

    // 如果有選中日期，顯示詳細視圖
    if (selectedHistoryDate) {
      const dayLogs = logsByDate[selectedHistoryDate] || [];
      const totalVolume = dayLogs.reduce((acc, curr) => acc + (curr.weight * curr.reps), 0);
      const currentBodyWeight = bodyWeights[selectedHistoryDate] || '';

      return (
        <div className="pb-24 p-4 animate-slide-up h-full flex flex-col">
          {/* Detailed View Header */}
          <div className="flex items-center gap-3 mb-6">
             <button 
               onClick={() => setSelectedHistoryDate(null)}
               className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
             >
               <ChevronLeft className="w-5 h-5 text-gray-600" />
             </button>
             <div>
               <h2 className="text-xl font-bold text-gray-800">{selectedHistoryDate}</h2>
               <p className="text-xs text-gray-500">訓練詳細內容</p>
             </div>
          </div>

          {/* 體重記錄區塊 */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Scale className="w-5 h-5" />
               </div>
               <span className="font-bold text-gray-700">當日體重</span>
            </div>
            <div className="flex items-center gap-2">
               <input 
                  type="number" 
                  step="0.1"
                  placeholder="--"
                  className="w-20 text-right font-bold text-xl border-b border-gray-200 focus:border-blue-500 outline-none text-gray-800"
                  value={currentBodyWeight}
                  onChange={(e) => handleSaveBodyWeight(selectedHistoryDate, e.target.value)}
               />
               <span className="text-sm text-gray-400">kg</span>
            </div>
          </div>

          {/* Daily Stats */}
          {dayLogs.length > 0 && (
             <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
                <div className="text-center flex-1 border-r border-white/20">
                   <div className="text-2xl font-bold">{dayLogs.length}</div>
                   <div className="text-xs opacity-80">總組數</div>
                </div>
                <div className="text-center flex-1">
                   <div className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}k</div>
                   <div className="text-xs opacity-80">總容量 (kg)</div>
                </div>
             </div>
          )}

          {/* Log List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {dayLogs.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">當天沒有訓練紀錄</div>
            ) : (
              dayLogs.map((log, index) => (
                <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-800">{log.exerciseName}</div>
                      {log.variant && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                          {log.variant}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {ALL_MUSCLE_GROUPS.find(m => m.id === log.muscle)?.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xl font-black text-blue-600">{log.weight}</span>
                        <span className="text-xs text-gray-400">kg</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">x {log.reps} reps</div>
                    </div>
                    <button onClick={() => deleteLog(log.id)} className="text-gray-300 hover:text-red-500 p-2 -mr-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // Calendar View Logic
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    // Generate Calendar Grid
    const calendarDays = [];
    // Padding days
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`pad-${i}`} className="h-14"></div>);
    }
    // Real days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateKey = getDateKey(dateObj);
      const hasLogs = logsByDate[dateKey] && logsByDate[dateKey].length > 0;
      const isToday = getDateKey(new Date()) === dateKey;

      calendarDays.push(
        <button
          key={d}
          onClick={() => setSelectedHistoryDate(dateKey)}
          className={`h-14 rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-90 ${
            isToday 
              ? 'bg-black text-white shadow-lg shadow-gray-300' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <span className={`text-sm font-bold ${isToday ? 'text-white' : ''}`}>{d}</span>
          {hasLogs && (
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-blue-500'}`}></div>
          )}
        </button>
      );
    }

    return (
      <div className="pb-24 p-4 animate-fade-in h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 px-2">
           <h2 className="text-xl font-bold text-gray-800">
             {year}年 {month + 1}月
           </h2>
           <div className="flex gap-2">
             <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-xs font-bold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {calendarDays}
        </div>
        
        {/* Summary Info */}
        <div className="mt-6 bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex items-start gap-3">
           <History className="w-5 h-5 mt-0.5 shrink-0" />
           <div>
             <p className="font-bold mb-1">小提示</p>
             <p className="opacity-80 leading-relaxed">
               點擊有 <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mx-1"></span> 標記的日期，可以查看當天的完整訓練內容與體重記錄。
             </p>
           </div>
        </div>
      </div>
    );
  };

  // 3. 簡單統計頁面
  const renderStatsTab = () => {
    const totalSets = logs.length;
    const totalVolume = logs.reduce((acc, curr) => acc + (curr.weight * curr.reps), 0);
    
    return (
      <div className="pb-24 p-4 animate-fade-in">
        <h2 className="text-xl font-bold mb-6 text-gray-800">數據統計</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-blue-100 text-sm mb-1 font-medium">總訓練組數</div>
              <div className="text-3xl font-bold">{totalSets}</div>
              <div className="text-xs text-blue-200 mt-2">Total Sets</div>
            </div>
            <Activity className="absolute -right-2 -bottom-2 w-20 h-20 text-blue-500 opacity-20" />
          </div>
          <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-gray-400 text-sm mb-1 font-medium">累積總負重</div>
              <div className="text-3xl font-bold">{(totalVolume / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500 mt-2">Kg Volume</div>
            </div>
            <Dumbbell className="absolute -right-2 -bottom-2 w-20 h-20 text-gray-700 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            肌群訓練分佈
          </h3>
          <div className="space-y-4">
            {ALL_MUSCLE_GROUPS.map(group => {
              const count = logs.filter(l => l.muscle === group.id).length;
              const percentage = totalSets === 0 ? 0 : Math.round((count / totalSets) * 100);
              
              if (percentage === 0) return null; // 只顯示有練過的

              return (
                <div key={group.id}>
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-gray-700">{group.name}</span>
                    <span className="text-gray-500">{count} 組 ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${group.color.split(' ')[0]}`} 
                      style={{ width: `${percentage}%` }} 
                    ></div>
                  </div>
                </div>
              );
            })}
             {totalSets === 0 && <p className="text-sm text-gray-400 text-center py-4">尚無數據</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* 頂部導航 */}
      {!selectedExercise && (
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold italic">I</div>
            <h1 className="font-bold text-xl tracking-tight text-gray-900">IronLog</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      )}

      {/* 主要內容區 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'workout' && renderWorkoutTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'stats' && renderStatsTab()}
      </div>

      {/* 底部導航欄 */}
      {!selectedExercise && (
        <div className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md flex justify-around items-center p-2 pb-safe z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
          <NavBtn 
            active={activeTab === 'workout'} 
            onClick={() => setActiveTab('workout')} 
            icon={<Dumbbell className="w-6 h-6" />} 
            label="訓練" 
          />
          <NavBtn 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<Calendar className="w-6 h-6" />} 
            label="記錄" 
          />
          <NavBtn 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<TrendingUp className="w-6 h-6" />} 
            label="統計" 
          />
        </div>
      )}
    </div>
  );
}

// --- 子組件 ---

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 ${
        active ? 'text-blue-600 scale-105' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {React.cloneElement(icon, { 
        className: `w-6 h-6 ${active ? 'fill-current' : ''}` 
      })}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}

function ExerciseLogger({ exercise, onBack, onSave, history }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [variant, setVariant] = useState(exercise.variants ? exercise.variants[0] : null);
  const [isSaved, setIsSaved] = useState(false);

  // 當動作改變時，重置變體
  useEffect(() => {
    if (exercise.variants) {
      setVariant(exercise.variants[0]);
    } else {
      setVariant(null);
    }
  }, [exercise]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!weight || !reps) return;
    onSave(weight, reps, variant);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    setReps(''); 
  };

  const maxWeight = history.length > 0 ? Math.max(...history.map(h => h.weight)) : 0;

  return (
    <div className="h-full flex flex-col bg-white animate-slide-up relative">
      {/* 沉浸式 Header 圖片 */}
      <div className="relative h-48 w-full bg-gray-900">
         <img 
            src={exercise.image} 
            alt={exercise.name} 
            className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
         
         <button 
            onClick={onBack} 
            className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-colors"
         >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
         </button>

         <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="font-bold text-3xl mb-1">{exercise.name}</h2>
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-bold">
                    {ALL_MUSCLE_GROUPS.find(m => m.id === exercise.muscle)?.name}
                </span>
                <p className="text-sm text-gray-300 opacity-90">{exercise.target}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 -mt-4 rounded-t-3xl relative z-10">
        
        {/* 變體選擇器 (如果有) */}
        {exercise.variants && (
          <div className="flex justify-center gap-2 mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm w-fit mx-auto">
            {exercise.variants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  variant === v 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* 輸入區塊 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">重量 (kg)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-4xl font-black p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-800"
                  autoFocus
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">次數 (Reps)</label>
                <input 
                  type="number" 
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-4xl font-black p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-800"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isSaved 
                  ? 'bg-green-500 text-white ring-4 ring-green-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isSaved ? (
                <>
                  <Save className="w-5 h-5" /> 已記錄
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> 
                  {variant ? `新增 (${variant})` : '新增組數'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* 今日記錄列表 */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex justify-between items-center px-1">
            <span>今日訓練</span>
            {maxWeight > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">PR: {maxWeight}kg</span>}
          </h3>
          
          <div className="space-y-2">
            {history.filter(h => new Date(h.date).toDateString() === new Date().toDateString()).length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                還沒開始，加油！
              </div>
            ) : (
              history
                .filter(h => new Date(h.date).toDateString() === new Date().toDateString())
                .sort((a, b) => b.id - a.id)
                .map((log, idx) => (
                <div key={log.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-500 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                      {history.filter(h => new Date(h.date).toDateString() === new Date().toDateString()).length - idx}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-gray-800 text-lg leading-none">
                        <span className="font-black">{log.weight}</span> 
                        <span className="text-xs text-gray-400 mx-1">kg</span> 
                        <span className="text-gray-300">×</span> 
                        <span className="font-black">{log.reps}</span>
                      </span>
                      {log.variant && (
                        <span className="text-[10px] text-blue-600 font-bold mt-1 bg-blue-50 px-1.5 py-0.5 rounded w-fit">
                          {log.variant}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">剛剛</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}