const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-8 mb-6">
      <div className="flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="maidenName"
          placeholder="Отчество"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="age"
          placeholder="Возраст"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <select
          name="gender"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        >
          <option value="">Все</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          name="phone"
          placeholder="Телефон"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="address.city"
          placeholder="Город"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
        <input
          type="text"
          name="address.country"
          placeholder="Страна"
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[120px]"
        />
      </div>
    </div>
  );
};

export default Filters;