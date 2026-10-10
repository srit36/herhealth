'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { navGroups } from '@/lib/nav';
import { CURRENT_USER, TODAY_LABEL } from '@/mock/today';

function isActive(pathname: string, route: string) {
  return route === '/'
    ? pathname === '/'
    : pathname === route || pathname.startsWith(`${route}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          {!collapsed && <div className="brand-name">HERHEALTH</div>}
        </div>

        <nav className="nav">
          {navGroups.map((group, groupIndex) => (
            <div className="nav-group" key={group.label ?? 'primary'}>
              {group.label && !collapsed && (
                <div className="nav-label">{group.label}</div>
              )}
              {group.label && collapsed && groupIndex > 1 && (
                <div className="nav-divider" />
              )}
              {group.items.map((item) => (
                <Link
                  href={item.route}
                  className={`nav-item ${isActive(pathname, item.route) ? 'active' : ''} ${item.label.length > 24 ? 'long' : ''}`}
                  key={item.label}
                  aria-label={item.label}
                  aria-current={
                    isActive(pathname, item.route) ? 'page' : undefined
                  }
                  data-tooltip={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link
            href="/settings"
            className={`nav-item ${isActive(pathname, '/settings') ? 'active' : ''}`}
            aria-label="Settings"
            data-tooltip={collapsed ? 'Settings' : undefined}
          >
            <Icon name="settings" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            type="button"
            className="collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            data-tooltip={collapsed ? 'Expand sidebar' : undefined}
          >
            <Icon name="collapse" />
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="date-pill">
            <Icon name="calendar" size={17} />
            <span>{TODAY_LABEL}</span>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              <Icon name="bell" size={19} />
              <span className="notification-dot" />
            </button>
            <div className="profile">
              <div className="avatar">{CURRENT_USER.initials}</div>
              <div>
                <div className="profile-name">{CURRENT_USER.name}</div>
                <div className="profile-caption">{CURRENT_USER.caption}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
