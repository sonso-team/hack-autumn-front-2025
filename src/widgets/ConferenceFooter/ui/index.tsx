import { MonitorUp, MonitorX } from 'lucide-react';
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
  onParticipantsOpen,
  screenOn,
  toggleScreen,
  onToggleChat, // новый пропс для окончания конференции
}: {
  camToggle: () => void;
  micToggle: () => void;
  camOn: boolean;
  micOn: boolean;
  onEndCall: () => void;
  onParticipantsOpen: () => void;
  screenOn: boolean;
  toggleScreen: () => void;
  onToggleChat: () => void;
}) => {
  const navigate = useNavigate();

  const handleEndCall = () => {
    if (onEndCall) {
      onEndCall();
    }
    navigate('/');
  };

  const handleToggleChat = () => {
    onToggleChat();
  };

  return (
    <footer className="conferenceFooter">
      <div className="conferenceFooter__leftSide">
        <Button
          onClick={camToggle}
          color="gray"
        >
          <img
            src={camOn ? icons.camOn : icons.cam}
            alt=""
          />
        </Button>
        <Button
          onClick={micToggle}
          color="gray"
        >
          <img
            src={micOn ? icons.microOn : icons.micro}
            alt=""
          />
        </Button>
      </div>
      <div className="conferenceFooter__rightSide">
        <Button
          onClick={toggleScreen}
          color="gray"
        >
          {screenOn ? (
            <div className="str-but">
              <MonitorX color="#fff" />
              <Paragraph
                mode="white"
                level={3}
              >
                Прекратить демонстрацию
              </Paragraph>
            </div>
          ) : (
            <div className="str-but">
              <MonitorUp color="#fff" />
              <Paragraph
                mode="white"
                level={3}
              >
                Демонстрация экрана
              </Paragraph>
            </div>
          )}
        </Button>
        <Button
          onClick={toggleScreen}
          color="gray"
        >
          {screenOn ? (
            <div className="str-but">
              <MonitorX color="#fff" />
              <Paragraph
                mode="white"
                level={3}
              >
                Прекратить демонстрацию
              </Paragraph>
            </div>
          ) : (
            <div className="str-but">
              <MonitorUp color="#fff" />
              <Paragraph
                mode="white"
                level={3}
              >
                Демонстрация экрана
              </Paragraph>
            </div>
          )}
        </Button>
        <Button
          onClick={handleToggleChat}
          color="gray"
        >
          <button
            onClick={onParticipantsOpen}
            className="parts"
          >
            <img
              src={icons.chat}
              alt=""
            />
            <Paragraph
              mode="white"
              level={3}
            >
              Чат
            </Paragraph>
          </button>
        </Button>

        <Button
          onClick={handleToggleChat}
          color="gray"
        >
          <>
            <img
              src={icons.chat}
              alt=""
            />
            <Paragraph
              mode="white"
              level={3}
            >
              Чат
            </Paragraph>
          </>
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
