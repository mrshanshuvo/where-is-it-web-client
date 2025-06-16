import { Link } from 'react-router';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

// Mock data - replace with your actual data from API
const latestItems = [
  {
    id: '1',
    type: 'lost',
    title: 'Lost Wallet',
    description: 'Black leather wallet containing ID and credit cards',
    date: '2023-06-15',
    location: 'Downtown Coffee Shop',
    image: 'https://images.unsplash.com/photo-1551806235-6693b8a5bba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    type: 'found',
    title: 'Found Smartphone',
    description: 'iPhone 13 Pro with blue case found near Central Park',
    date: '2023-06-14',
    location: 'Central Park Bench',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1367&q=80'
  },
  {
    id: '3',
    type: 'lost',
    title: 'Lost Keys',
    description: 'Set of car and house keys with blue keychain',
    date: '2023-06-14',
    location: 'Main Street Bus Stop',
    image: 'https://images.unsplash.com/photo-1593891128927-376fd5a7d75e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '4',
    type: 'found',
    title: 'Found Backpack',
    description: 'Black Jansport backpack with textbooks inside',
    date: '2023-06-13',
    location: 'University Library',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  },
  {
    id: '5',
    type: 'lost',
    title: 'Lost Watch',
    description: 'Silver Rolex watch with black leather strap',
    date: '2023-06-12',
    location: 'Fitness Center',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
  },
  {
    id: '6',
    type: 'found',
    title: 'Found Dog',
    description: 'Golden Retriever with red collar found near the river',
    date: '2023-06-11',
    location: 'Riverside Park',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  }
];

const LatestItemsSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Lost & Found Items</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {item.type === 'lost' ? 'Lost' : 'Found'}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center text-gray-500 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{item.location}</span>
                </div>

                <Link
                  to={`/items/${item.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaInfoCircle className="mr-2" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/items"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            See All Lost & Found Items
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestItemsSection;