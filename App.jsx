import { useState, useRef, useEffect } from "react";

export default function TwitterWorthArabic() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const canvasRef = useRef(null);
  const [preview, setPreview] = useState("");

  const estimateValue = () => {
    if (!username.trim()) return;
    const fakePrice = (Math.random() * 1000 + 100).toFixed(2);
    const image = `https://unavatar.io/twitter/${username}`;
    setProfile({ username, image, price: fakePrice });
  };

  const generateImage = async () => {
    if (!canvasRef.current || !profile) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;

    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = profile.image;
    img.onload = () => {
      ctx.drawImage(img, 250, 40, 100, 100);
      ctx.fillStyle = "#111";
      ctx.font = "bold 26px 'SF Arabic', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`@${profile.username}`, 300, 180);
      ctx.font = "bold 30px 'SF Arabic', sans-serif";
      ctx.fillStyle = "#1DA1F2";
      ctx.fillText(`$${profile.price}`, 300, 220);
      ctx.fillStyle = "#888";
      ctx.font = "bold 18px 'SF Arabic', sans-serif";
      ctx.fillText("تم الإنشاء بواسطة مروان الدرويش", 300, 350);
      setPreview(canvas.toDataURL());
    };
  };

  useEffect(() => {
    if (profile) {
      generateImage();
    }
  }, [profile]);

  const shareImageOnX = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const file = new File([blob], `${profile.username}_value.png`, { type: "image/png" });
      const data = new FormData();
      data.append("file", file);
      const tweetText = `📊 قيمة حسابي على تويتر @${profile.username} هي $${profile.price}!
جرب الأداة الآن👇`;
      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(url, "_blank");
    });
  };

  return (
    <main style={{ fontFamily: "'SF Arabic', sans-serif", direction: "rtl", textAlign: "center", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>كم يساوي حسابك على تويتر؟</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="ادخل اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, width: "60%", marginRight: 10 }}
        />
        <button onClick={estimateValue} style={{ padding: 10 }}>احسب</button>
      </div>

      {profile && (
        <>
          <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 10, maxWidth: 400, margin: "0 auto" }}>
            <img
              src={profile.image}
              alt={profile.username}
              style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 10 }}
            />
            <h2>@{profile.username}</h2>
            <p style={{ fontSize: 18 }}>السعر التقريبي: <strong>${profile.price}</strong></p>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          {preview && (
            <div style={{ marginTop: 20 }}>
              <img src={preview} alt="preview" style={{ borderRadius: 10, boxShadow: "0 0 10px rgba(0,0,0,0.2)", width: 300 }} />
            </div>
          )}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const link = document.createElement("a");
              link.download = `${profile.username}_value.png`;
              link.href = canvasRef.current.toDataURL();
              link.click();
            }}
            style={{ display: "block", marginTop: 15, color: "#1DA1F2" }}
          >
            تحميل الصورة
          </a>

          <button onClick={shareImageOnX} style={{ marginTop: 10, backgroundColor: "#1DA1F2", color: "white", padding: "10px 20px", borderRadius: 5, border: "none" }}>
            مشاركة الصورة على X
          </button>
        </>
      )}

      <footer style={{ marginTop: 50, fontSize: 14, color: "#555" }}>
        <p>تم الإنشاء بواسطة <strong>مروان الدرويش</strong></p>
        <a href="https://x.com/marwanaldarwic1" target="_blank" rel="noopener noreferrer" style={{ color: "#1DA1F2" }}>
          تابعني على X
        </a>
        <br />
        <a
          href="https://x.com/intent/tweet?text=📊%20اكتشف%20كم%20يساوي%20حسابك%20على%20تويتر!%20جرب%20الأداة%20الآن%20👇"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: 15, padding: "10px 20px", backgroundColor: "#1DA1F2", color: "white", borderRadius: 5 }}
        >
          شارك النتيجة على X
        </a>
      </footer>
    </main>
  );
}
