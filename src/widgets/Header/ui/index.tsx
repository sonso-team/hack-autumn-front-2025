import { useAppSelector } from '@/shared/lib/hooks/useAppSelector';
import { icons } from '@/shared/lib/icons';
import { Button } from '@/shared/ui/Button';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './header.scss';

const Header = () => {
  const { user } = useAppSelector(state => state.authReducer);
  const navigate = useNavigate();

  return (
    <header className="header">
      <img className='logo'
        src={icons.logo}
        alt="" onClick={() => navigate('/')}
      />
      {user ? (
        <Button onClick={() => navigate('/profile')} className='acc-butt'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <UserRound size={20} fill='#fff' stroke='#fff' />
            Аккаунт
          </div>
        </Button>
      ) : (<Button onClick={() => navigate('/auth/login')}>Войти в систему</Button>)}
      
    </header>
  );
};

export default Header;
