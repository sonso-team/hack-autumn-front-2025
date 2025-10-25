import type React from 'react';
import './not-found-page.scss';
import { useNavigate } from 'react-router';
import { icons } from '@/shared/lib/icons';
import { Heading } from '@/shared/ui/Heading';
import { Button } from '@/shared/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="NotFoundPage">
      <img
        className="NotFoundIcon"
        src={icons.notFound}
        alt="Not Found"
      />
      <Heading level={1}>Страница отсутствует или была перемещена</Heading>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </main>
  );
};

export default NotFoundPage;
