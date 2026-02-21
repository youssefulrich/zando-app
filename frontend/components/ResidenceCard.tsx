import { useRouter } from "next/navigation";

interface ResidenceCardProps {
  residence: {
    id: number;
    title: string;
    city: string;
    neighborhood: string;
    type: string;
    price_per_night: number;
    bedrooms: number;
    bathrooms: number;
    capacity: number;
    rating_average: number;
    reviews_count: number;
    images?: Array<{ image: string; is_primary: boolean }>;
    has_wifi: boolean;
    has_ac: boolean;
    has_pool: boolean;
    has_parking: boolean;
  };
}

export default function ResidenceCard({ residence }: ResidenceCardProps) {
  const router = useRouter();

  const primaryImage = residence.images?.find((img) => img.is_primary)?.image 
    || residence.images?.[0]?.image 
    || "/placeholder-residence.jpg";

  const handleClick = () => {
    router.push(`/residences/${residence.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={primaryImage}
          alt={residence.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-residence.jpg";
          }}
        />
        
        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-md">
            {residence.type}
          </span>
        </div>

        {/* Bouton favori */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Ajouter aux favoris
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          ❤️
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et localisation */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
          {residence.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          📍 {residence.neighborhood}, {residence.city}
        </p>

        {/* Caractéristiques */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>🛏️ {residence.bedrooms} ch.</span>
          <span>🚿 {residence.bathrooms} sdb</span>
          <span>👥 {residence.capacity} pers.</span>
        </div>

        {/* Équipements */}
        <div className="flex gap-2 mb-3">
          {residence.has_wifi && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">WiFi</span>}
          {residence.has_ac && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Clim</span>}
          {residence.has_pool && <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Piscine</span>}
          {residence.has_parking && <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Parking</span>}
        </div>

        {/* Note et prix */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-gray-900">
              {residence.rating_average > 0 ? residence.rating_average.toFixed(1) : "Nouveau"}
            </span>
            {residence.reviews_count > 0 && (
              <span className="text-gray-500 text-sm">
                ({residence.reviews_count})
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-orange-600">
              {residence.price_per_night.toLocaleString()} FCFA
            </p>
            <p className="text-xs text-gray-500">par nuit</p>
          </div>
        </div>
      </div>
    </div>
  );
}