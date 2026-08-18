// src/pages/submissions/SubmissionsPage.tsx
import './submissionsPage.css';
import { Submissions } from '../../components/submissions/Submissions';

const SubmissionsPage: React.FC = () => {
  return (
    <div className="submissions_page_container" style={{ width: '100%' }}>
      <Submissions />
    </div>
  );
};

export default SubmissionsPage;