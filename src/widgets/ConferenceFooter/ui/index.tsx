// ConferenceFooter.tsx
import { Button } from '../../../shared/ui/Button';
import { icons } from '../../../shared/lib/icons';
import './conferenceFooter.scss';
import { Paragraph } from '../../../shared/ui/Paragraph';
import { useNavigate } from 'react-router';

const ConferenceFooter = ({
  camToggle,
  micToggle,
  camOn,
  micOn,
  onEndCall,
  onToggleChat,
}: {
  camToggle: () => void;
  micToggle: () => void;
  camOn: boolean;
  micOn: boolean;
  onEndCall: () => void;
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
