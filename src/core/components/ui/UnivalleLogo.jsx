import logo from '@core/imgs/univallelogo.jpg';

export function Logo({ className = ""}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logo} 
        alt="Universidad del Valle" 
        className="w-12 h-12 flex-shrink-0"
      />
      <div>
        <h1 className="text-xl font-bold text-gray-900">Clean Valle</h1>
        <p className="text-xs text-gray-600">Universidad del Valle</p>
      </div>
    </div>
  );
}