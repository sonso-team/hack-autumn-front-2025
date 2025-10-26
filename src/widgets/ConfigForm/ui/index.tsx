import { useConfigForm } from '../api';
import { Button } from '../../../shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import './../../RegForm/ui/regForm.scss';
import { useModal } from '../../../shared/lib/hooks/useModal';
import React from 'react';
import { Heading } from '../../../shared/ui/Heading';

const ConfigForm = (props: {
  request: ({
    name,
    maxParticipants,
  }: {
    name: string;
    maxParticipants: number;
  }) => void;
}) => {
  const {
    isValid,
    getIsValid,
    setIsValid,
    submitHandler,
    teamNameRef,
    countRef,
  } = useConfigForm(props);
  const { hideModal } = useModal();

  return (
    <div className="RegForm Form">
      <Heading
        level={1}
        mode="bold"
      >
        Cоздать видеовстречу
      </Heading>
      <div className="Form__form">
        <div className="Form__inputs">
          <Input
            placeholder="Название команды"
            initialValue=""
            name="teamName"
            ref={teamNameRef}
            onChange={() => setIsValid(getIsValid())}
            validations={[
              {
                name: 'isEmpty',
                message: 'Введите название',
              },
            ]}
          />
          <Input
            placeholder="Количество участников"
            initialValue=""
            name="count"
            ref={countRef}
            onChange={() => setIsValid(getIsValid())}
            validations={[
              {
                name: 'isEmpty',
                message: 'Введите количество участников',
              },
              {
                name: 'isInRange',
                params: {
                  min: 2,
                  max: 30,
                },
                message: 'Количество участников должно < 30',
              },
            ]}
          />
        </div>
        <div className="Form__buttons">
          <Button
            custom
            onClick={submitHandler}
            disabled={!isValid}
            className="Form__submit"
          >
            Продолжить
          </Button>
          <Button
            custom
            style="secondary"
            onClick={hideModal}
            className="Form__submit"
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigForm;
