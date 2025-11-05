import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.hero}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>AIZ</div>
        <div className={styles.links}>
          <a href="/">Trang chủ</a>
          <a href="/interview">Phỏng vấn</a>
          <a href="#">Về chúng tôi</a>
          <a href="#">Gói</a>
        </div>
        <button className={styles.cta}>Bắt đầu ngay</button>
      </nav>

      <section className={styles.content}>
        <h1>
          <span className={styles.gradient}>AIZ</span> là tiêu chuẩn mới cho{" "}
          <br /> phỏng vấn kỹ năng.
        </h1>
        <p>
          Nền tảng phỏng vấn AI thông minh giúp bạn chuẩn bị tốt nhất cho sự
          nghiệp.
        </p>

        <div className={styles.form}>
          <input type="email" placeholder="Nhập email của bạn..." />
          <button>Tham gia danh sách chờ</button>
        </div>
      </section>

      <section className={styles.preview}>
        <h2>Trải nghiệm phỏng vấn thực tế với AIZ</h2>
        <p>
          Hệ thống giả lập phỏng vấn của AIZ giúp bạn luyện tập mọi lúc, mọi
          nơi, với phản hồi chi tiết từ AI.
        </p>
        <div className={styles.mockup}>
          <img src="/interview.png" alt="Giao diện phỏng vấn giả lập" />
        </div>
      </section>
    </main>
  );
}
