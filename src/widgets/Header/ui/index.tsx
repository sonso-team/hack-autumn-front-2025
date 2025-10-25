import { icons } from '@/shared/lib/icons';
import { Button } from '@/shared/ui/Button';
import './header.scss';

const Header = () => {
  return (
    <header className="header">
      <img
        src={icons.logo}
        alt=""
      />
      <Button onClick={() => 1}>Войти в систему</Button>
    </header>
  );
};

export default Header;
