const Modal = ({ user, onClose, position = { x: 0, y: 0 } }) => {
  if (!user) return null;

  // Рассчитываем позицию с учетом границ экрана
  const modalStyle = {
    left: `${Math.min(position.x, window.innerWidth - 400)}px`,
    top: `${Math.min(position.y, window.innerHeight - 500)}px`,
    maxWidth: '400px',
    width: '90vw'
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-start"
      onClick={onClose}
    >
      <div 
        className="absolute bg-white rounded-lg border border-gray-300 shadow-xl overflow-hidden m-4 modal-fallback"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <img 
              src={user.image} 
              alt="Аватар" 
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-bold">
                {user.lastName} {user.firstName} {user.maidenName}
              </h2>
              <p className="text-gray-600">{user.age} лет</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p><span className="font-semibold">Телефон:</span> {user.phone}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Рост:</span> {user.height} см</p>
            <p><span className="font-semibold">Вес:</span> {user.weight} кг</p>
          </div>

          <div className="bg-gray-50 p-3 rounded mb-4">
            <h3 className="font-semibold mb-1">Адрес</h3>
            <p className="text-sm">
              {user.address.address}, {user.address.city},<br />
              {user.address.state}, {user.address.postalCode},<br />
              {user.address.country}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;