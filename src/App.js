import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    gender: "",
    photo: null,
    feedback: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = () => {
    setStep(3);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>운위 (雲位)</h1>

      {step === 1 && (
        <div>
          <p>당신의 사주와 공간의 기운을 알아보세요</p>
          <button onClick={() => setStep(2)}>시작하기</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div>
            생년월일: <input type="date" name="birthDate" onChange={handleChange} />
          </div>
          <div>
            태어난 시간(선택): <input type="time" name="birthTime" onChange={handleChange} />
          </div>
          <div>
            성별:
            <select name="gender" onChange={handleChange}>
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            방 사진(선택): <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </div>
          <div>
            더 알고 싶은 점:<br />
            <textarea name="feedback" onChange={handleChange}></textarea>
          </div>
          <button onClick={handleSubmit}>결과 보기</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>운위 진단 결과</h2>
          <p>당신의 사주는 안정적인 성향을 가지고 있으며...</p>
          <p>현재 방의 위치나 방향이 남서쪽이라면, 기운이 불안정할 수 있습니다.</p>
          <p>침대 방향은 북동쪽, 책상은 동쪽을 추천합니다.</p>
          <p>추천 색상: 흰색, 하늘색</p>
          <p>* 위 결과는 간단한 예시입니다. 정식 해석은 향후 고도화 예정입니다.</p>
        </div>
      )}
    </div>
  );
}
