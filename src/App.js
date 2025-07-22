import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import Filters from './components/Filters';
import Modal from './components/Modal';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [filters, setFilters] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const fetchData = async (url, errorMessage = 'Ошибка загрузки данных') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`${errorMessage} (статус: ${response.status})`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (forceError = false) => {
    const url = forceError 
      ? 'https://dummyjson.com/nonexistent-route'
      : 'https://dummyjson.com/users';
    
    const data = await fetchData(url, 'Не удалось загрузить пользователей');
    if (data) setUsers(data.users || []);
  };

  // Тестовая функция для генерации ошибки
  const triggerTestError = () => {
    loadUsers(true);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRowClick = (user, event) => {
    setSelectedUser(user);
    const clickX = event?.clientX || window.innerWidth / 2;
    const clickY = event?.clientY || window.innerHeight / 2;
    setClickPosition({ 
      x: Math.min(clickX, window.innerWidth - 400),
      y: Math.min(clickY, window.innerHeight - 500)
    });
  };

  const getProcessedUsers = () => {
    let result = [...users];
    
    // Сортировка
    if (sortConfig.direction !== 'none') {
      result.sort((a, b) => {
        const getNestedValue = (obj, path) => path.split('.').reduce((o, p) => o?.[p], obj);

        const aValue = sortConfig.key.includes('.') 
          ? getNestedValue(a, sortConfig.key)
          : a[sortConfig.key];
          
        const bValue = sortConfig.key.includes('.') 
          ? getNestedValue(b, sortConfig.key)
          : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    // Фильтрация
    if (Object.keys(filters).length > 0) {
      result = result.filter(user => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          
          const userValue = key.includes('.') 
            ? key.split('.').reduce((o, p) => o?.[p], user)
            : user[key];
            
          if (key === 'gender') {
            return userValue.toLowerCase() === value.toLowerCase();
          }
          
          return String(userValue).toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    
    return result;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'none';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl">Загрузка данных...</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 max-w-[1400px] py-6">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
        <Filters filters={filters} setFilters={setFilters} />
        <div className="flex gap-2">
          <button
            onClick={triggerTestError}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            title="Симулировать ошибку загрузки"
          >
            Ошибка :)
          </button>
          {error && (
            <button
              onClick={() => loadUsers()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              title="Повторить запрос"
            >
              Обновить
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded animate-fadeIn">
          <p className="font-bold">Произошла ошибка</p>
          <p>{error}</p>
        </div>
      )}

      {!error && users.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p>Нет данных для отображения</p>
        </div>
      )}

      {users.length > 0 && (
        <Table 
          users={getProcessedUsers()} 
          onSort={handleSort} 
          sortConfig={sortConfig} 
          onRowClick={handleRowClick} 
        />
      )}
      
      {selectedUser && (
        <Modal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          position={clickPosition}
        />
      )}
    </div>
  );
}

export default App;