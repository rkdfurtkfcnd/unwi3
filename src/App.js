// 운위 (雲位) – AI 해석 기능 연동 + 포인트 시각화 + 감정 피드백 UI 개선

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function UnwiApp() {
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState("");
  const [points, setPoints] = useState(0);
  const [showGain, setShowGain] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const resultRef = useRef(null);

  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    birthType: "양력",
    birthLocation: "",
    gender: "",
    photo: null,
    feedback: ""
  });

  useEffect(() => {
    const savedPoints = localStorage.getItem("unwi_points");
    if (savedPoints) setPoints(parseInt(savedPoints));
  }, []);

  useEffect(() => {
    localStorage.setItem("unwi_points", points);
  }, [points]);

  useEffect(() => {
    if (showGain) {
      const timer = setTimeout(() => setShowGain(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showGain]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async () => {
    if (points < 10) {
      alert("해당 분석을 다시 보려면 10포인트가 필요합니다. 공유나 피드백으로 포인트를 얻을 수 있어요.");
    } else {
      setPoints(points - 10);
      setStep(4);

      try {
        const res = await fetch("/api/gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "당신은 전통 명리학과 풍수지리에 기반한 전문가입니다. 결과는 사용자에게 유익하고 풍부한 설명을 제공하도록 15문장 내외로 자세하게 작성해주세요."
              },
              {
                role: "user",
                content: `사람의 정보는 다음과 같습니다:\n생년월일: ${formData.birthDate}\n태어난 시간: ${formData.birthTime}\n성별: ${formData.gender}\n지역: ${formData.birthLocation}\n음력/양력: ${formData.birthType}. 이 정보를 바탕으로 사주 혹은 풍수 관점에서 해석해주세요.`
              }
            ]
          })
        });
        const data = await res.json();
        setAiResult(data.choices?.[0]?.message?.content || "AI 해석 결과를 가져오지 못했습니다.");
      } catch (error) {
        setAiResult("AI 해석 요청 중 오류가 발생했습니다.");
      }
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      alert("소중한 의견 감사합니다! (+5P)");
      setPoints(points + 5);
      setShowGain(true);
      setFeedbackText("");
    }
  };

  const watchAdForPoints = () => {
    alert("광고가 재생되었습니다. (+15P)");
    setPoints(points + 15);
    setShowGain(true);
  };

  const shareToSNS = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("나의 사주/풍수 진단 결과를 운위(雲位)에서 확인해보세요!");
    let shareUrl = "";
    if (platform === "kakao") {
      alert("카카오톡 공유는 JavaScript SDK 연동이 필요합니다.");
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "threads") {
      alert("Threads는 공식 공유 링크가 제공되지 않아, 인스타와 함께 캡처 공유 권장");
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
      setPoints(points + 5);
      setShowGain(true);
      alert("공유 감사합니다! (+5P)");
    }
  };

  const downloadResultImage = () => {
    if (!resultRef.current) return;
    html2canvas(resultRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "unwi-result.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">운위 (雲位)</h1>

      <div className="flex justify-end items-center gap-2 text-sm text-gray-500 mb-2">
        <span className="bg-yellow-300 text-black px-2 py-1 rounded-full font-semibold shadow">
          🔮 보유 포인트: {points}P
        </span>
        {showGain && <span className="text-green-600 font-bold animate-bounce">+P</span>}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-lg">당신의 자리를 운으로 채워드립니다</p>
          <p className="text-sm text-red-600">* 사주 또는 풍수 중 1가지만 무료 열람 가능하며, 포인트가 있으면 둘 다 확인할 수 있습니다.</p>

          <button onClick={() => { setFocus("성향"); setStep(2); }} className="border px-4 py-2 w-full">
            사주 보기 (성향)
          </button>
          <button onClick={() => { setFocus("운세"); setStep(2); }} className="border px-4 py-2 w-full">
            풍수 보기 (운세)
          </button>

          <p className="text-sm text-gray-500">※ 분석을 다시 보려면 10P 필요</p>
          <button onClick={watchAdForPoints} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            광고 시청하고 15P 받기
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4" ref={resultRef}>
          <h2 className="text-xl font-semibold">운위 진단 결과</h2>
          <p className="text-sm text-left whitespace-pre-wrap bg-gray-100 p-3 rounded">
            {aiResult || "AI 해석을 불러오는 중입니다..."}
          </p>

          <div className="mt-4">
            <p className="text-sm font-semibold">결과가 도움이 되었나요? 친구들과 공유해보세요! (+5P)</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button onClick={() => shareToSNS("facebook")} className="bg-blue-600 text-white px-3 py-1 rounded">페이스북</button>
              <button onClick={() => shareToSNS("twitter")} className="bg-sky-500 text-white px-3 py-1 rounded">트위터</button>
              <button onClick={() => shareToSNS("kakao")} className="bg-yellow-400 text-black px-3 py-1 rounded">카카오톡</button>
              <button onClick={() => shareToSNS("threads")} className="bg-black text-white px-3 py-1 rounded">스레드</button>
            </div>
            <button onClick={downloadResultImage} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">결과 이미지 저장</button>
          </div>

          <div className="mt-6 text-left">
            <p className="text-sm font-semibold">결과에 대한 감정은 어떤가요?</p>
            <div className="flex gap-2 mt-2">
              {["😊 좋았어요", "😐 보통이에요", "😕 아쉬워요"].map((label) => (
                <button
                  key={label}
                  className="px-3 py-1 border rounded hover:bg-gray-200"
                  onClick={() => setFeedbackText(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="자세한 의견을 들려주세요"
              className="w-full border p-2 mt-2"
            />
            <button onClick={handleFeedbackSubmit} className="mt-2 bg-gray-800 text-white px-4 py-2 rounded">의견 제출</button>
          </div>

          <div className="mt-6 text-left">
            <h3 className="text-md font-semibold">🌿 AI 추천 인테리어 예시</h3>
            <p className="text-sm text-gray-600">당신의 기운에 맞는 공간은 다음과 같습니다:</p>
            <ul className="text-sm list-disc list-inside">
              <li>밝고 따뜻한 조명, 천연 소재의 커튼</li>
              <li>나무 소재 가구와 식물 활용</li>
              <li>벽면은 흰색 또는 베이지톤 추천</li>
            </ul>
            <p className="text-xs text-gray-400">* 예시는 AI 기반 추천이며 사용자 정보에 따라 커스터마이징됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
