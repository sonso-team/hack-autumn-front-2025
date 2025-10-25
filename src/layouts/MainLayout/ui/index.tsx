import { Outlet } from 'react-router-dom';
import Header from '../../../widgets/Header/ui';
import './mainLayout.scss';
import type { InputRef } from '../../../shared/ui/Input';
import { Input } from '@/shared/ui/Input';
import { useRef } from 'react';

const MainLayout = () => {
  const inpRef = useRef<InputRef>(null);

  return (
    <div className="MainLayout">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
