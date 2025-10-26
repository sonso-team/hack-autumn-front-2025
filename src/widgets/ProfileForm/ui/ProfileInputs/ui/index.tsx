import { logout } from "@/entities/session";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch";
import { useModal } from "@/shared/lib/hooks/useModal";
import type { ModalConfigI } from '@/shared/types/modal';
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Paragraph } from "@/shared/ui/Paragraph";
import { DeleteAccountModal } from "@/widgets/ProfileForm/DeleteAccountModal";
import { useNavigate } from "react-router-dom";

export const ProfileInputs = ({ setPasswords }: { setPasswords: () => void }) => {
  const dispatch = useAppDispatch();
  const modalConfig: ModalConfigI = {
    title: 'Вы уверены, что хотите удалить аккаунт?',
    isPopup: true,
    primaryText: 'Удалить',
    secondaryText: 'Отмена',
    closeOutside: true,
    body: <div className="modalBody"></div>,
  };
  const navigate = useNavigate();
  const modal = useModal();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <DeleteAccountModal />

      <section className="ProfileCard ProfileCard--light">
        <header className="ProfileCard__header">
          <h3 className="ProfileCard__title">Настройки профиля</h3>
          <p className="ProfileCard__subtitle">
            Обновите имя, почту и пароль. Дополнительные действия ниже.
          </p>
        </header>

        <div className="inputs-buttons">
          <div className="ProfileInputs">
            <Input initialValue="" name="username" placeholder="Имя пользователя" />
            <Input initialValue="" name="email" placeholder="Электронная почта" />
            <Input initialValue="" name="password" placeholder="Пароль" type="password" />
          </div>

          {/* ссылки-экшены */}
          <div className="LinkActions">
            <Paragraph level={4}>
              <button className="linkbtn linkbtn--primary" onClick={setPasswords}>
                Изменить пароль
              </button>
            </Paragraph>
            <Paragraph level={4}>
              <button
                className="linkbtn linkbtn--danger"
                onClick={() => modal.showModal(modalConfig)}
              >
                Удалить аккаунт
              </button>
            </Paragraph>
            <Paragraph level={4}>
              <button className="linkbtn linkbtn--muted" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </Paragraph>
          </div>

          <div className="buttons">
            <Button style="primary" onClick={() => {}}>Сохранить</Button>
            <Button style="secondary" onClick={() => navigate('/')}>Назад</Button>
          </div>
        </div>
      </section>
    </>
  );
};