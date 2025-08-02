import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // 시뮬레이션된 업로드 진행률
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          alert('사진 업로드가 완료되었습니다!');
          navigate('/');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <button className="home-button" onClick={handleGoHome}>
            ← 홈으로
          </button>
          <h1>사진 업로드</h1>
        </div>

        <div className="upload-content">
          <div className="upload-area">
            <div className="upload-box">
              <div className="upload-icon">📸</div>
              <h3>사진을 선택하세요</h3>
              <p>JPG, PNG, GIF 파일을 지원합니다</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                파일 선택하기
              </label>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>선택된 파일 ({selectedFiles.length}개)</h3>
              <div className="file-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <div className="file-preview">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="preview-image"
                        />
                      </div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      className="remove-file"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>업로드 중... {uploadProgress}%</p>
            </div>
          )}

          <div className="upload-actions">
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? '업로드 중...' : '업로드하기'}
            </button>
          </div>
        </div>

        <div className="upload-tips">
          <h3>💡 업로드 팁</h3>
          <ul>
            <li>고화질 사진을 사용하면 더 선명한 카드를 만들 수 있습니다</li>
            <li>가로세로 비율이 비슷한 사진을 사용하는 것을 권장합니다</li>
            <li>한 번에 최대 20장까지 업로드할 수 있습니다</li>
            <li>파일 크기는 각각 10MB 이하로 제한됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadPage; 