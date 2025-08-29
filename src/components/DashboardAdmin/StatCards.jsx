import { Users, HandCoins, Building, FileText } from 'lucide-react';
import { statCardsData } from '../../data/dummyData';

function StatCards() {
  // Map icon name to component
  const iconMap = {
    Users: <Users size={24} />,
    HandCoins: <HandCoins size={24} />,
    Building: <Building size={24} />,
    FileText: <FileText size={24} />
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCardsData.map((card, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
          </div>
          <div 
            className="p-3 rounded-full" 
            style={{ backgroundColor: `${card.color}20` }} // 20% opacity of the color
          >
            <div className="text-white" style={{ color: card.color }}>
              {iconMap[card.icon]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;