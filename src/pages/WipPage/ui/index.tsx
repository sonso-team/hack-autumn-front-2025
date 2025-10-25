import type React from 'react';
import './wip-page.scss';
import { useNavigate } from 'react-router';
import { icons } from '@/shared/lib/icons';
import { Heading } from '@/shared/ui/Heading';
import { Button } from '@/shared/ui/Button';

const WipPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="WipPage">
      <img
        className="WipIcon"
        src={icons.wip}
        alt="Work in Progress"
      />
      <Heading level={1}>Страница находится в разработке</Heading>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </main>
  );
};

export default WipPage;
