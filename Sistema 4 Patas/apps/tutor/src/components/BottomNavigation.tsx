import Link from 'next/link';
import { Home, Syringe, FileText, CalendarPlus, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Início', icon: Home, path: '/dashboard' },
    { name: 'Vacinas', icon: Syringe, path: '/vaccines' },
    { name: 'Agendar', icon: CalendarPlus, path: '/appointments' },
    { name: 'Histórico', icon: FileText, path: '/history' },
    { name: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard');
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-indigo-100' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-700 font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
