import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './enter-conference.scss';

export const EnterConference = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState('');

  const join = () => {
    const raw = val.trim();
    if (!raw) {return;}
    if(raw.startsWith('http') || raw.startsWith('hack')){
        navigate(raw);
    }
    else{
        const id = raw.match(/[a-z0-9-]{6,}/i)?.[0] ?? raw;
        navigate(`/conference/${id}`);
    }
    
  };

  return (
    <div className="enterconf">
      <h2>Вход</h2>
      <Input
        name="enterRoom"
        initialValue=""
        placeholder="Идентификатор или ссылка"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
      />
      <div className="butts">
        <Button onClick={join} style="primary">Присоединиться</Button>
        <Button onClick={() => navigate(-1)} style="secondary">Назад</Button>
      </div>
    </div>
  );
};
