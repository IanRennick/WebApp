// src/pages/speakings/SpeakingsPage.tsx
import { Speakings } from '../../components/speakings/Speakings';
import './speakingsPage.css';

const SpeakingsPage: React.FC = () => {
  return (
    <div className="speakings_page_container" style={{ width: '100%' }}>
      <Speakings />
    </div>
  );
};

export default SpeakingsPage;