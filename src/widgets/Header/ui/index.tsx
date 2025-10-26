import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery';
import { icons } from '@/shared/lib/icons';
import { Button } from '@/shared/ui/Button';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './header.scss';

const Header = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 800px)');
  return (
    <header className="header">
      <img
        className="logo"
        src={icons.logo}
        alt=""
        onClick={() => navigate('/')}
      />
      {user ? (
        <Button
          onClick={() => navigate('/profile')}
          className="acc-butt"
        >
          {isDesktop ? <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
            }}
          >
            <UserRound
              size={20}
              fill="#fff"
              stroke="#fff"
            />
            Аккаунт
          </div> : <UserRound
              size={20}
              fill="#fff"
              stroke="#fff"
            />}
          
        </Button>
      ) : (
        <Button onClick={() => navigate('/auth/login')}>Войти в систему</Button>
      )}
    </header>
  );
};

export default Header;
