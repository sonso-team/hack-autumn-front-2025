import { useNavigate } from 'react-router-dom';
import { icons } from '../../../shared/lib/icons';
import { Button } from '../../../shared/ui/Button';
import { Paragraph } from '../../../shared/ui/Paragraph';
import './conferenceFooter.scss';

const ConferenceFooter = ({
  camToggle,
  micToggle,
  camOn,
  micOn,
  onEndCall,
  onParticipantsOpen, // новый пропс для окончания конференции
}: {
  camToggle: () => void;
  micToggle: () => void;
  camOn: boolean;
  micOn: boolean;
  onEndCall: () => void;
  onParticipantsOpen: () => void;
}) => {
  const navigate = useNavigate();

  const handleEndCall = () => {
    if (onEndCall) {
      onEndCall();
    } // вызываем очистку конференции
    navigate('/'); // переходим на домашнюю страницу
  };

  return (
    <footer className="conferenceFooter">
      <div className="conferenceFooter__leftSide">
        <Button
          onClick={camToggle}
          color="gray"
        >
          <img
            src={camOn ? icons.cam : icons.camOn}
            alt=""
          />
        </Button>
        <Button
          onClick={micToggle}
          color="gray"
        >
          <img
            src={micOn ? icons.micro : icons.microOn}
            alt=""
          />
        </Button>
      </div>
      <div className="conferenceFooter__rightSide">
        <Button
          onClick={() => 1}
          color="gray"
          className="conferenceFooter__membersBtn"
        >
          <button onClick={onParticipantsOpen} className='parts'>
            <img
              src={icons.members}
              alt=""
            />
            <Paragraph
              mode="white"
              level={3}
            >
              Участники
            </Paragraph>
          </button>
        </Button>
        <Button
          onClick={handleEndCall}
          color="red"
        >
          <img
            src={icons.phone}
            alt=""
          />
        </Button>
      </div>
    </footer>
  );
};

export default ConferenceFooter;
