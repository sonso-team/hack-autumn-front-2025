import { Button } from '../../../shared/ui/Button';
import { icons } from '../../../shared/lib/icons';
import './conferenceFooter.scss';
import { Paragraph } from '../../../shared/ui/Paragraph';

const ConferenceFooter = () => {
  return (
    <footer className="conferenceFooter">
      <div className="conferenceFooter__leftSide">
        <Button
          onClick={() => 1}
          color="gray"
        >
          <img
            src={icons.cam}
            alt=""
          />
        </Button>
        <Button
          onClick={() => 1}
          color="gray"
        >
          <img
            src={icons.micro}
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
