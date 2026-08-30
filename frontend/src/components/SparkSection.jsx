import { useState } from 'react';
import './SparkSection.css';

function SparkSection() {
  const [imgError, setImgError] = useState(false);

  if (imgError) return null;

  return (
    <section className="spark-section">
      <div className="spark-inner">
        <div className="spark-image-wrapper">
          <img
            src="/spark-infographic.png"
            alt="SPARK - Our Word, Our Promise | Satara Polytechnic, Satara"
            className="spark-image"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    </section>
  );
}

export default SparkSection;
