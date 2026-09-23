import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, FileText, FolderGit2, Settings, ShieldCheck, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/intake', label: 'Start Intake', icon: PlusCircle },
    { path: '/documents', label: 'Document Review', icon: FileText },
    { path: '/cases', label: 'My Cases', icon: FolderGit2 },
    { path: '/settings', label: 'Account & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link
          to="/"
          id="nav-brand-link"
          className="flex items-center gap-3 text-slate-900 transition-opacity hover:opacity-90 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-base font-semibold tracking-tight text-slate-900">
              Rights & Remedy Navigator
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Legal Information & Action Framework
            </span>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              item.path === '/intake'
                ? location.pathname.startsWith('/intake')
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                id={`nav-link-${item.path.replace('/', '')}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account / Auth Indicator */}
        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            id="nav-user-profile-badge"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            title={user?.email || 'Active session'}
            aria-label={`User account: ${user?.email || 'Active session'}`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="max-w-[130px] truncate font-medium sm:inline">
              {user?.displayName || user?.email?.split('@')[0] || 'Client Session'}
            </span>
            <span className="hidden sm:inline-block rounded-xs bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {user?.provider === 'firebase' ? 'Firebase' : 'Secure'}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Bar with WCAG 44px touch targets */}
      <nav aria-label="Mobile Navigation" className="flex md:hidden border-t border-slate-100 bg-slate-50/95 px-2 py-1 justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 text-[11px] font-medium rounded-md transition-colors ${
                isActive ? 'text-slate-900 font-bold bg-slate-200/60' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 mb-0.5" aria-hidden="true" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
