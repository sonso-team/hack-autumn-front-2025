import { Button } from '../../../shared/ui/Button';
import { icons } from '../../../shared/lib/icons';
import './conferenceFooter.scss';
import { Paragraph } from '../../../shared/ui/Paragraph';

const ConferenceFooter = ({
  camToggle,
  micToggle,
  camOn,
  micOn,
}: {
  camToggle: () => void;
  micToggle: () => void;
  camOn: boolean;
  micOn: boolean;
}) => {
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
          <>
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
          </>
        </Button>
        <Button
          onClick={() => 1}
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
