import './profile-pic.scss';

export const ProfilePic = ({ letter }: { letter: string }) => {
  return (
    <div className="pp">
      <h3>{letter}</h3>
    </div>
  );
};
