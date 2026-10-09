"use client";

import { useState } from "react";
import styles from "./page.module.css";

const initialRequests = [
  { id: "TX-1048", service: "استعلام رصيد", provider: "مزود السداد", status: "success", time: "منذ دقيقتين" },
  { id: "TX-1047", service: "تسديد رصيد", provider: "مزود السداد", status: "success", time: "منذ 5 دقائق" },
  { id: "TX-1046", service: "استعلام باقة", provider: "مزود السداد", status: "pending", time: "منذ 8 دقائق" },
  { id: "TX-1045", service: "تسديد باقة", provider: "مزود السداد", status: "failed", time: "منذ 12 دقيقة" },
];

export default function Home() {
  const [active, setActive] = useState("overview");

  const navigation = [
    { id: "overview", label: "الرئيسية", icon: "▦" },
    { id: "requests", label: "سجل الطلبات", icon: "↔" },
    { id: "connection", label: "الاتصال والمزود", icon: "◎" },
    { id: "security", label: "المصادقة والأمان", icon: "◇" },
  ];

  return (
    <main className={styles.dashboard} dir="rtl">
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>S</div>
          <div>
            <h2>STAR PROXY</h2>
            <p>بوابة الربط الذكية</p>
          </div>
        </div>

        <div className={styles.menuTitle}>القائمة الرئيسية</div>
        <nav className={styles.nav}>
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${active === item.id ? styles.active : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
              {active === item.id && <span className={styles.activeMark} />}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.helpIcon}>?</div>
          <div>
            <strong>مركز المساعدة</strong>
            <p>إدارة وسيطك بسهولة</p>
          </div>
        </div>

        <div className={styles.version}>STAR PROXY <span>الإصدار 1.0</span></div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}>
            <span>Star Proxy</span><b>/</b>
            {navigation.find((item) => item.id === active)?.label}
          </div>
          <div className={styles.profile}>
            <div className={styles.onlineDot} />
            <span>لوحة الإدارة</span>
            <div className={styles.avatar}>S</div>
          </div>
        </header>

        {active === "overview" && (
          <>
            <section className={styles.welcome}>
              <div>
                <div className={styles.eyebrow}><span /> بوابة API الخاصة بك</div>
                <h1>مرحباً بك في <span>Star Proxy</span></h1>
                <p>إدارة الاتصال وتمرير الطلبات من مكان واحد.</p>
              </div>
              <div className={styles.heroGraphic}>
<div className={`${styles.orbit} ${styles.orbitOne}`} />
<div className={`${styles.orbit} ${styles.orbitTwo}`} />                <div className={styles.heroCore}>S</div>
                <span className={styles.nodeOne}>API</span>
                <span className={styles.nodeTwo}>SECURE</span>
              </div>
            </section>

            <div className={styles.sectionHeading}>
              <div>
                <h2>نظرة عامة</h2>
                <p>ملخص حالة النظام والاتصال</p>
              </div>
              <span className={styles.demoBadge}>بيانات تجريبية</span>
            </div>

            <section className={styles.stats}>
              <article className={styles.statCard}>
                <div className={styles.statTop}><span>إجمالي الطلبات</span><div className={styles.statIcon}>↔</div></div>
                <strong>—</strong>
                <p>سيظهر العدد بعد ربط سجل الطلبات</p>
              </article>
              <article className={styles.statCard}>
                <div className={styles.statTop}><span>الطلبات الناجحة</span><div className={`${styles.statIcon} ${styles.green}`}>✓</div></div>
                <strong>—</strong>
                <p>سيتم احتسابها من الطلبات الفعلية</p>
              </article>
              <article className={styles.statCard}>
                <div className={styles.statTop}><span>الطلبات المعلقة</span><div className={`${styles.statIcon} ${styles.orange}`}>◷</div></div>
                <strong>—</strong>
                <p>وفق استجابات مزود الخدمة</p>
              </article>
              <article className={styles.statCard}>
                <div className={styles.statTop}><span>حالة الوسيط</span><div className={`${styles.statIcon} ${styles.blue}`}>◎</div></div>
                <strong className={styles.notConnected}>غير مختبر</strong>
                <p>لم يتم اختبار اتصال المزود بعد</p>
              </article>
            </section>

            <section className={styles.contentGrid}>
              <article className={styles.panel}>
                <div className={styles.panelHeading}>
                  <div><h3>أحدث الطلبات</h3><p>أمثلة توضيحية وليست عمليات حقيقية</p></div>
                  <button className={styles.textButton} onClick={() => setActive("requests")}>عرض السجل ←</button>
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <thead><tr><th>رقم الطلب</th><th>الخدمة</th><th>الحالة</th><th>الوقت</th></tr></thead>
                    <tbody>
                      {initialRequests.slice(0, 3).map((r) => (
                        <tr key={r.id}>
                          <td className={styles.transactionId}>{r.id}</td>
                          <td>{r.service}</td>
                          <td><span className={`${styles.status} ${styles[r.status]}`}>{r.status === "success" ? "ناجح (مثال)" : r.status === "pending" ? "معلق (مثال)" : "فشل (مثال)"}</span></td>
                          <td className={styles.muted}>{r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHeading}>
                  <div><h3>حالة الاتصال</h3><p>حالة المكونات الأساسية</p></div>
                  <span className={styles.pulse} />
                </div>
                <div className={styles.connectionRow}>
                  <div className={styles.connectionIcon}>W</div>
                  <div className={styles.connectionInfo}><strong>خادم الوسيط</strong><span>واجهة الموقع</span></div>
                  <span className={styles.available}>يعمل محلياً</span>
                </div>
                <div className={styles.connectionRow}>
                  <div className={styles.connectionIcon}>API</div>
                  <div className={styles.connectionInfo}><strong>مزود السداد</strong><span>الاتصال الخارجي</span></div>
                  <span className={styles.unknown}>غير مختبر</span>
                </div>
                <div className={styles.securityNote}>
                  <span>◇</span>
                  <div><strong>حماية بيانات الاعتماد</strong><p>ستُحفظ مفاتيح المزود على الخادم، ولن تُعرض في واجهة المتصفح.</p></div>
                </div>
              </article>
            </section>
          </>
        )}

        {active === "requests" && (
          <section className={styles.pagePanel}>
            <h1>سجل الطلبات</h1>
            <p>هذه سجلات تجريبية لعرض التصميم فقط. لن تظهر هنا عمليات فعلية حتى نبني التسجيل في الخادم.</p>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>رقم الطلب</th><th>الخدمة</th><th>المزود</th><th>الحالة</th><th>الوقت</th></tr></thead>
                <tbody>{initialRequests.map((r) => <tr key={r.id}><td className={styles.transactionId}>{r.id}</td><td>{r.service}</td><td>{r.provider}</td><td><span className={`${styles.status} ${styles[r.status]}`}>{r.status === "success" ? "ناجح (مثال)" : r.status === "pending" ? "معلق (مثال)" : "فشل (مثال)"}</span></td><td>{r.time}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        )}

        {active === "connection" && (
          <section className={styles.pagePanel}>
            <h1>الاتصال والمزود</h1>
            <p>ستُضاف إعدادات الاتصال بعد بناء واجهة الوسيط واختبارها.</p>
            <div className={styles.infoBox}><strong>عنوان المزود</strong><p>سيُضبط على الخادم داخل متغيرات البيئة، وليس من واجهة عامة.</p></div>
            <div className={styles.infoBox}><strong>تمرير الطلبات</strong><p>سننشئ نقطة نهاية عامة تسمح بالمسارات المحددة فقط، دون الحاجة لبرمجة منطق كل خدمة منفردة.</p></div>
          </section>
        )}

        {active === "security" && (
          <section className={styles.pagePanel}>
            <h1>المصادقة والأمان</h1>
            <p>إعدادات المصادقة لم تُفعّل بعد. هذه الصفحة واجهة أولية فقط.</p>
            <div className={styles.infoBox}><strong>مفتاح تطبيق Star Mobile</strong><p>سنضيف التحقق من مفتاح محفوظ على الخادم، مع إمكانية تغييره دون وضعه في الواجهة.</p></div>
            <div className={styles.infoBox}><strong>أمان الطلبات</strong><p>سنقيّد عناوين المزود والمسارات المسموحة لمنع استخدام الوسيط كوكيل مفتوح.</p></div>
          </section>
        )}

        <footer className={styles.footer}><span>© 2026 Star Proxy</span><span>بوابة الربط الخاصة بستار موبايل</span></footer>
      </section>
    </main>
  );
}