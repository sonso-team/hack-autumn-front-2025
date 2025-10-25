import { icons } from '@/shared/lib/icons';
import { Button } from '@/shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import './header.scss';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <img className='logo'
        src={icons.logo}
        alt="" onClick={() => navigate('/')}
      />
      <Button onClick={() => navigate('/auth/login')}>Войти в систему</Button>
    </header>
  );
};

export default Header;
