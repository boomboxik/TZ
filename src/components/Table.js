import React, { useState, useRef, useEffect } from 'react';
import { throttle } from 'lodash';

const Table = ({ users, onSort, sortConfig, onRowClick }) => {
  const [columnWidths, setColumnWidths] = useState(() => {
    const savedWidths = localStorage.getItem('columnWidths');
    return savedWidths ? JSON.parse(savedWidths) : {};
  });
  const [activeResizer, setActiveResizer] = useState(null);
  const tableRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const columns = [
    { key: 'lastName', label: 'Фамилия', defaultWidth: 150 },
    { key: 'firstName', label: 'Имя', defaultWidth: 150 },
    { key: 'maidenName', label: 'Отчество', defaultWidth: 150 },
    { key: 'age', label: 'Возраст', defaultWidth: 100 },
    { key: 'gender', label: 'Пол', defaultWidth: 100 },
    { key: 'phone', label: 'Телефон', defaultWidth: 180 },
    { key: 'email', label: 'Email', defaultWidth: 220 },
    { key: 'address.city', label: 'Город', defaultWidth: 150 },
    { key: 'address.country', label: 'Страна', defaultWidth: 150 }
  ];

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const startResize = (e, index) => {
    const th = tableRef.current.querySelectorAll('th')[index];
    startXRef.current = e.clientX;
    startWidthRef.current = th.offsetWidth;
    setActiveResizer(index);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResize = throttle((e) => {
    if (activeResizer === null) return;
    
    const newWidth = Math.max(50, startWidthRef.current + (e.clientX - startXRef.current));
    
    setColumnWidths(prev => ({
      ...prev,
      [columns[activeResizer].key]: newWidth
    }));
  }, 16);

  const stopResize = () => {
    setActiveResizer(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    localStorage.setItem('columnWidths', JSON.stringify(columnWidths));
  };

  useEffect(() => {
    if (activeResizer !== null) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      handleResize.cancel();
    };
  }, [activeResizer]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  };

  return (
    <div className="table-container rounded-lg border border-gray-300 shadow-sm mb-8">
      <table className="w-full" ref={tableRef}>
        <colgroup>
          {columns.map(({ key, defaultWidth }) => (
            <col 
              key={`col-${key}`}
              style={{ 
                width: columnWidths[key] || `${defaultWidth}px`,
                minWidth: '50px'
              }}
            />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            {columns.map(({ key, label }, index) => (
              <th 
                key={key}
                className="relative p-3 border-b border-r border-gray-300 hover:bg-gray-200 select-none"
              >
                <div 
                  className="flex items-center justify-between"
                  onClick={() => onSort(key)}
                >
                  <span className="truncate">{label}</span>
                  <span className="ml-2">{getSortIcon(key)}</span>
                </div>
                <div 
                  className={`absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize ${
                    activeResizer === index 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 hover:bg-blue-400'
                  }`}
                  onMouseDown={(e) => startResize(e, index)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr 
              key={user.id} 
              onClick={(e) => onRowClick(user, e)}
              className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              {columns.map(({ key }) => (
                <td 
                  key={`${user.id}-${key}`}
                  className="p-3 border-r border-gray-300 last:border-r-0 truncate"
                >
                  {key === 'gender' 
                    ? user[key] === 'male' ? 'Мужской' : 'Женский' 
                    : key.includes('.') 
                      ? getNestedValue(user, key) || '-'
                      : user[key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;