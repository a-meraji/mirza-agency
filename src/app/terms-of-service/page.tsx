import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>
      
      {/* English Version */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service (English)</h2>
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">1. Introduction</h3>
          <p className="mb-2">
            Welcome to our application. These Terms of Service (&quot;Terms&quot;) govern your use of our application, 
            website, and services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree 
            to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Services.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">2. Use of Services</h3>
          <p className="mb-2">
            Our Services are intended for users who are at least 13 years of age. By using our Services, you confirm 
            that you meet this requirement and that you are in compliance with all local laws regarding online conduct.
          </p>
          <p className="mb-2">
            You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-2">
            <li>Use the Services in any way that violates any applicable law or regulation.</li>
            <li>Attempt to interfere with the proper functioning of the Services.</li>
            <li>Engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Services.</li>
            <li>Use the Services to distribute malware, spyware, or other harmful code.</li>
            <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">3. User Accounts</h3>
          <p className="mb-2">
            When you create an account with us, you must provide accurate, complete, and current information. 
            You are responsible for safeguarding the password that you use to access the Services and for any 
            activities or actions under your password.
          </p>
          <p className="mb-2">
            You agree to notify us immediately upon becoming aware of any breach of security or unauthorized 
            use of your account. We reserve the right to terminate accounts, remove or edit content at our sole discretion.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">4. Intellectual Property</h3>
          <p className="mb-2">
            The Services and their original content, features, and functionality are and will remain the exclusive 
            property of our company and its licensors. The Services are protected by copyright, trademark, and other 
            laws of both the country and foreign countries.
          </p>
          <p className="mb-2">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior 
            written consent of our company.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">5. User Content</h3>
          <p className="mb-2">
            Our Services may allow you to post, link, store, share and otherwise make available certain information, 
            text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post 
            on or through the Services, including its legality, reliability, and appropriateness.
          </p>
          <p className="mb-2">
            By posting Content on or through the Services, you grant us the right to use, modify, publicly perform, 
            publicly display, reproduce, and distribute such Content on and through the Services. You retain any and 
            all of your rights to any Content you submit, post, or display on or through the Services and you are 
            responsible for protecting those rights.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">6. Third-Party Links</h3>
          <p className="mb-2">
            Our Services may contain links to third-party websites or services that are not owned or controlled by our company.
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any 
            third-party websites or services. You further acknowledge and agree that we shall not be responsible or liable, 
            directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use 
            of or reliance on any such content, goods, or services available on or through any such websites or services.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">7. Termination</h3>
          <p className="mb-2">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms. Upon termination, your right to use the Services will 
            immediately cease. If you wish to terminate your account, you may simply discontinue using the Services.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">8. Limitation of Liability</h3>
          <p className="mb-2">
            In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be 
            liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of 
            or inability to access or use the Services; (ii) any conduct or content of any third party on the Services; 
            (iii) any content obtained from the Services; and (iv) unauthorized access, use or alteration of your transmissions 
            or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether 
            or not we have been informed of the possibility of such damage.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">9. Disclaimer</h3>
          <p className="mb-2">
            Your use of the Services is at your sole risk. The Services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. 
            The Services are provided without warranties of any kind, whether express or implied, including, but not limited to, 
            implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">10. Changes to Terms</h3>
          <p className="mb-2">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material 
            we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material 
            change will be determined at our sole discretion. By continuing to access or use our Services after those revisions 
            become effective, you agree to be bound by the revised terms.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">11. Contact Us</h3>
          <p className="mb-2">
            If you have any questions about these Terms, please contact us at: merajiamin1997@gmail.com
          </p>
        </section>
      </div>
      
      {/* Persian Version */}
      {/* <div className="rtl text-right">
        <h2 className="text-2xl font-semibold mb-4">شرایط استفاده از خدمات (فارسی)</h2>
        <p className="mb-4">آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۱. مقدمه</h3>
          <p className="mb-2">
            به برنامه ما خوش آمدید. این شرایط استفاده از خدمات (&quot;شرایط&quot;) بر استفاده شما از برنامه، وب‌سایت و خدمات ما (مجموعاً &quot;خدمات&quot;) حاکم است.
            با دسترسی یا استفاده از خدمات ما، شما موافقت می‌کنید که به این شرایط پایبند باشید. اگر با هر بخشی از شرایط مخالف هستید، ممکن است به خدمات دسترسی نداشته باشید.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۲. استفاده از خدمات</h3>
          <p className="mb-2">
            خدمات ما برای کاربرانی در نظر گرفته شده است که حداقل ۱۳ سال سن دارند. با استفاده از خدمات ما، شما تأیید می‌کنید که این الزام را برآورده می‌کنید و با تمام قوانین محلی در مورد رفتار آنلاین مطابقت دارید.
          </p>
          <p className="mb-2">
            شما موافقت می‌کنید که از خدمات فقط برای اهداف قانونی و مطابق با این شرایط استفاده کنید. شما موافقت می‌کنید که:
          </p>
          <ul className="list-disc pr-6 mb-2">
            <li>از خدمات به گونه‌ای که هر قانون یا مقررات قابل اجرا را نقض کند، استفاده نکنید.</li>
            <li>تلاش نکنید در عملکرد صحیح خدمات اختلال ایجاد کنید.</li>
            <li>در هیچ رفتاری که استفاده یا لذت بردن هر کسی از خدمات را محدود یا مهار کند، شرکت نکنید.</li>
            <li>از خدمات برای توزیع بدافزار، جاسوس‌افزار یا سایر کدهای مضر استفاده نکنید.</li>
            <li>تلاش نکنید به سیستم‌ها یا حساب‌های کاربری ما دسترسی غیرمجاز پیدا کنید.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۳. حساب‌های کاربری</h3>
          <p className="mb-2">
            هنگامی که با ما یک حساب کاربری ایجاد می‌کنید، باید اطلاعات دقیق، کامل و به‌روز ارائه دهید. شما مسئول محافظت از رمز عبوری هستید که برای دسترسی به خدمات استفاده می‌کنید و برای هرگونه فعالیت یا اقداماتی که تحت رمز عبور شما انجام می‌شود.
          </p>
          <p className="mb-2">
            شما موافقت می‌کنید که به محض آگاهی از هرگونه نقض امنیتی یا استفاده غیرمجاز از حساب خود، فوراً به ما اطلاع دهید. ما حق داریم حساب‌ها را خاتمه دهیم، محتوا را حذف یا ویرایش کنیم، به صلاحدید خود.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۴. مالکیت معنوی</h3>
          <p className="mb-2">
            خدمات و محتوای اصلی، ویژگی‌ها و عملکرد آن‌ها مالکیت انحصاری شرکت ما و مجوزدهندگان آن هستند و خواهند ماند. خدمات توسط قوانین کپی‌رایت، علامت تجاری و سایر قوانین کشور و کشورهای خارجی محافظت می‌شوند.
          </p>
          <p className="mb-2">
            علائم تجاری و طراحی تجاری ما نمی‌توانند بدون رضایت کتبی قبلی شرکت ما در ارتباط با هیچ محصول یا خدماتی استفاده شوند.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۵. محتوای کاربر</h3>
          <p className="mb-2">
            خدمات ما ممکن است به شما اجازه دهد اطلاعات، متن، گرافیک، ویدیو یا سایر مطالب خاصی (&quot;محتوا&quot;) را پست، لینک، ذخیره، به اشتراک بگذارید و در غیر این صورت در دسترس قرار دهید. شما مسئول محتوایی هستید که در یا از طریق خدمات پست می‌کنید، از جمله قانونی بودن، قابلیت اطمینان و مناسب بودن آن.
          </p>
          <p className="mb-2">
            با پست کردن محتوا در یا از طریق خدمات، شما به ما حق استفاده، اصلاح، اجرای عمومی، نمایش عمومی، تکثیر و توزیع چنین محتوایی را در و از طریق خدمات اعطا می‌کنید. شما تمام حقوق خود را نسبت به هر محتوایی که ارسال، پست یا نمایش می‌دهید حفظ می‌کنید و مسئول محافظت از این حقوق هستید.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۶. پیوندهای شخص ثالث</h3>
          <p className="mb-2">
            خدمات ما ممکن است حاوی پیوندهایی به وب‌سایت‌ها یا خدمات شخص ثالث باشد که تحت مالکیت یا کنترل شرکت ما نیستند. ما هیچ کنترلی بر محتوا، سیاست‌های حریم خصوصی یا شیوه‌های هر وب‌سایت یا خدمات شخص ثالث نداریم و هیچ مسئولیتی در قبال آن‌ها نمی‌پذیریم. شما همچنین تصدیق و موافقت می‌کنید که ما مسئول یا مسئولیت‌پذیر نخواهیم بود، مستقیم یا غیرمستقیم، برای هرگونه آسیب یا زیانی که ناشی از یا ادعا می‌شود ناشی از یا در ارتباط با استفاده یا اتکا به هر محتوا، کالا یا خدمات موجود در یا از طریق چنین وب‌سایت‌ها یا خدماتی باشد.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۷. خاتمه</h3>
          <p className="mb-2">
            ما ممکن است حساب شما را فوراً، بدون اطلاع قبلی یا مسئولیت، به هر دلیلی، از جمله بدون محدودیت اگر شما شرایط را نقض کنید، خاتمه دهیم یا تعلیق کنیم. پس از خاتمه، حق شما برای استفاده از خدمات فوراً متوقف خواهد شد. اگر مایل به خاتمه حساب خود هستید، می‌توانید به سادگی استفاده از خدمات را متوقف کنید.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۸. محدودیت مسئولیت</h3>
          <p className="mb-2">
            در هیچ صورتی، شرکت ما، مدیران، کارمندان، شرکا، نمایندگان، تأمین‌کنندگان یا وابستگان آن، مسئول هیچگونه خسارت غیرمستقیم، تصادفی، ویژه، پیامدی یا تنبیهی، از جمله بدون محدودیت، از دست دادن سود، داده‌ها، استفاده، حسن نیت یا سایر زیان‌های نامشهود، ناشی از (i) دسترسی یا استفاده شما از یا ناتوانی در دسترسی یا استفاده از خدمات؛ (ii) هرگونه رفتار یا محتوای هر شخص ثالث در خدمات؛ (iii) هرگونه محتوای به دست آمده از خدمات؛ و (iv) دسترسی غیرمجاز، استفاده یا تغییر انتقال‌ها یا محتوای شما، چه بر اساس ضمانت، قرارداد، شبه جرم (از جمله سهل‌انگاری) یا هر نظریه حقوقی دیگر، چه ما از امکان چنین آسیبی مطلع شده باشیم یا خیر، نخواهند بود.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۹. سلب مسئولیت</h3>
          <p className="mb-2">
            استفاده شما از خدمات با خطر خود شماست. خدمات به صورت &quot;همانطور که هست&quot; و &quot;همانطور که در دسترس است&quot; ارائه می‌شوند. خدمات بدون هیچگونه ضمانتی از هر نوع، چه صریح یا ضمنی، از جمله، اما نه محدود به، ضمانت‌های ضمنی قابلیت فروش، تناسب برای یک هدف خاص، عدم نقض یا دوره عملکرد ارائه می‌شوند.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۱۰. تغییرات در شرایط</h3>
          <p className="mb-2">
            ما حق داریم، به صلاحدید خود، این شرایط را در هر زمانی اصلاح یا جایگزین کنیم. اگر یک بازنگری مهم باشد، ما تلاش خواهیم کرد حداقل ۳۰ روز قبل از اجرایی شدن هرگونه شرایط جدید، اطلاع دهیم. آنچه یک تغییر مهم را تشکیل می‌دهد، به صلاحدید ما تعیین خواهد شد. با ادامه دسترسی یا استفاده از خدمات ما پس از اجرایی شدن آن بازنگری‌ها، شما موافقت می‌کنید که به شرایط بازنگری شده پایبند باشید.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">۱۱. تماس با ما</h3>
          <p className="mb-2">
            اگر سؤالی درباره این شرایط دارید، لطفاً با ما از طریق: merajiamin1997@gmail.com تماس بگیرید.
          </p>
        </section>
      </div> */}
    </div>
  );
};

export default TermsOfService; 